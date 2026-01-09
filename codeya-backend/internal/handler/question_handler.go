package handler

import (
	"codeya-backend/internal/service"
	"codeya-backend/internal/util"
	"strconv"
	"github.com/gin-gonic/gin"
)

type QuestionHandler struct {
	questionService service.QuestionService
	authService     service.AuthService
}

func NewQuestionHandler(questionService service.QuestionService, authService service.AuthService) *QuestionHandler {
	return &QuestionHandler{
		questionService: questionService,
		authService:     authService,
	}
}

// GetCategories 获取分类列表
// @Summary 获取分类列表
// @Description 获取题目分类列表
// @Tags 题目
// @Accept json
// @Produce json
// @Success 200 {object} util.Response
// @Router /api/v1/questions/categories [get]
func (h *QuestionHandler) GetCategories(c *gin.Context) {
	categories, err := h.questionService.GetCategories()
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, categories)
}

// GetList 获取题目列表
// @Summary 获取题目列表
// @Description 根据分类获取题目列表（分页）
// @Tags 题目
// @Accept json
// @Produce json
// @Param category_key query string true "分类标识"
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(20)
// @Success 200 {object} util.Response
// @Router /api/v1/questions/list [get]
func (h *QuestionHandler) GetList(c *gin.Context) {
	categoryKey := c.Query("category_key")
	if categoryKey == "" {
		util.BadRequest(c, "category_key 不能为空")
		return
	}
	
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	
	questions, total, err := h.questionService.GetList(categoryKey, page, pageSize)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{
		"questions": questions,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

// GetDetail 获取题目详情
// @Summary 获取题目详情
// @Description 获取题目详情
// @Tags 题目
// @Accept json
// @Produce json
// @Param id path int true "题目ID"
// @Success 200 {object} util.Response
// @Router /api/v1/questions/detail/{id} [get]
func (h *QuestionHandler) GetDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		util.BadRequest(c, "题目ID格式错误")
		return
	}
	
	question, err := h.questionService.GetDetail(uint(id))
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, question)
}

type ReadQuestionRequest struct {
	QuestionID uint `json:"question_id" binding:"required"`
}

// Read 记录阅读题目（自动加积分）
// @Summary 记录阅读题目
// @Description 记录阅读题目，自动增加积分，所有用户的阅读记录都保存到后端
// @Tags 题目
// @Accept json
// @Produce json
// @Param request body ReadQuestionRequest true "阅读请求"
// @Success 200 {object} util.Response
// @Router /api/v1/questions/read [post]
func (h *QuestionHandler) Read(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists || userID == nil {
		util.Unauthorized(c, "未登录")
		return
	}
	
	// 获取用户类型（从数据库查询用户信息获取user_type，用于统计）
	userIDStr := userID.(string)
	user, err := h.authService.GetUserInfo(userIDStr)
	if err != nil {
		util.Error(c, 1, "获取用户信息失败："+err.Error())
		return
	}
	
	userType := user.UserType
	if userType == "" {
		userType = "free" // 默认免费用户
	}
	
	var req ReadQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.BadRequest(c, "参数错误："+err.Error())
		return
	}
	
	points, err := h.questionService.RecordRead(userIDStr, req.QuestionID, userType)
	if err != nil {
		util.Error(c, 1, err.Error())
		return
	}
	
	util.Success(c, gin.H{
		"message": "阅读成功",
		"points":  points,
		"user_type": userType,
	})
}

