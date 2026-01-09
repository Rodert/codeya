package service

import (
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"codeya-backend/internal/cache"
	"fmt"
	"time"
)

type UserService interface {
	MigrateData(userID string, readRecords []ReadRecord) (*MigrateDataResponse, error)
}

type ReadRecord struct {
	QuestionID uint   `json:"question_id"`
	ReadAt     string `json:"read_at"`
}

type MigrateDataResponse struct {
	Success      bool  `json:"success"`
	MigratedCount int  `json:"migrated_count"`
	FailedCount   int  `json:"failed_count"`
	Message      string `json:"message"`
}

type userService struct {
	userRepo       repository.UserRepository
	questionRepo   repository.QuestionRepository
	redis          *cache.RedisClient
}

func NewUserService(
	userRepo repository.UserRepository,
	questionRepo repository.QuestionRepository,
	redis *cache.RedisClient,
) UserService {
	return &userService{
		userRepo:     userRepo,
		questionRepo: questionRepo,
		redis:        redis,
	}
}

func (s *userService) MigrateData(userID string, readRecords []ReadRecord) (*MigrateDataResponse, error) {
	// 1. 检查用户是否存在
	user, err := s.userRepo.GetByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	
	// 注意：现在所有用户的数据都保存在后端，此接口主要用于从旧版本小程序迁移历史数据
	
	// 2. 批量导入阅读记录
	migratedCount := 0
	failedCount := 0
	
	for _, record := range readRecords {
		// 检查是否已存在
		hasRead, err := s.questionRepo.HasReadRecord(userID, record.QuestionID)
		if err != nil {
			failedCount++
			continue
		}
		
		if hasRead {
			// 已存在，跳过
			continue
		}
		
		// 解析时间
		var readAt time.Time
		if record.ReadAt != "" {
			readAt, err = time.Parse(time.RFC3339, record.ReadAt)
			if err != nil {
				// 如果解析失败，使用当前时间
				readAt = time.Now()
			}
		} else {
			readAt = time.Now()
		}
		
		// 创建阅读记录
		readRecord := &model.QuestionReadRecord{
			UserID:     userID,
			QuestionID: record.QuestionID,
			ReadAt:     readAt,
		}
		
		if err := s.questionRepo.CreateReadRecord(readRecord); err != nil {
			failedCount++
			continue
		}
		
		migratedCount++
	}
	
	// 3. 返回结果
	message := fmt.Sprintf("成功迁移 %d 条记录", migratedCount)
	if failedCount > 0 {
		message += fmt.Sprintf("，失败 %d 条", failedCount)
	}
	
	return &MigrateDataResponse{
		Success:       failedCount == 0,
		MigratedCount: migratedCount,
		FailedCount:   failedCount,
		Message:       message,
	}, nil
}


