package repository

import (
	"codeya-backend/internal/model"
	"errors"
	"gorm.io/gorm"
	"time"
)

type PointsRepository interface {
	Create(userPoints *model.UserPoints) error
	GetByUserID(userID string) (*model.UserPoints, error)
	Update(userPoints *model.UserPoints) error
	AddPoints(userID string, points int) error
	ResetMonthlyPoints(userID string) error
	CreateRecord(record *model.PointsRecord) error
	GetRecords(userID string, page, pageSize int) ([]model.PointsRecord, int64, error)
}

type pointsRepository struct {
	db *gorm.DB
}

func NewPointsRepository(db *gorm.DB) PointsRepository {
	return &pointsRepository{db: db}
}

func (r *pointsRepository) Create(userPoints *model.UserPoints) error {
	return r.db.Create(userPoints).Error
}

func (r *pointsRepository) GetByUserID(userID string) (*model.UserPoints, error) {
	var userPoints model.UserPoints
	err := r.db.Where("user_id = ?", userID).First(&userPoints).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &userPoints, nil
}

func (r *pointsRepository) Update(userPoints *model.UserPoints) error {
	return r.db.Model(userPoints).Updates(userPoints).Error
}

func (r *pointsRepository) AddPoints(userID string, points int) error {
	return r.db.Model(&model.UserPoints{}).
		Where("user_id = ?", userID).
		Update("current_points", gorm.Expr("current_points + ?", points)).Error
}

func (r *pointsRepository) ResetMonthlyPoints(userID string) error {
	now := time.Now()
	return r.db.Model(&model.UserPoints{}).
		Where("user_id = ?", userID).
		Updates(map[string]interface{}{
			"current_points":  1000,
			"last_reset_date": now,
		}).Error
}

func (r *pointsRepository) CreateRecord(record *model.PointsRecord) error {
	return r.db.Create(record).Error
}

func (r *pointsRepository) GetRecords(userID string, page, pageSize int) ([]model.PointsRecord, int64, error) {
	var records []model.PointsRecord
	var total int64
	
	query := r.db.Model(&model.PointsRecord{}).Where("user_id = ?", userID)
	
	// 获取总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 分页查询
	offset := (page - 1) * pageSize
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&records).Error; err != nil {
		return nil, 0, err
	}
	
	return records, total, nil
}


