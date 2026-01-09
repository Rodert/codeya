package service

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"codeya-backend/internal/util"
	"codeya-backend/pkg/wechat"
	"fmt"
	"time"
)

type AuthService interface {
	Login(code string) (*LoginResponse, error)
	GetUserInfo(userID string) (*model.User, error)
}

type LoginResponse struct {
	Token      string      `json:"token"`
	UserID     string      `json:"user_id"`
	OpenID     string      `json:"open_id"`
	UserType   string      `json:"user_type"`
	UserInfo   *model.User `json:"user_info,omitempty"`
}

type authService struct {
	userRepo        repository.UserRepository
	pointsRepo      repository.PointsRepository
	idGenerator     IDGeneratorService
	pointsService   PointsService
	redis           *cache.RedisClient
}

func NewAuthService(
	userRepo repository.UserRepository,
	pointsRepo repository.PointsRepository,
	idGenerator IDGeneratorService,
	pointsService PointsService,
	redis *cache.RedisClient,
) AuthService {
	return &authService{
		userRepo:      userRepo,
		pointsRepo:    pointsRepo,
		idGenerator:   idGenerator,
		pointsService: pointsService,
		redis:         redis,
	}
}

func (s *authService) Login(code string) (*LoginResponse, error) {
	// 1. 调用微信接口获取 openid
	wechatResp, err := wechat.Code2Session(code)
	if err != nil {
		return nil, fmt.Errorf("failed to get wechat session: %w", err)
	}
	
	openID := wechatResp.OpenID
	
	// 2. 检查用户是否存在
	user, err := s.userRepo.GetByOpenID(openID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	
	var userID string
	
	// 3. 如果不存在，创建新用户
	if user == nil {
		// 生成短用户ID
		userID, err = s.idGenerator.GenerateUserID()
		if err != nil {
			return nil, fmt.Errorf("failed to generate user id: %w", err)
		}
		
		// 创建用户
		user = &model.User{
			UserID:   userID,
			OpenID:   openID,
			UnionID:  wechatResp.UnionID,
			UserType: "free", // 默认免费用户
		}
		
		if err := s.userRepo.Create(user); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
		
		// 创建积分记录（初始积分为 1000）
		userPoints := &model.UserPoints{
			UserID:       userID,
			CurrentPoints: 1000,
			MonthlyLimit:  1000,
			LastResetDate: &time.Time{},
		}
		now := time.Now()
		userPoints.LastResetDate = &now
		
		if err := s.pointsRepo.Create(userPoints); err != nil {
			return nil, fmt.Errorf("failed to create user points: %w", err)
		}
		
		// 缓存用户ID映射
		s.redis.Set(fmt.Sprintf(cache.KeyUserOpenID, openID), userID, time.Hour)
	} else {
		userID = user.UserID
		
		// 检查并更新付费状态
		user.CheckAndUpdatePremiumStatus()
		if user.UserType != "premium" && user.CheckAndUpdatePremiumStatus() {
			// 状态已变化，更新数据库
			s.userRepo.Update(user)
		}
		
		// 更新缓存
		s.redis.Set(fmt.Sprintf(cache.KeyUserOpenID, openID), userID, time.Hour)
		
		// 检查积分重置（如果是付费用户且是无限积分，不重置）
		s.pointsService.CheckAndResetIfNeeded(userID)
	}
	
	// 4. 生成 JWT token
	token, err := util.GenerateToken(userID, openID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}
	
	return &LoginResponse{
		Token:    token,
		UserID:   userID,
		OpenID:   openID,
		UserType: user.UserType,
		UserInfo: user,
	}, nil
}

func (s *authService) GetUserInfo(userID string) (*model.User, error) {
	user, err := s.userRepo.GetByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	
	// 检查并更新付费状态
	user.CheckAndUpdatePremiumStatus()
	if user.UserType != "premium" && !user.CheckAndUpdatePremiumStatus() {
		// 状态已变化，更新数据库
		s.userRepo.Update(user)
	}
	
	return user, nil
}


