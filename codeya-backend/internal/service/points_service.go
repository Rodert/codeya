package service

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"errors"
	"fmt"
	"time"
)

type PointsService interface {
	GetCurrentPoints(userID string) (*PointsInfo, error)
	AddPoints(userID string, points int, source, sourceID, description string) error
	CheckAndResetIfNeeded(userID string) error
	GetRecords(userID string, page, pageSize int) ([]model.PointsRecord, int64, error)
	GetMonthlyInfo(userID string) (*MonthlyPointsInfo, error)
}

type PointsInfo struct {
	CurrentPoints     int       `json:"current_points"`
	MonthlyLimit      int       `json:"monthly_limit"`
	Remaining         int       `json:"remaining"`
	LastResetDate     *time.Time `json:"last_reset_date"`
	IsUnlimited       bool      `json:"is_unlimited"`
	UnlimitedExpireDate *time.Time `json:"unlimited_expire_date"`
}

type MonthlyPointsInfo struct {
	CurrentPoints     int       `json:"current_points"`
	MonthlyLimit      int       `json:"monthly_limit"`
	Remaining         int       `json:"remaining"`
	LastResetDate     *time.Time `json:"last_reset_date"`
	IsUnlimited       bool      `json:"is_unlimited"`
	UnlimitedExpireDate *time.Time `json:"unlimited_expire_date"`
	MonthStart        time.Time `json:"month_start"`
	MonthEnd          time.Time `json:"month_end"`
}

type pointsService struct {
	pointsRepo repository.PointsRepository
	userRepo   repository.UserRepository
	redis      *cache.RedisClient
}

func NewPointsService(
	pointsRepo repository.PointsRepository,
	userRepo repository.UserRepository,
	redis *cache.RedisClient,
) PointsService {
	return &pointsService{
		pointsRepo: pointsRepo,
		userRepo:   userRepo,
		redis:      redis,
	}
}

func (s *pointsService) GetCurrentPoints(userID string) (*PointsInfo, error) {
	// 先检查积分重置
	if err := s.CheckAndResetIfNeeded(userID); err != nil {
		return nil, err
	}
	
	// 获取用户积分信息（先查缓存）
	cacheKey := fmt.Sprintf(cache.KeyUserPoints, userID)
	var userPoints model.UserPoints
	
	err := s.redis.GetJSON(cacheKey, &userPoints)
	if err != nil {
		// 缓存未命中，查数据库
		userPointsPtr, err := s.pointsRepo.GetByUserID(userID)
		if err != nil {
			return nil, fmt.Errorf("failed to get user points: %w", err)
		}
		if userPointsPtr == nil {
			return nil, errors.New("user points not found")
		}
		userPoints = *userPointsPtr
		
		// 写入缓存（5分钟过期）
		s.redis.Set(cacheKey, userPoints, 5*time.Minute)
	}
	
	remaining := userPoints.MonthlyLimit - userPoints.CurrentPoints
	if remaining < 0 {
		remaining = 0
	}
	
	return &PointsInfo{
		CurrentPoints:      userPoints.CurrentPoints,
		MonthlyLimit:       userPoints.MonthlyLimit,
		Remaining:          remaining,
		LastResetDate:      userPoints.LastResetDate,
		IsUnlimited:        userPoints.IsUnlimited,
		UnlimitedExpireDate: userPoints.UnlimitedExpireDate,
	}, nil
}

