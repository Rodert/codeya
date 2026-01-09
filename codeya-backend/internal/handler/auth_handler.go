package handler

import (
	"codeya-backend/internal/service"
	"codeya-backend/internal/util"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type LoginRequest struct {
	Code string `json:"code" binding:"required"`
}

// Login 登录
// @Summary 用户登录
// @Description 通过微信 code 换取 openid 并登录
// @Tags 认证
// @Accept json
// @Produce json
// @Param request body LoginRequest true "登录请求"
// @Success 200 {object} util.Response
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.BadRequest(c, "参数错误："+err.Error())
		return
	}
	
	if req.Code == "" {
		util.BadRequest(c, "code 不能为空")
		return
	}
	
	result, err := h.authService.Login(req.Code)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, result)
}

// GetUserInfo 获取用户信息
// @Summary 获取用户信息
// @Description 获取当前登录用户的信息
// @Tags 认证
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /api/v1/auth/user-info [get]
func (h *AuthHandler) GetUserInfo(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	userIDStr := userID.(string)
	
	user, err := h.authService.GetUserInfo(userIDStr)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, user)
}


