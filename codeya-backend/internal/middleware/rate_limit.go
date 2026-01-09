package middleware

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/util"
	"fmt"
	"time"
	"github.com/gin-gonic/gin"
)

// RateLimitMiddleware 限流中间件
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取用户ID（如果已认证）
		userID, exists := c.Get("user_id")
		if exists && userID != nil {
			// 按用户限流
			key := fmt.Sprintf(cache.KeyRateLimitAPI, userID, c.Request.URL.Path)
			if !checkRateLimit(key, limit, window) {
				util.Error(c, 429, "请求过于频繁，请稍后再试")
				c.Abort()
				return
			}
		} else {
			// 按IP限流
			ip := c.ClientIP()
			key := fmt.Sprintf(cache.KeyRateLimitIP, ip, c.Request.URL.Path)
			if !checkRateLimit(key, limit, window) {
				util.Error(c, 429, "请求过于频繁，请稍后再试")
				c.Abort()
				return
			}
		}
		
		c.Next()
	}
}

func checkRateLimit(key string, limit int, window time.Duration) bool {
	// 获取当前计数
	count, err := cache.Client.Incr(key)
	if err != nil {
		// Redis 错误时允许请求（降级）
		return true
	}
	
	// 如果是第一次请求，设置过期时间
	if count == 1 {
		cache.Client.Expire(key, window)
	}
	
	// 检查是否超过限制
	return count <= int64(limit)
}


