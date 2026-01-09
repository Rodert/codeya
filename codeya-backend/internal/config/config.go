package config

import (
	"fmt"
	"github.com/spf13/viper"
	"os"
	"strings"
)

type Config struct {
	Server      ServerConfig      `mapstructure:"server"`
	Database    DatabaseConfig    `mapstructure:"database"`
	Redis       RedisConfig       `mapstructure:"redis"`
	Wechat      WechatConfig      `mapstructure:"wechat"`
	JWT         JWTConfig         `mapstructure:"jwt"`
	IDGenerator IDGeneratorConfig `mapstructure:"id_generator"`
	Log         LogConfig         `mapstructure:"log"`
}

type ServerConfig struct {
	Host string `mapstructure:"host"`
	Port int    `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type DatabaseConfig struct {
	Host            string `mapstructure:"host"`
	Port            int    `mapstructure:"port"`
	User            string `mapstructure:"user"`
	Password        string `mapstructure:"password"`
	DBName          string `mapstructure:"dbname"`
	Charset         string `mapstructure:"charset"`
	MaxIdleConns    int    `mapstructure:"max_idle_conns"`
	MaxOpenConns    int    `mapstructure:"max_open_conns"`
	ConnMaxLifetime int    `mapstructure:"conn_max_lifetime"`
}

type RedisConfig struct {
	Addr        string `mapstructure:"addr"`
	Password    string `mapstructure:"password"`
	DB          int    `mapstructure:"db"`
	PoolSize    int    `mapstructure:"pool_size"`
	MinIdleConns int   `mapstructure:"min_idle_conns"`
}

type WechatConfig struct {
	AppID     string `mapstructure:"app_id"`
	AppSecret string `mapstructure:"app_secret"`
}

type JWTConfig struct {
	Secret    string `mapstructure:"secret"`
	ExpiresIn int    `mapstructure:"expires_in"`
}

type IDGeneratorConfig struct {
	UserIDPrefix       string `mapstructure:"user_id_prefix"`
	UserIDStartSequence int64  `mapstructure:"user_id_start_sequence"`
	GeneratorType      string `mapstructure:"generator_type"`
}

type LogConfig struct {
	Level    string `mapstructure:"level"`
	Format   string `mapstructure:"format"`
	Output   string `mapstructure:"output"`
	FilePath string `mapstructure:"file_path"`
}

var Cfg *Config

func Init() error {
	viper.SetConfigType("yaml")
	
	// 优先加载环境变量指定的配置文件
	configFile := os.Getenv("CONFIG_FILE")
	if configFile == "" {
		// 默认加载 config.yaml
		viper.SetConfigName("config")
		viper.AddConfigPath("./configs")
		viper.AddConfigPath("../configs")
		viper.AddConfigPath("../../configs")
	} else {
		viper.SetConfigFile(configFile)
	}
	
	// 环境变量覆盖（使用下划线分隔）
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
	
	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}
	
	Cfg = &Config{}
	if err := viper.Unmarshal(Cfg); err != nil {
		return fmt.Errorf("failed to unmarshal config: %w", err)
	}
	
	// 验证必要配置
	if err := validateConfig(); err != nil {
		return err
	}
	
	return nil
}

func validateConfig() error {
	if Cfg.Database.Host == "" {
		return fmt.Errorf("database host is required")
	}
	if Cfg.Database.DBName == "" {
		return fmt.Errorf("database name is required")
	}
	if Cfg.Redis.Addr == "" {
		return fmt.Errorf("redis address is required")
	}
	if Cfg.JWT.Secret == "" {
		return fmt.Errorf("jwt secret is required")
	}
	if Cfg.Wechat.AppID == "" {
		return fmt.Errorf("wechat app_id is required")
	}
	if Cfg.Wechat.AppSecret == "" {
		return fmt.Errorf("wechat app_secret is required")
	}
	return nil
}

func GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=True&loc=Local",
		Cfg.Database.User,
		Cfg.Database.Password,
		Cfg.Database.Host,
		Cfg.Database.Port,
		Cfg.Database.DBName,
		Cfg.Database.Charset,
	)
}