func (s *pointsService) CheckAndResetIfNeeded(userID string) error {
	// 检查今天是否已检查过（使用 Redis 标记）
	now := time.Now()
	checkKey := fmt.Sprintf(cache.KeyCheckReset, userID, now.Format("2006-01"))
	
	// 检查标记是否存在
	exists, err := s.redis.Exists(checkKey)
	if err == nil && exists {
		// 今天已检查过，直接返回
		return nil
	}
	
	// 获取用户信息（检查是否为付费用户）
	user, err := s.userRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return errors.New("user not found")
	}
	
	// 如果是付费用户且是无限积分，不需要重置
	userPoints, err := s.pointsRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user points: %w", err)
	}
	if userPoints == nil {
		return errors.New("user points not found")
	}
	
	// 检查无限积分用户
	if userPoints.IsUnlimited {
		if userPoints.UnlimitedExpireDate != nil && now.After(*userPoints.UnlimitedExpireDate) {
			// 无限积分已过期，恢复为普通用户
			userPoints.IsUnlimited = false
			userPoints.UnlimitedExpireDate = nil
			s.pointsRepo.Update(userPoints)
		} else {
			// 无限积分用户不需要重置
			// 设置检查标记（32天过期，确保跨月时能检查）
			s.redis.Set(checkKey, "checked", 32*24*time.Hour)
			return nil
		}
	}
	
	// 检查是否需要重置（跨月）
	if !userPoints.CheckIfNeedReset() {
		// 不需要重置，设置检查标记
		s.redis.Set(checkKey, "checked", 32*24*time.Hour)
		return nil
	}
	
	// 使用分布式锁防止并发重置
	lockKey := fmt.Sprintf(cache.KeyLockReset, userID)
	locked, err := s.redis.SetNX(lockKey, "locked", 5*time.Minute)
	if err != nil || !locked {
		// 获取锁失败，可能其他请求正在重置，直接返回
		return nil
	}
	defer s.redis.Del(lockKey)
	
	// 重置积分到 1000
	err = s.pointsRepo.ResetMonthlyPoints(userID)
	if err != nil {
		return fmt.Errorf("failed to reset monthly points: %w", err)
	}
	
	// 清除缓存
	cacheKey := fmt.Sprintf(cache.KeyUserPoints, userID)
	s.redis.Del(cacheKey)
	
	// 设置检查标记
	s.redis.Set(checkKey, "checked", 32*24*time.Hour)
	
	return nil
}

func (s *pointsService) AddPoints(userID string, points int, source, sourceID, description string) error {
	// 先检查积分重置
	if err := s.CheckAndResetIfNeeded(userID); err != nil {
		return err
	}
	
	// 获取用户积分信息
	userPoints, err := s.pointsRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user points: %w", err)
	}
	if userPoints == nil {
		return errors.New("user points not found")
	}
	
	// 检查无限积分用户
	if userPoints.IsUnlimited {
		if userPoints.UnlimitedExpireDate != nil && time.Now().After(*userPoints.UnlimitedExpireDate) {
			// 无限积分已过期，恢复为普通用户
			userPoints.IsUnlimited = false
			userPoints.UnlimitedExpireDate = nil
			s.pointsRepo.Update(userPoints)
		} else {
			// 无限积分用户，直接增加积分
			return s.doAddPoints(userID, points, source, sourceID, description)
		}
	}
	
	// 检查是否超过月度上限
	newPoints := userPoints.CurrentPoints + points
	if newPoints > userPoints.MonthlyLimit {
		return errors.New(fmt.Sprintf("本月积分已达上限（%d），下月1号重置", userPoints.MonthlyLimit))
	}
	
	// 增加积分
	return s.doAddPoints(userID, points, source, sourceID, description)
}

func (s *pointsService) doAddPoints(userID string, points int, source, sourceID, description string) error {
	// 使用事务：增加积分 + 插入积分记录
	// 注意：这里需要在Repository层实现事务，或者在这里使用GORM事务
	
	// 增加积分
	if err := s.pointsRepo.AddPoints(userID, points); err != nil {
		return fmt.Errorf("failed to add points: %w", err)
	}
	
	// 插入积分记录
	record := &model.PointsRecord{
		UserID:      userID,
		Points:      points,
		Source:      source,
		SourceID:    sourceID,
		Description: description,
	}
	if err := s.pointsRepo.CreateRecord(record); err != nil {
		return fmt.Errorf("failed to create points record: %w", err)
	}
	
	// 清除缓存
	cacheKey := fmt.Sprintf(cache.KeyUserPoints, userID)
	s.redis.Del(cacheKey)
	
	return nil
}

func (s *pointsService) GetRecords(userID string, page, pageSize int) ([]model.PointsRecord, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}
	
	return s.pointsRepo.GetRecords(userID, page, pageSize)
}

func (s *pointsService) GetMonthlyInfo(userID string) (*MonthlyPointsInfo, error) {
	// 先检查积分重置
	if err := s.CheckAndResetIfNeeded(userID); err != nil {
		return nil, err
	}
	
	pointsInfo, err := s.GetCurrentPoints(userID)
	if err != nil {
		return nil, err
	}
	
	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	monthEnd := monthStart.AddDate(0, 1, 0).Add(-time.Nanosecond)
	
	return &MonthlyPointsInfo{
		CurrentPoints:      pointsInfo.CurrentPoints,
		MonthlyLimit:       pointsInfo.MonthlyLimit,
		Remaining:          pointsInfo.Remaining,
		LastResetDate:      pointsInfo.LastResetDate,
		IsUnlimited:        pointsInfo.IsUnlimited,
		UnlimitedExpireDate: pointsInfo.UnlimitedExpireDate,
		MonthStart:         monthStart,
		MonthEnd:           monthEnd,
	}, nil
}


