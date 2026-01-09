package model

import (
	"time"
	"gorm.io/gorm"
)

// 兑换码类型常量
const (
	CodeTypeWechatFree      = "wechat_free"      // 公众号免费积分
	CodeTypeYearlyUnlimited = "yearly_unlimited" // 年费无限积分
)

// RedemptionCode 兑换码表
type RedemptionCode struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	Code       string         `gorm:"uniqueIndex;size:50;not null;comment:兑换码" json:"code"`
	CodeType   string         `gorm:"size:20;not null;index;comment:类型" json:"code_type"`
	Points     *int           `gorm:"comment:积分数量" json:"points"` // wechat_free 类型使用
	ExpireDate *time.Time     `gorm:"type:date;index;comment:过期日期" json:"expire_date"`
	MaxUses    int            `gorm:"default:1;comment:最大使用次数" json:"max_uses"`
	UsedCount  int            `gorm:"default:0;comment:已使用次数" json:"used_count"`
	IsActive   bool           `gorm:"default:true;comment:是否激活" json:"is_active"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (RedemptionCode) TableName() string {
	return "redemption_codes"
}

// IsValid 检查兑换码是否有效
func (rc *RedemptionCode) IsValid() bool {
	if !rc.IsActive {
		return false
	}
	if rc.UsedCount >= rc.MaxUses {
		return false
	}
	if rc.ExpireDate != nil && time.Now().After(*rc.ExpireDate) {
		return false
	}
	return true
}

// RedemptionRecord 兑换记录表
type RedemptionRecord struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	UserID     string         `gorm:"index;size:50;not null;comment:短用户ID" json:"user_id"`
	CodeID     uint           `gorm:"index;not null;comment:兑换码ID" json:"code_id"`
	Code       string         `gorm:"size:50;not null;comment:兑换码" json:"code"`
	RedeemedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"redeemed_at"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (RedemptionRecord) TableName() string {
	return "redemption_records"
}

// AdWatchRecord 广告观看记录表
type AdWatchRecord struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	UserID      string         `gorm:"uniqueIndex:uk_user_date;size:50;not null;comment:短用户ID" json:"user_id"`
	WatchDate   time.Time      `gorm:"uniqueIndex:uk_user_date;type:date;not null;comment:观看日期" json:"watch_date"`
	PointsEarned int           `gorm:"default:200;comment:获得的积分" json:"points_earned"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (AdWatchRecord) TableName() string {
	return "ad_watch_records"
}


