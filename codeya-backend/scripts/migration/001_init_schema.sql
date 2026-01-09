-- CodeYa 数据库初始化脚本
-- 创建时间: 2024-01-01

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL UNIQUE COMMENT '短用户ID，如 shiyu10000',
  `open_id` VARCHAR(100) NOT NULL UNIQUE COMMENT '微信openId',
  `union_id` VARCHAR(100) NULL COMMENT '微信unionId',
  `nickname` VARCHAR(100) NULL COMMENT '昵称',
  `avatar_url` VARCHAR(500) NULL COMMENT '头像URL',
  `user_type` VARCHAR(20) NOT NULL DEFAULT 'free' COMMENT '用户类型：free/premium',
  `premium_expire_date` DATE NULL COMMENT '付费到期日期',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_open_id` (`open_id`),
  INDEX `idx_union_id` (`union_id`),
  INDEX `idx_user_type` (`user_type`),
  INDEX `idx_premium_expire_date` (`premium_expire_date`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 用户积分表
CREATE TABLE IF NOT EXISTS `user_points` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL UNIQUE COMMENT '短用户ID',
  `current_points` INT NOT NULL DEFAULT 0 COMMENT '当前积分',
  `monthly_limit` INT NOT NULL DEFAULT 1000 COMMENT '每月积分上限',
  `last_reset_date` DATE NULL COMMENT '上次重置日期',
  `is_unlimited` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否无限积分',
  `unlimited_expire_date` DATE NULL COMMENT '无限积分到期日期',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_last_reset_date` (`last_reset_date`),
  INDEX `idx_is_unlimited` (`is_unlimited`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户积分表';

-- 3. 积分记录表
CREATE TABLE IF NOT EXISTS `points_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL COMMENT '短用户ID',
  `points` INT NOT NULL COMMENT '积分变化值',
  `source` VARCHAR(50) NOT NULL COMMENT '来源类型：question/ads/wechat/yearly_code',
  `source_id` VARCHAR(100) NULL COMMENT '来源ID',
  `description` VARCHAR(200) NULL COMMENT '描述',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_source` (`source`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- 4. 兑换码表
CREATE TABLE IF NOT EXISTS `redemption_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT '兑换码',
  `code_type` VARCHAR(20) NOT NULL COMMENT '类型：wechat_free/yearly_unlimited',
  `points` INT NULL COMMENT '积分数量（wechat_free类型使用）',
  `expire_date` DATE NULL COMMENT '过期日期',
  `max_uses` INT NOT NULL DEFAULT 1 COMMENT '最大使用次数',
  `used_count` INT NOT NULL DEFAULT 0 COMMENT '已使用次数',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_code` (`code`),
  INDEX `idx_code_type` (`code_type`),
  INDEX `idx_expire_date` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='兑换码表';

-- 5. 兑换记录表
CREATE TABLE IF NOT EXISTS `redemption_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL COMMENT '短用户ID',
  `code_id` BIGINT UNSIGNED NOT NULL COMMENT '兑换码ID',
  `code` VARCHAR(50) NOT NULL COMMENT '兑换码',
  `redeemed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '兑换时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_code_id` (`code_id`),
  INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='兑换记录表';

-- 6. 广告观看记录表
CREATE TABLE IF NOT EXISTS `ad_watch_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL COMMENT '短用户ID',
  `watch_date` DATE NOT NULL COMMENT '观看日期',
  `points_earned` INT NOT NULL DEFAULT 200 COMMENT '获得的积分',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  UNIQUE KEY `uk_user_date` (`user_id`, `watch_date`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_watch_date` (`watch_date`),
  INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广告观看记录表';

-- 7. 题目表
CREATE TABLE IF NOT EXISTS `questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_key` VARCHAR(50) NOT NULL COMMENT '分类标识',
  `title` VARCHAR(200) NOT NULL COMMENT '题目标题',
  `difficulty` VARCHAR(20) NOT NULL COMMENT '难度：简单/中等/困难',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `description` TEXT NULL COMMENT '题目描述',
  `code` TEXT NULL COMMENT '代码示例',
  `md_content` LONGTEXT NULL COMMENT 'Markdown内容',
  `tags` JSON NULL COMMENT '标签数组',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_category_key` (`category_key`),
  INDEX `idx_difficulty` (`difficulty`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- 8. 题目阅读记录表（仅付费用户）
CREATE TABLE IF NOT EXISTS `question_read_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL COMMENT '短用户ID',
  `question_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
  `read_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '阅读时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  UNIQUE KEY `uk_user_question` (`user_id`, `question_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_question_id` (`question_id`),
  INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目阅读记录表（仅付费用户）';

-- 9. 分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(50) NOT NULL UNIQUE COMMENT '分类标识',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `description` TEXT NULL COMMENT '分类描述',
  `question_count` INT NOT NULL DEFAULT 0 COMMENT '题目数量',
  `icon` VARCHAR(500) NULL COMMENT '分类图标',
  `order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_order` (`order`),
  INDEX `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';


