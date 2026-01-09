package model

import (
	"time"
	"gorm.io/gorm"
)

// Question 题目表
type Question struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	CategoryKey string         `gorm:"index;size:50;not null;comment:分类标识" json:"category_key"`
	Title       string         `gorm:"size:200;not null;comment:题目标题" json:"title"`
	Difficulty  string         `gorm:"index;size:20;not null;comment:难度" json:"difficulty"` // 简单/中等/困难
	ViewCount   int            `gorm:"default:0;comment:浏览次数" json:"view_count"`
	Description string         `gorm:"type:text;comment:题目描述" json:"description"`
	Code        string         `gorm:"type:text;comment:代码示例" json:"code"`
	MdContent   string         `gorm:"type:longtext;comment:Markdown内容" json:"md_content"`
	Tags        string         `gorm:"type:json;comment:标签数组" json:"tags"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Question) TableName() string {
	return "questions"
}

// QuestionReadRecord 题目阅读记录表（仅付费用户）
type QuestionReadRecord struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	UserID     string         `gorm:"uniqueIndex:uk_user_question;size:50;not null;index;comment:短用户ID" json:"user_id"`
	QuestionID uint           `gorm:"uniqueIndex:uk_user_question;index;not null;comment:题目ID" json:"question_id"`
	ReadAt     time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"read_at"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (QuestionReadRecord) TableName() string {
	return "question_read_records"
}

// Category 分类表（如果需要单独管理分类）
type Category struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	Key          string         `gorm:"uniqueIndex;size:50;not null;comment:分类标识" json:"key"`
	Name         string         `gorm:"size:100;not null;comment:分类名称" json:"name"`
	Description  string         `gorm:"type:text;comment:分类描述" json:"description"`
	QuestionCount int           `gorm:"default:0;comment:题目数量" json:"question_count"`
	Icon         string         `gorm:"size:500;comment:分类图标" json:"icon"`
	Order        int            `gorm:"default:0;index;comment:排序" json:"order"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Category) TableName() string {
	return "categories"
}


