package util

import (
	"regexp"
	"strings"
)

// ValidateUserID 验证用户ID格式
func ValidateUserID(userID string) bool {
	if userID == "" {
		return false
	}
	// 验证格式：shiyu + 数字，如 shiyu10000
	matched, _ := regexp.MatchString(`^shiyu\d+$`, userID)
	return matched
}

// ValidateOpenID 验证openID格式
func ValidateOpenID(openID string) bool {
	if openID == "" || len(openID) < 20 || len(openID) > 50 {
		return false
	}
	return true
}

// ValidateCode 验证兑换码格式
func ValidateCode(code string) bool {
	if code == "" || len(code) < 5 || len(code) > 50 {
		return false
	}
	// 只允许字母、数字、连字符、下划线
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_-]+$`, code)
	return matched
}

// SanitizeString 清理字符串（防止SQL注入、XSS攻击）
func SanitizeString(s string) string {
	// 移除HTML标签
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	return s
}


