package handler

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/util"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type HealthHandler struct {
	db *gorm.DB
}

func NewHealthHandler(db *gorm.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

// HealthCheck 健康检查
// @Summary 健康检查
// @Description 检查服务健康状态（数据库、Redis连接）
// @Tags 系统
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /health [get]
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	status := gin.H{
		"status": "ok",
		"checks": gin.H{},
	}
	
	allOk := true
	
	// 检查数据库连接
	sqlDB, err := h.db.DB()
	if err != nil {
		status["checks"].(gin.H)["database"] = gin.H{
			"status": "error",
			"message": err.Error(),
		}
		allOk = false
	} else {
		if err := sqlDB.Ping(); err != nil {
			status["checks"].(gin.H)["database"] = gin.H{
				"status": "error",
				"message": err.Error(),
			}
			allOk = false
		} else {
			stats := sqlDB.Stats()
			status["checks"].(gin.H)["database"] = gin.H{
				"status": "ok",
				"open_connections": stats.OpenConnections,
				"in_use": stats.InUse,
				"idle": stats.Idle,
			}
		}
	}
	
	// 检查 Redis 连接
	if _, err := cache.Client.Ping(); err != nil {
		status["checks"].(gin.H)["redis"] = gin.H{
			"status": "error",
			"message": err.Error(),
		}
		allOk = false
	} else {
		status["checks"].(gin.H)["redis"] = gin.H{
			"status": "ok",
		}
	}
	
	if !allOk {
		status["status"] = "degraded"
		util.ErrorWithStatus(c, 503, 1, "服务部分不可用")
		c.JSON(503, util.Response{
			Code:    1,
			Message: "服务部分不可用",
			Data:    status,
		})
		return
	}
	
	util.Success(c, status)
}

