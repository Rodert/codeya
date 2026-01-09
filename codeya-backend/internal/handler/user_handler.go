package handler

import (
	"codeya-backend/internal/service"
	"codeya-backend/internal/util"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

type MigrateDataRequest struct {
	ReadRecords []service.ReadRecord `json:"read_records" binding:"required"`
}

// MigrateData 迁移本地数据到后端
// @Summary 迁移本地数据到后端
// @Description 将小程序本地历史数据迁移到后端（主要用于从旧版本小程序迁移数据，现在所有用户数据都保存在后端）
// @Tags 用户
// @Accept json
// @Produce json
// @Param request body MigrateDataRequest true "迁移请求"
// @Success 200 {object} util.Response
// @Router /api/v1/user/migrate-data [post]
func (h *UserHandler) MigrateData(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	var req MigrateDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.BadRequest(c, "参数错误："+err.Error())
		return
	}
	
	userIDStr := userID.(string)
	
	result, err := h.userService.MigrateData(userIDStr, req.ReadRecords)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, result)
}

