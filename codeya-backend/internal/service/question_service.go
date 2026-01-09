package service

import (
	"codeya-backend/internal/model"
	"codeya-backend/internal/repository"
	"errors"
	"fmt"
)

type QuestionService interface {
	GetCategories() ([]model.Category, error)
	GetList(categoryKey string, page, pageSize int) ([]model.Question, int64, error)
	GetDetail(questionID uint) (*model.Question, error)
	RecordRead(userID string, questionID uint, userType string) (int, error) // 返回获得的积分（userType 用于统计，所有用户数据都保存到后端）
}

type questionService struct {
	questionRepo repository.QuestionRepository
	pointsService PointsService
}

func NewQuestionService(
	questionRepo repository.QuestionRepository,
	pointsService PointsService,
) QuestionService {
	return &questionService{
		questionRepo: questionRepo,
		pointsService: pointsService,
	}
}

func (s *questionService) GetCategories() ([]model.Category, error) {
	return s.questionRepo.GetCategories()
}

func (s *questionService) GetList(categoryKey string, page, pageSize int) ([]model.Question, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}
	
	return s.questionRepo.GetByCategory(categoryKey, page, pageSize)
}

func (s *questionService) GetDetail(questionID uint) (*model.Question, error) {
	question, err := s.questionRepo.GetByID(questionID)
	if err != nil {
		return nil, fmt.Errorf("failed to get question: %w", err)
	}
	if question == nil {
		return nil, errors.New("question not found")
	}
	
	// 增加浏览次数
	go s.questionRepo.IncrementViewCount(questionID)
	
	return question, nil
}

func (s *questionService) RecordRead(userID string, questionID uint, userType string) (int, error) {
	// 1. 检查是否已阅读过（所有用户都检查后端数据库）
	hasRead, err := s.questionRepo.HasReadRecord(userID, questionID)
	if err != nil {
		return 0, fmt.Errorf("failed to check read record: %w", err)
	}
	if hasRead {
		return 0, errors.New("您已经阅读过这道题目了")
	}
	
	// 2. 获取题目信息（用于计算积分）
	question, err := s.questionRepo.GetByID(questionID)
	if err != nil {
		return 0, fmt.Errorf("failed to get question: %w", err)
	}
	if question == nil {
		return 0, errors.New("question not found")
	}
	
	// 3. 根据难度计算积分
	pointsMap := map[string]int{
		"简单": 1,
		"中等": 2,
		"困难": 3,
	}
	points := pointsMap[question.Difficulty]
	if points == 0 {
		points = 1 // 默认1分
	}
	
	// 4. 增加积分（调用积分服务）
	err = s.pointsService.AddPoints(userID, points, "question", fmt.Sprintf("%d", questionID), fmt.Sprintf("阅读题目：%s", question.Title))
	if err != nil {
		return 0, err
	}
	
	// 5. 保存阅读记录到后端（所有用户都保存）
	record := &model.QuestionReadRecord{
		UserID:     userID,
		QuestionID: questionID,
	}
	if err := s.questionRepo.CreateReadRecord(record); err != nil {
		// 记录失败不影响积分，但需要记录日志
		// 这里可以记录日志，但不返回错误
		fmt.Printf("failed to create read record: %v\n", err)
	}
	
	return points, nil
}


