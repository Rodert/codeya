package main

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/config"
	"codeya-backend/internal/handler"
	"codeya-backend/internal/middleware"
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"codeya-backend/internal/service"
	"fmt"
	"log"
	"time"
	
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	// 1. 加载配置
	if err := config.Init(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	
	// 2. 初始化数据库
	db, err := initDB()
	if err != nil {
		log.Fatalf("Failed to init database: %v", err)
	}
	
	// 3. 初始化Redis
	if err := cache.Init(); err != nil {
		log.Fatalf("Failed to init redis: %v", err)
	}
	
	// 4. 设置 Gin 模式
	gin.SetMode(config.Cfg.Server.Mode)
	
	// 5. 初始化依赖注入
	repos := initRepositories(db)
	services := initServices(repos, db)
	handlers := initHandlers(services, db)
	
	// 6. 初始化路由
	router := initRouter(handlers)
	
	// 7. 启动服务
	addr := fmt.Sprintf("%s:%d", config.Cfg.Server.Host, config.Cfg.Server.Port)
	log.Printf("Server starting on %s\n", addr)
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func initDB() (*gorm.DB, error) {
	dsn := config.GetDSN()
	
	var logLevel logger.LogLevel
	switch config.Cfg.Server.Mode {
	case "debug":
		logLevel = logger.Info
	case "test":
		logLevel = logger.Warn
	default:
		logLevel = logger.Error
	}
	
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}
	
	// 配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}
	
	sqlDB.SetMaxIdleConns(config.Cfg.Database.MaxIdleConns)
	sqlDB.SetMaxOpenConns(config.Cfg.Database.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Duration(config.Cfg.Database.ConnMaxLifetime) * time.Second)
	
	// 自动迁移（生产环境建议使用迁移脚本）
	if err := autoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to auto migrate: %w", err)
	}
	
	return db, nil
}

func autoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&model.User{},
		&model.UserPoints{},
		&model.PointsRecord{},
		&model.RedemptionCode{},
		&model.RedemptionRecord{},
		&model.AdWatchRecord{},
		&model.Question{},
		&model.QuestionReadRecord{},
		&model.Category{},
	)
}

func initRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		User:        repository.NewUserRepository(db),
		Points:      repository.NewPointsRepository(db),
		Redemption:  repository.NewRedemptionRepository(db),
		Question:    repository.NewQuestionRepository(db),
	}
}

type Repositories struct {
	User       repository.UserRepository
	Points     repository.PointsRepository
	Redemption repository.RedemptionRepository
	Question   repository.QuestionRepository
}

func initServices(repos *Repositories, db *gorm.DB) *Services {
	idGenerator := service.NewIDGeneratorService(cache.Client)
	pointsService := service.NewPointsService(repos.Points, repos.User, cache.Client)
	authService := service.NewAuthService(repos.User, repos.Points, idGenerator, pointsService, cache.Client)
	redemptionService := service.NewRedemptionService(repos.Redemption, repos.Points, repos.User, pointsService, cache.Client)
	questionService := service.NewQuestionService(repos.Question, pointsService)
	userService := service.NewUserService(repos.User, repos.Question, cache.Client)
	
	return &Services{
		IDGenerator:     idGenerator,
		Auth:            authService,
		Points:          pointsService,
		Redemption:      redemptionService,
		Question:        questionService,
		User:            userService,
	}
}

type Services struct {
	IDGenerator service.IDGeneratorService
	Auth        service.AuthService
	Points      service.PointsService
	Redemption  service.RedemptionService
	Question    service.QuestionService
	User        service.UserService
}

func initHandlers(services *Services, db *gorm.DB) *Handlers {
	return &Handlers{
		Auth:       handler.NewAuthHandler(services.Auth),
		Points:     handler.NewPointsHandler(services.Points),
		Redemption: handler.NewRedemptionHandler(services.Redemption),
		Question:   handler.NewQuestionHandler(services.Question, services.Auth),
		User:       handler.NewUserHandler(services.User),
		Health:     handler.NewHealthHandler(db),
	}
}

type Handlers struct {
	Auth       *handler.AuthHandler
	Points     *handler.PointsHandler
	Redemption *handler.RedemptionHandler
	Question   *handler.QuestionHandler
	User       *handler.UserHandler
	Health     *handler.HealthHandler
}

func initRouter(handlers *Handlers) *gin.Engine {
	router := gin.New()
	
	// 全局中间件
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORSMiddleware())
	
	// 健康检查（无需认证）
	router.GET("/health", handlers.Health.HealthCheck)
	
	// API 路由
	api := router.Group("/api/v1")
	{
		// 认证相关（无需认证）
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Auth.Login)
			auth.GET("/user-info", middleware.AuthMiddleware(), handlers.Auth.GetUserInfo)
		}
		
		// 积分相关（需要认证）
		points := api.Group("/points")
		points.Use(middleware.AuthMiddleware())
		points.Use(middleware.RateLimitMiddleware(60, time.Minute)) // 每分钟60次
		{
			points.GET("/current", handlers.Points.GetCurrent)
			points.GET("/monthly", handlers.Points.GetMonthlyInfo)
			points.GET("/records", handlers.Points.GetRecords)
		}
		
		// 兑换相关（需要认证）
		redemption := api.Group("/redemption")
		redemption.Use(middleware.AuthMiddleware())
		redemption.Use(middleware.RateLimitMiddleware(10, time.Minute)) // 每分钟10次
		{
			redemption.POST("/wechat-free", handlers.Redemption.RedeemWechatFree)
			redemption.POST("/ads", handlers.Redemption.RedeemAds)
			redemption.POST("/yearly-unlimited", handlers.Redemption.RedeemYearlyUnlimited)
		}
		
		// 题目相关
		questions := api.Group("/questions")
		{
			questions.GET("/categories", handlers.Question.GetCategories)
			questions.GET("/list", handlers.Question.GetList)
			questions.GET("/detail/:id", handlers.Question.GetDetail)
			questions.POST("/read", middleware.AuthMiddleware(), middleware.RateLimitMiddleware(30, time.Minute), handlers.Question.Read)
		}
		
		// 用户相关（需要认证）
		user := api.Group("/user")
		user.Use(middleware.AuthMiddleware())
		user.Use(middleware.RateLimitMiddleware(10, time.Minute)) // 每分钟10次
		{
			user.POST("/migrate-data", handlers.User.MigrateData)
		}
	}
	
	return router
}

