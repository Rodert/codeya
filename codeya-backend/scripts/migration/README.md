# 数据库迁移脚本

## 使用方法

### 1. 初始化数据库

执行初始化脚本创建所有表：

```bash
mysql -u root -p codeya < scripts/migration/001_init_schema.sql
```

### 2. 插入初始数据

执行初始数据脚本：

```bash
mysql -u root -p codeya < scripts/migration/002_init_data.sql
```

### 3. 或使用 mysql 客户端

```sql
source scripts/migration/001_init_schema.sql;
source scripts/migration/002_init_data.sql;
```

## 注意事项

1. 确保 MySQL 版本 >= 8.0
2. 确保数据库 `codeya` 已创建
3. 确保数据库用户有足够的权限
4. 生产环境建议先备份数据库

## 表结构说明

- `users`: 用户表
- `user_points`: 用户积分表
- `points_records`: 积分记录表
- `redemption_codes`: 兑换码表
- `redemption_records`: 兑换记录表
- `ad_watch_records`: 广告观看记录表
- `questions`: 题目表
- `question_read_records`: 题目阅读记录表（仅付费用户）
- `categories`: 分类表

详细信息请参考 `DESIGN.md`。


