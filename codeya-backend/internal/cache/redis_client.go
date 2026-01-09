package cache

import (
	"codeya-backend/internal/config"
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
	"time"
)

var Client *RedisClient

type RedisClient struct {
	client *redis.Client
	ctx    context.Context
}

func Init() error {
	Client = NewRedisClient(
		config.Cfg.Redis.Addr,
		config.Cfg.Redis.Password,
		config.Cfg.Redis.DB,
	)
	
	// 测试连接
	_, err := Client.Ping()
	if err != nil {
		return fmt.Errorf("failed to connect to redis: %w", err)
	}
	
	return nil
}

func NewRedisClient(addr, password string, db int) *RedisClient {
	rdb := redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DB:           db,
		PoolSize:     config.Cfg.Redis.PoolSize,
		MinIdleConns: config.Cfg.Redis.MinIdleConns,
	})
	
	return &RedisClient{
		client: rdb,
		ctx:    context.Background(),
	}
}

// Ping 测试连接
func (r *RedisClient) Ping() (string, error) {
	return r.client.Ping(r.ctx).Result()
}

// Get 获取值
func (r *RedisClient) Get(key string) (string, error) {
	return r.client.Get(r.ctx, key).Result()
}

// Set 设置值（带过期时间）
func (r *RedisClient) Set(key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return r.client.Set(r.ctx, key, data, expiration).Err()
}

// GetJSON 获取并反序列化 JSON
func (r *RedisClient) GetJSON(key string, dest interface{}) error {
	data, err := r.Get(key)
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// Del 删除键
func (r *RedisClient) Del(key string) error {
	return r.client.Del(r.ctx, key).Err()
}

// Exists 检查键是否存在
func (r *RedisClient) Exists(key string) (bool, error) {
	count, err := r.client.Exists(r.ctx, key).Result()
	return count > 0, err
}

// Incr 递增
func (r *RedisClient) Incr(key string) (int64, error) {
	return r.client.Incr(r.ctx, key).Result()
}

// SetNX 设置键（仅当不存在时）
func (r *RedisClient) SetNX(key string, value interface{}, expiration time.Duration) (bool, error) {
	data, err := json.Marshal(value)
	if err != nil {
		return false, err
	}
	return r.client.SetNX(r.ctx, key, data, expiration).Result()
}

// Expire 设置过期时间
func (r *RedisClient) Expire(key string, expiration time.Duration) error {
	return r.client.Expire(r.ctx, key, expiration).Err()
}

// TTL 获取过期时间
func (r *RedisClient) TTL(key string) (time.Duration, error) {
	return r.client.TTL(r.ctx, key).Result()
}

// Redis 键名常量
const (
	KeyUserPoints        = "user:points:%s"              // 用户积分信息
	KeyUserOpenID        = "user:openid:%s"              // openID -> userID 映射
	KeyIDGeneratorSeq    = "id:generator:user_id:sequence" // 短ID生成器序号
	KeyRateLimitAPI      = "ratelimit:api:%s:%s"         // API 限流
	KeyRateLimitIP       = "ratelimit:ip:%s:%s"          // IP 限流
	KeyLockReset         = "lock:reset:%s"               // 积分重置锁
	KeyLockAdWatch       = "lock:ad_watch:%s:%s"         // 广告观看锁
	KeyAdWatch           = "ad:watch:%s:%s"              // 广告观看标记
	KeyRedemptionCode    = "redemption:code:%s"          // 兑换码缓存
	KeyCheckReset        = "check:reset:%s:%s"           // 积分重置检查标记
)


