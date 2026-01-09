package repository

import (
	"codeya-backend/internal/model"
	"errors"
	"gorm.io/gorm"
)

type QuestionRepository interface {
	GetByID(id uint) (*model.Question, error)
	GetByCategory(categoryKey string, page, pageSize int) ([]model.Question, int64, error)
	GetCategories() ([]model.Category, error)
	CreateReadRecord(record *model.QuestionReadRecord) error
	HasReadRecord(userID string, questionID uint) (bool, error)
	IncrementViewCount(questionID uint) error
}

type questionRepository struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepository{db: db}
}

func (r *questionRepository) GetByID(id uint) (*model.Question, error) {
	var question model.Question
	err := r.db.Where("id = ?", id).First(&question).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &question, nil
}

func (r *questionRepository) GetByCategory(categoryKey string, page, pageSize int) ([]model.Question, int64, error) {
	var questions []model.Question
	var total int64
	
	query := r.db.Model(&model.Question{}).Where("category_key = ?", categoryKey)
	
	// 获取总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 分页查询
	offset := (page - 1) * pageSize
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&questions).Error; err != nil {
		return nil, 0, err
	}
	
	return questions, total, nil
}

func (r *questionRepository) GetCategories() ([]model.Category, error) {
	var categories []model.Category
	err := r.db.Order("`order` ASC").Find(&categories).Error
	return categories, err
}

func (r *questionRepository) CreateReadRecord(record *model.QuestionReadRecord) error {
	return r.db.Create(record).Error
}

func (r *questionRepository) HasReadRecord(userID string, questionID uint) (bool, error) {
	var count int64
	err := r.db.Model(&model.QuestionReadRecord{}).
		Where("user_id = ? AND question_id = ?", userID, questionID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *questionRepository) IncrementViewCount(questionID uint) error {
	return r.db.Model(&model.Question{}).
		Where("id = ?", questionID).
		Update("view_count", gorm.Expr("view_count + ?", 1)).Error
}


