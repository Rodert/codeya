package repository

import (
	"codeya-backend/internal/model"
	"errors"

	"gorm.io/gorm"
)

type RedemptionRepository interface {
	GetCodeByCode(code string) (*model.RedemptionCode, error)
	UpdateCodeUsedCount(codeID uint) error
	CreateRecord(record *model.RedemptionRecord) error
	HasRedeemedByType(userID string, codeType string) (bool, error)
	HasWatchedAdToday(userID string, date string) (bool, error)
	RecordAdWatch(record *model.AdWatchRecord) error
}

type redemptionRepository struct {
	db *gorm.DB
}

func NewRedemptionRepository(db *gorm.DB) RedemptionRepository {
	return &redemptionRepository{db: db}
}

func (r *redemptionRepository) GetCodeByCode(code string) (*model.RedemptionCode, error) {
	var redemptionCode model.RedemptionCode
	err := r.db.Where("code = ?", code).First(&redemptionCode).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &redemptionCode, nil
}

func (r *redemptionRepository) UpdateCodeUsedCount(codeID uint) error {
	return r.db.Model(&model.RedemptionCode{}).
		Where("id = ?", codeID).
		Update("used_count", gorm.Expr("used_count + ?", 1)).Error
}

func (r *redemptionRepository) CreateRecord(record *model.RedemptionRecord) error {
	return r.db.Create(record).Error
}

func (r *redemptionRepository) HasRedeemedByType(userID string, codeType string) (bool, error) {
	var count int64
	err := r.db.Model(&model.RedemptionRecord{}).
		Joins("JOIN redemption_codes ON redemption_records.code_id = redemption_codes.id").
		Where("redemption_records.user_id = ? AND redemption_codes.code_type = ?", userID, codeType).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *redemptionRepository) HasWatchedAdToday(userID string, date string) (bool, error) {
	var count int64
	err := r.db.Model(&model.AdWatchRecord{}).
		Where("user_id = ? AND watch_date = ?", userID, date).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *redemptionRepository) RecordAdWatch(record *model.AdWatchRecord) error {
	return r.db.Create(record).Error
}
