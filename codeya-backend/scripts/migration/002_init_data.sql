-- CodeYa 初始数据脚本
-- 创建时间: 2024-01-01

-- 1. 插入默认分类（根据小程序现有分类）
INSERT INTO `categories` (`key`, `name`, `description`, `question_count`, `icon`, `order`) VALUES
('java', 'Java', 'Java 相关题目', 0, '', 1),
('golang', 'Go', 'Go 语言相关题目', 0, '', 2),
('python', 'Python', 'Python 相关题目', 0, '', 3),
('javascript', 'JavaScript', 'JavaScript 相关题目', 0, '', 4),
('data-structure', '数据结构', '数据结构相关题目', 0, '', 5),
('algorithm', '算法', '算法相关题目', 0, '', 6),
('database', '数据库', '数据库相关题目', 0, '', 7),
('network', '网络', '网络相关题目', 0, '', 8),
('system-design', '系统设计', '系统设计相关题目', 0, '', 9),
('hadoop', 'Hadoop', 'Hadoop 相关题目', 0, '', 10)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. 插入示例兑换码（用于测试）
-- 公众号免费积分兑换码（每个用户只能使用一次）
INSERT INTO `redemption_codes` (`code`, `code_type`, `points`, `expire_date`, `max_uses`, `used_count`, `is_active`) VALUES
('WECHAT_FREE_2024', 'wechat_free', 500, '2025-12-31', 999999, 0, TRUE)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- 年费无限积分兑换码（示例）
INSERT INTO `redemption_codes` (`code`, `code_type`, `points`, `expire_date`, `max_uses`, `used_count`, `is_active`) VALUES
('YEARLY_2024', 'yearly_unlimited', NULL, '2025-12-31', 999999, 0, TRUE),
('VIP_2024', 'yearly_unlimited', NULL, '2025-12-31', 999999, 0, TRUE)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);


