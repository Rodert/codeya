package middleware

import (
	"codeya-backend/internal/util"
	"strings"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware JWT 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从请求头获取 token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			util.Unauthorized(c, "缺少认证令牌")
			c.Abort()
			return
		}
		
		// 解析 Bearer token
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			util.Unauthorized(c, "认证令牌格式错误")
			c.Abort()
			return
		}
		
		token := parts[1]
		
		// 解析 token
		claims, err := util.ParseToken(token)
		if err != nil {
			util.Unauthorized(c, "无效的认证令牌")
			c.Abort()
			return
		}
		
		// 将用户信息存储到上下文中
		c.Set("user_id", claims.UserID)
		c.Set("open_id", claims.OpenID)
		
		c.Next()
	}
}


