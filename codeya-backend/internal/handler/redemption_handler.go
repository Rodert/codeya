package handler

import (
	"codeya-backend/internal/service"
	"codeya-backend/internal/util"
	"github.com/gin-gonic/gin"
)

type RedemptionHandler struct {
	redemptionService service.RedemptionService
}

func NewRedemptionHandler(redemptionService service.RedemptionService) *RedemptionHandler {
	return &RedemptionHandler{redemptionService: redemptionService}
}

type RedeemCodeRequest struct {
	Code string `json:"code" binding:"required"`
}

// RedeemWechatFree 兑换公众号免费积分
// @Summary 兑换公众号免费积分
// @Description 兑换公众号免费积分（每个用户只有一次机会）
// @Tags 兑换
// @Accept json
// @Produce json
// @Param request body RedeemCodeRequest true "兑换请求"
// @Success 200 {object} util.Response
// @Router /api/v1/redemption/wechat-free [post]
func (h *RedemptionHandler) RedeemWechatFree(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	var req RedeemCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.BadRequest(c, "参数错误："+err.Error())
		return
	}
	
	userIDStr := userID.(string)
	
	err := h.redemptionService.RedeemWechatFree(userIDStr, req.Code)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{"message": "兑换成功"})
}

// RedeemAds 观看广告获取积分
// @Summary 观看广告获取积分
// @Description 观看广告获取积分（每天200分，限一次）
// @Tags 兑换
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /api/v1/redemption/ads [post]
func (h *RedemptionHandler) RedeemAds(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	userIDStr := userID.(string)
	
	err := h.redemptionService.RedeemAds(userIDStr)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{"message": "观看成功，获得200积分"})
}

// RedeemYearlyUnlimited 兑换年费无限积分
// @Summary 兑换年费无限积分
// @Description 兑换年费无限积分（升级为付费用户）
// @Tags 兑换
// @Accept json
// @Produce json
// @Param request body RedeemCodeRequest true "兑换请求"
// @Success 200 {object} util.Response
// @Router /api/v1/redemption/yearly-unlimited [post]
func (h *RedemptionHandler) RedeemYearlyUnlimited(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	var req RedeemCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.BadRequest(c, "参数错误："+err.Error())
		return
	}
	
	userIDStr := userID.(string)
	
	err := h.redemptionService.RedeemYearlyUnlimited(userIDStr, req.Code)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{"message": "兑换成功，已升级为付费用户"})
}


