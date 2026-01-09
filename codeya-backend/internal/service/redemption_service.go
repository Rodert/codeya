package service

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"errors"
	"fmt"
	"time"
)

type RedemptionService interface {
	RedeemWechatFree(userID string, code string) error
	RedeemAds(userID string) error
	RedeemYearlyUnlimited(userID string, code string) error
}

type redemptionService struct {
	redemptionRepo repository.RedemptionRepository
	pointsRepo     repository.PointsRepository
	userRepo       repository.UserRepository
	pointsService  PointsService
	redis          *cache.RedisClient
}

func NewRedemptionService(
	redemptionRepo repository.RedemptionRepository,
	pointsRepo repository.PointsRepository,
	userRepo repository.UserRepository,
	pointsService PointsService,
	redis *cache.RedisClient,
) RedemptionService {
	return &redemptionService{
		redemptionRepo: redemptionRepo,
		pointsRepo:     pointsRepo,
		userRepo:       userRepo,
		pointsService:  pointsService,
		redis:          redis,
	}
}

func (s *redemptionService) RedeemWechatFree(userID string, code string) error {
	// 1. 检查用户是否已兑换过
	hasRedeemed, err := s.redemptionRepo.HasRedeemedByType(userID, model.CodeTypeWechatFree)
	if err != nil {
		return fmt.Errorf("failed to check redemption: %w", err)
	}
	if hasRedeemed {
		return errors.New("您已经兑换过公众号免费积分了")
	}
	
	// 2. 验证兑换码
	redemptionCode, err := s.redemptionRepo.GetCodeByCode(code)
	if err != nil {
		return fmt.Errorf("failed to get redemption code: %w", err)
	}
	if redemptionCode == nil {
		return errors.New("兑换码无效")
	}
	
	if redemptionCode.CodeType != model.CodeTypeWechatFree {
		return errors.New("兑换码类型错误")
	}
	
	if !redemptionCode.IsValid() {
		return errors.New("兑换码已失效或过期")
	}
	
	if redemptionCode.Points == nil {
		return errors.New("兑换码配置错误")
	}
	
	// 3. 使用事务：增加积分 + 记录兑换历史 + 更新兑换码使用次数
	// 注意：这里需要在Repository层实现事务，或者在这里使用GORM事务
	
	// 增加积分
	err = s.pointsService.AddPoints(userID, *redemptionCode.Points, "wechat", code, "公众号免费积分兑换")
	if err != nil {
		return err
	}
	
	// 记录兑换历史
	record := &model.RedemptionRecord{
		UserID:  userID,
		CodeID:  redemptionCode.ID,
		Code:    code,
	}
	if err := s.redemptionRepo.CreateRecord(record); err != nil {
		return fmt.Errorf("failed to create redemption record: %w", err)
	}
	
	// 更新兑换码使用次数
	if err := s.redemptionRepo.UpdateCodeUsedCount(redemptionCode.ID); err != nil {
		return fmt.Errorf("failed to update code used count: %w", err)
	}
	
	return nil
}

func (s *redemptionService) RedeemAds(userID string) error {
	// 1. 检查今天是否已观看
	today := time.Now().Format("2006-01-02")
	hasWatched, err := s.redemptionRepo.HasWatchedAdToday(userID, today)
	if err != nil {
		return fmt.Errorf("failed to check ad watch: %w", err)
	}
	if hasWatched {
		return errors.New("今天已经观看过广告了，明天再来吧！")
	}
	
	// 2. 使用 Redis 做双重检查（防止并发）
	cacheKey := fmt.Sprintf(cache.KeyAdWatch, userID, today)
	locked, err := s.redis.SetNX(cacheKey, "watched", 24*time.Hour)
	if err != nil || !locked {
		return errors.New("今天已经观看过广告了，明天再来吧！")
	}
	
	// 3. 增加积分
	err = s.pointsService.AddPoints(userID, 200, "ads", "", "观看广告获取积分")
	if err != nil {
		// 失败时删除缓存标记
		s.redis.Del(cacheKey)
		return err
	}
	
	// 4. 记录观看记录
	watchDate, _ := time.Parse("2006-01-02", today)
	record := &model.AdWatchRecord{
		UserID:      userID,
		WatchDate:   watchDate,
		PointsEarned: 200,
	}
	if err := s.redemptionRepo.RecordAdWatch(record); err != nil {
		// 记录失败时删除缓存标记（允许重试）
		s.redis.Del(cacheKey)
		return fmt.Errorf("failed to record ad watch: %w", err)
	}
	
	return nil
}

func (s *redemptionService) RedeemYearlyUnlimited(userID string, code string) error {
	// 1. 验证兑换码
	redemptionCode, err := s.redemptionRepo.GetCodeByCode(code)
	if err != nil {
		return fmt.Errorf("failed to get redemption code: %w", err)
	}
	if redemptionCode == nil {
		return errors.New("兑换码无效")
	}
	
	if redemptionCode.CodeType != model.CodeTypeYearlyUnlimited {
		return errors.New("兑换码类型错误")
	}
	
	if !redemptionCode.IsValid() {
		return errors.New("兑换码已失效或过期")
	}
	
	// 2. 计算到期日期（1年后）
	expireDate := time.Now().AddDate(1, 0, 0)
	
	// 3. 更新用户为付费用户和无限积分（使用事务）
	// 注意：这里需要在Repository层实现事务，或者在这里使用GORM事务
	
	// 获取用户信息
	user, err := s.userRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return errors.New("user not found")
	}
	
	// 如果用户已有无限积分，延长到期日期（取较晚的日期）
	userPoints, err := s.pointsRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user points: %w", err)
	}
	if userPoints == nil {
		return errors.New("user points not found")
	}
	
	if userPoints.IsUnlimited && userPoints.UnlimitedExpireDate != nil {
		if userPoints.UnlimitedExpireDate.After(expireDate) {
			// 已有更晚的到期日期，使用更晚的日期
			expireDate = *userPoints.UnlimitedExpireDate
		}
		// 延长到期日期（1年后）
		expireDate = expireDate.AddDate(1, 0, 0)
	}
	
	// 更新用户为付费用户
	user.UserType = "premium"
	user.PremiumExpireDate = &expireDate
	if err := s.userRepo.Update(user); err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	
	// 更新用户积分为无限积分
	userPoints.IsUnlimited = true
	userPoints.UnlimitedExpireDate = &expireDate
	if err := s.pointsRepo.Update(userPoints); err != nil {
		return fmt.Errorf("failed to update user points: %w", err)
	}
	
	// 记录兑换历史
	record := &model.RedemptionRecord{
		UserID:  userID,
		CodeID:  redemptionCode.ID,
		Code:    code,
	}
	if err := s.redemptionRepo.CreateRecord(record); err != nil {
		return fmt.Errorf("failed to create redemption record: %w", err)
	}
	
	// 更新兑换码使用次数
	if err := s.redemptionRepo.UpdateCodeUsedCount(redemptionCode.ID); err != nil {
		return fmt.Errorf("failed to update code used count: %w", err)
	}
	
	// 清除用户相关缓存
	s.redis.Del(fmt.Sprintf(cache.KeyUserPoints, userID))
	s.redis.Del(fmt.Sprintf(cache.KeyUserOpenID, user.OpenID))
	
	return nil
}


