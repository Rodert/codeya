package util

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Response 统一响应格式
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// 响应状态码
const (
	CodeSuccess = 0
	CodeError   = 1
)

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: "success",
		Data:    data,
	})
}

// SuccessWithMessage 成功响应（带消息）
func SuccessWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: message,
		Data:    data,
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

// ErrorWithStatus 错误响应（自定义HTTP状态码）
func ErrorWithStatus(c *gin.Context, httpStatus int, code int, message string) {
	c.JSON(httpStatus, Response{
		Code:    code,
		Message: message,
	})
}

// BadRequest 400 错误
func BadRequest(c *gin.Context, message string) {
	ErrorWithStatus(c, http.StatusBadRequest, CodeError, message)
}

// Unauthorized 401 错误
func Unauthorized(c *gin.Context, message string) {
	ErrorWithStatus(c, http.StatusUnauthorized, CodeError, message)
}

// Forbidden 403 错误
func Forbidden(c *gin.Context, message string) {
	ErrorWithStatus(c, http.StatusForbidden, CodeError, message)
}

// NotFound 404 错误
func NotFound(c *gin.Context, message string) {
	ErrorWithStatus(c, http.StatusNotFound, CodeError, message)
}

// InternalServerError 500 错误
func InternalServerError(c *gin.Context, message string) {
	ErrorWithStatus(c, http.StatusInternalServerError, CodeError, message)
}


