package service

import (
	"codeya-backend/internal/cache"
	"codeya-backend/internal/config"
	"fmt"
	"strconv"
)

type IDGeneratorService interface {
	GenerateUserID() (string, error)
	GetCurrentSequence() (int64, error)
}

type idGeneratorService struct {
	redis *cache.RedisClient
}

func NewIDGeneratorService(redis *cache.RedisClient) IDGeneratorService {
	return &idGeneratorService{redis: redis}
}

func (s *idGeneratorService) GenerateUserID() (string, error) {
	// 获取当前序号
	seq, err := s.IncrSequence()
	if err != nil {
		return "", err
	}
	
	// 确保序号从起始值开始
	if seq < config.Cfg.IDGenerator.UserIDStartSequence {
		// 重置到起始值
		err = s.SetSequence(config.Cfg.IDGenerator.UserIDStartSequence)
		if err != nil {
			return "", err
		}
		seq = config.Cfg.IDGenerator.UserIDStartSequence
	}
	
	// 组合前缀和序号
	userID := fmt.Sprintf("%s%d", config.Cfg.IDGenerator.UserIDPrefix, seq)
	return userID, nil
}

func (s *idGeneratorService) GetCurrentSequence() (int64, error) {
	key := cache.KeyIDGeneratorSeq
	seqStr, err := s.redis.Get(key)
	if err != nil {
		// 如果不存在，返回起始值
		return config.Cfg.IDGenerator.UserIDStartSequence, nil
	}
	
	seq, err := strconv.ParseInt(seqStr, 10, 64)
	if err != nil {
		return config.Cfg.IDGenerator.UserIDStartSequence, nil
	}
	
	// 确保不小于起始值
	if seq < config.Cfg.IDGenerator.UserIDStartSequence {
		return config.Cfg.IDGenerator.UserIDStartSequence, nil
	}
	
	return seq, nil
}

func (s *idGeneratorService) IncrSequence() (int64, error) {
	key := cache.KeyIDGeneratorSeq
	seq, err := s.redis.Incr(key)
	if err != nil {
		return 0, err
	}
	
	// 如果序号小于起始值，设置为起始值
	if seq < config.Cfg.IDGenerator.UserIDStartSequence {
		err = s.SetSequence(config.Cfg.IDGenerator.UserIDStartSequence)
		if err != nil {
			return 0, err
		}
		return config.Cfg.IDGenerator.UserIDStartSequence, nil
	}
	
	return seq, nil
}

func (s *idGeneratorService) SetSequence(seq int64) error {
	key := cache.KeyIDGeneratorSeq
	return s.redis.Set(key, fmt.Sprintf("%d", seq), 0) // 永久存储
}

