package repository

import (
	"codeya-backend/internal/model"
	"errors"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *model.User) error
	GetByOpenID(openID string) (*model.User, error)
	GetByUserID(userID string) (*model.User, error)
	Update(user *model.User) error
	ExistsByOpenID(openID string) (bool, error)
	ExistsByUserID(userID string) (bool, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetByOpenID(openID string) (*model.User, error) {
	var user model.User
	err := r.db.Where("open_id = ?", openID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByUserID(userID string) (*model.User, error) {
	var user model.User
	err := r.db.Where("user_id = ?", userID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(user *model.User) error {
	return r.db.Model(user).Updates(user).Error
}

func (r *userRepository) ExistsByOpenID(openID string) (bool, error) {
	var count int64
	err := r.db.Model(&model.User{}).Where("open_id = ?", openID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *userRepository) ExistsByUserID(userID string) (bool, error) {
	var count int64
	err := r.db.Model(&model.User{}).Where("user_id = ?", userID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}


