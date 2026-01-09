package handler

import (
	"codeya-backend/internal/service"
	"codeya-backend/internal/util"
	"strconv"
	"github.com/gin-gonic/gin"
)

type PointsHandler struct {
	pointsService service.PointsService
}

func NewPointsHandler(pointsService service.PointsService) *PointsHandler {
	return &PointsHandler{pointsService: pointsService}
}

// GetCurrent 获取当前积分
// @Summary 获取当前积分
// @Description 获取当前用户的积分信息
// @Tags 积分
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /api/v1/points/current [get]
func (h *PointsHandler) GetCurrent(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	userIDStr := userID.(string)
	
	points, err := h.pointsService.GetCurrentPoints(userIDStr)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, points)
}

// GetMonthlyInfo 获取月度积分信息
// @Summary 获取月度积分信息
// @Description 获取当前用户的月度积分信息
// @Tags 积分
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /api/v1/points/monthly [get]
func (h *PointsHandler) GetMonthlyInfo(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	userIDStr := userID.(string)
	
	info, err := h.pointsService.GetMonthlyInfo(userIDStr)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, info)
}

// GetRecords 获取积分记录
// @Summary 获取积分记录
// @Description 获取当前用户的积分记录列表（分页）
// @Tags 积分
// @Accept json
// @Produce json
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(20)
// @Success 200 {object} util.Response
// @Router /api/v1/points/records [get]
func (h *PointsHandler) GetRecords(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	userIDStr := userID.(string)
	
	// 获取分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	
	records, total, err := h.pointsService.GetRecords(userIDStr, page, pageSize)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{
		"records": records,
		"total":   total,
		"page":    page,
		"page_size": pageSize,
	})
}


