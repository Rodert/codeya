package model

import (
	"time"
	"gorm.io/gorm"
)

// User 用户表
type User struct {
	ID               uint           `gorm:"primarykey" json:"id"`
	UserID           string         `gorm:"uniqueIndex;size:50;not null;comment:短用户ID" json:"user_id"`
	OpenID           string         `gorm:"uniqueIndex;size:100;not null;comment:微信openId" json:"open_id"`
	UnionID          string         `gorm:"index;size:100;comment:微信unionId" json:"union_id"`
	Nickname         string         `gorm:"size:100;comment:昵称" json:"nickname"`
	AvatarURL        string         `gorm:"size:500;comment:头像URL" json:"avatar_url"`
	UserType         string         `gorm:"size:20;default:'free';index;comment:用户类型" json:"user_type"` // free/premium
	PremiumExpireDate *time.Time    `gorm:"type:date;index;comment:付费到期日期" json:"premium_expire_date"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

func (User) TableName() string {
	return "users"
}

// IsPremium 判断是否为付费用户
func (u *User) IsPremium() bool {
	if u.UserType != "premium" {
		return false
	}
	if u.PremiumExpireDate == nil {
		return false
	}
	// 检查是否过期
	return time.Now().Before(*u.PremiumExpireDate)
}

// CheckAndUpdatePremiumStatus 检查并更新付费状态
func (u *User) CheckAndUpdatePremiumStatus() bool {
	if u.UserType == "premium" && u.PremiumExpireDate != nil {
		if time.Now().After(*u.PremiumExpireDate) {
			// 已过期，恢复为免费用户
			u.UserType = "free"
			return false
		}
		return true
	}
	return false
}


