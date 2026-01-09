package model

import (
	"time"

	"gorm.io/gorm"
)

// UserPoints 用户积分表
type UserPoints struct {
	ID                  uint           `gorm:"primarykey" json:"id"`
	UserID              string         `gorm:"uniqueIndex;size:50;not null;comment:短用户ID" json:"user_id"`
	CurrentPoints       int            `gorm:"default:0;comment:当前积分" json:"current_points"`
	MonthlyLimit        int            `gorm:"default:1000;comment:每月积分上限" json:"monthly_limit"`
	LastResetDate       *time.Time     `gorm:"type:date;index;comment:上次重置日期" json:"last_reset_date"`
	IsUnlimited         bool           `gorm:"default:false;index;comment:是否无限积分" json:"is_unlimited"`
	UnlimitedExpireDate *time.Time     `gorm:"type:date;comment:无限积分到期日期" json:"unlimited_expire_date"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}

func (UserPoints) TableName() string {
	return "user_points"
}

// PointsRecord 积分记录表
type PointsRecord struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	UserID      string         `gorm:"index;size:50;not null;comment:短用户ID" json:"user_id"`
	Points      int            `gorm:"not null;comment:积分变化值" json:"points"`
	Source      string         `gorm:"size:50;not null;index;comment:来源类型" json:"source"` // question/ads/wechat/yearly_code
	SourceID    string         `gorm:"size:100;comment:来源ID" json:"source_id"`
	Description string         `gorm:"size:200;comment:描述" json:"description"`
	CreatedAt   time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (PointsRecord) TableName() string {
	return "points_records"
}

// CheckIfNeedReset 检查是否需要重置积分（跨月）
func (up *UserPoints) CheckIfNeedReset() bool {
	if up.IsUnlimited {
		return false
	}

	now := time.Now()
	currentMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	if up.LastResetDate == nil {
		return true
	}

	lastResetMonth := time.Date(up.LastResetDate.Year(), up.LastResetDate.Month(), 1, 0, 0, 0, 0, up.LastResetDate.Location())

	return currentMonth.After(lastResetMonth)
}
