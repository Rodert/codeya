# CodeYa 后端系统设计方案

## 设计要点摘要

### 核心设计原则

1. **低耦合架构**:
   - 使用接口抽象和依赖注入
   - 分层架构，严格单向依赖
   - 单一职责原则
   - 接口驱动设计

2. **积分重置机制**:
   - **不使用定时任务**，改为用户请求触发
   - 用户每天首次打开时检查是否需要重置
   - 如果跨月，自动重置到 1000 积分
   - 使用 Redis 标记防止重复检查
   - 使用分布式锁保证并发安全

3. **数据库设计**:
   - 每个表都有自增主键 `id`（BIGINT，内部使用）
   - `users` 表使用 `user_id`（VARCHAR，短ID如 `shiyu10000`、`shiyu10001`）作为业务唯一标识
   - `open_id` 仅用于微信登录识别和查询用户
   - 不使用数据库外键约束
   - 通过 `user_id`（VARCHAR）进行逻辑关联，关联 `users.user_id`
   - 短ID格式：`{前缀}{序号}`，从 10000 开始累计，如 `shiyu10000`、`shiyu10001`、`shiyu10002`
   - **安全性**：从 10000 开始，不暴露真实用户数量（至少前 10000 个用户）

4. **架构特点**:
   - Handler -> Service -> Repository -> Model 分层
   - 依赖接口而非实现
   - 便于测试和扩展

5. **数据存储策略**:
   - **免费用户（user_type = 'free'）**：
     - 学习记录保存在小程序本地（localStorage）
     - 后端只保存必要信息（用户信息、积分、积分记录、兑换记录）
     - 不保存阅读记录、收藏、笔记等
     - 节省服务器存储空间，降低存储成本
   - **付费用户（user_type = 'premium'）**：
     - 所有数据保存在后端（包括阅读记录、收藏、笔记等）
     - 支持云端同步和多设备访问
     - 提供完整的学习统计和分析功能
   - **数据迁移**：免费用户升级为付费用户时，可以将本地数据迁移到后端
   - **到期处理**：付费用户到期后，恢复为免费用户，数据保留 30 天

## 一、技术栈

- **开发语言**: Golang
- **Web 框架**: Gin
- **ORM 框架**: GORM
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **认证**: JWT

**注意**: 本项目不使用定时任务，所有业务逻辑通过用户请求触发

## 二、架构设计原则

### 2.1 低耦合设计原则

**核心思想**: 尽可能降低模块间的依赖关系，提高系统的可维护性和可扩展性

#### 2.1.1 依赖注入 (Dependency Injection)

- **原则**: 上层模块不直接依赖下层模块，而是通过接口和依赖注入
- **实现**: 使用接口定义依赖关系，通过构造函数注入依赖
- **优势**: 
  - 易于测试（可以注入 mock 对象）
  - 易于替换实现（更换数据库、缓存等）
  - 降低耦合度

#### 2.1.2 接口抽象

- **原则**: 定义清晰的接口，实现细节隐藏在接口后面
- **实现**: 
  - Repository 层定义数据访问接口
  - Service 层定义业务逻辑接口
  - Cache 层定义缓存接口
- **优势**: 
  - 实现可以随意替换
  - 接口与实现解耦
  - 便于单元测试

#### 2.1.3 分层架构

- **原则**: 严格按照分层架构，每层只依赖下层，不能跨层调用
- **层次**: Handler -> Service -> Repository -> Model
- **规则**: 
  - Handler 层只能调用 Service 层
  - Service 层只能调用 Repository 层和 Cache 层
  - Repository 层只能访问数据库和 Model 层
  - 不能反向调用

#### 2.1.4 单一职责原则

- **原则**: 每个模块、每个函数只负责一个功能
- **实现**: 
  - Service 层按业务领域划分（积分服务、兑换服务等）
  - Repository 层按数据实体划分（用户仓储、积分仓储等）
  - Handler 层按接口划分（认证处理器、积分处理器等）
- **优势**: 
  - 代码清晰易读
  - 修改影响范围小
  - 易于测试

#### 2.1.5 配置外部化

- **原则**: 所有配置项都从外部配置读取，不硬编码
- **实现**: 
  - 使用配置文件（YAML/JSON）
  - 敏感信息使用环境变量
  - 不同环境使用不同配置
- **优势**: 
  - 便于部署和切换环境
  - 不修改代码即可调整配置
  - 安全性更高

#### 2.1.6 接口驱动设计

- **原则**: 先定义接口，再实现具体功能
- **实现**: 
  - Repository 接口 -> Repository 实现
  - Service 接口 -> Service 实现
  - Cache 接口 -> Cache 实现（Redis 实现）
- **优势**: 
  - 设计更清晰
  - 便于并行开发
  - 易于替换实现

### 2.2 依赖关系图

```
Handler 层（HTTP 处理）
    ↓ 依赖接口
Service 层（业务逻辑）
    ↓ 依赖接口
Repository 层（数据访问）
    ↓ 依赖接口
Cache 层（缓存）
    ↓
Model 层（数据模型）
    ↓
Database / Redis
```

**依赖方向**: 单向依赖，上层依赖下层，下层不依赖上层

## 三、数据库设计原则

### 2.1 核心原则

1. **每个表都有自增主键 `id`**: 所有表使用 `BIGINT AUTO_INCREMENT PRIMARY KEY` 作为主键
2. **不使用数据库外键约束**: 不在数据库层面使用外键约束，关联关系在应用层维护
3. **用户唯一标识**: `users` 表使用 `user_id`（VARCHAR，短ID如 `shiyu10000`）作为业务唯一标识，`id` 为内部自增主键，`open_id` 仅用于微信登录识别
4. **短ID格式**: 格式为 `{前缀}{序号}`，从 10000 开始累计，如 `shiyu10000`、`shiyu10001`，使用 ID 生成器自动生成
5. **用户类型**: `users` 表使用 `user_type` 字段标识用户类型（`free`-免费用户，`premium`-付费用户），决定数据存储策略
6. **逻辑关联**: 所有关联表使用 `user_id` 字段（VARCHAR）与 `users.user_id` 逻辑关联（非外键约束）
7. **open_id 用途**: `open_id` 仅用于登录识别和查询用户，不用于表关联
8. **唯一约束**: 关键字段使用唯一索引或唯一约束防止重复数据
9. **数据存储策略**: 免费用户的学习记录保存在小程序本地，后端只保存必要信息（用户信息、积分）；付费用户的所有数据保存在后端

### 2.2 索引策略

- 所有关联字段（如 `user_id`、`open_id`）建立索引
- 查询频繁的字段建立索引
- 组合查询使用联合索引
- 时间字段建立索引便于排序和查询

## 三、数据库表结构设计

### 3.1 用户表 (users)

**用途**: 存储用户基本信息

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键，内部使用）
- `user_id`: VARCHAR(50) UNIQUE NOT NULL（短用户ID，如 `shiyu10000`、`shiyu10001`，业务唯一标识）
- `open_id`: VARCHAR(100) UNIQUE NOT NULL INDEX（微信 openId，登录标识）
- `union_id`: VARCHAR(100) NULL INDEX（微信 unionId，可选）
- `nickname`: VARCHAR(100) NULL（用户昵称）
- `avatar_url`: VARCHAR(500) NULL（头像 URL）
- `user_type`: VARCHAR(20) DEFAULT 'free' INDEX（用户类型：free-免费用户，premium-付费用户）
- `premium_expire_date`: DATE NULL（付费到期日期，仅付费用户使用）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（创建时间）
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP（更新时间）

**索引设计**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_id` (`user_id`)
- UNIQUE KEY `uk_open_id` (`open_id`)
- INDEX `idx_union_id` (`union_id`)
- INDEX `idx_user_type` (`user_type`)
- INDEX `idx_premium_expire_date` (`premium_expire_date`)
- INDEX `idx_created_at` (`created_at`)

**说明**:
- `id` 是内部自增主键（BIGINT），用于内部关联和性能优化
- `user_id` 是短用户ID（VARCHAR，如 `shiyu10000`），用于所有关联表的关联和业务展示
- `open_id` 是微信登录标识（唯一索引），仅用于登录识别和查询用户
- `user_type` 标识用户类型，决定数据存储策略
- `premium_expire_date` 付费到期日期，用于判断付费状态
- 关联表使用 `user_id` 字段（VARCHAR）关联 `users.user_id`，不使用 `id` 或 `open_id`
- 不使用外键约束

**用户类型说明**:
- `free`：免费用户（默认）
  - 学习记录保存在小程序本地
  - 后端只保存必要信息（用户信息、积分、积分记录）
  - 不保存阅读记录、收藏、笔记等
- `premium`：付费用户（年费无限积分用户）
  - 所有数据保存在后端
  - 支持云端同步、多设备访问
  - 提供完整的学习统计和分析功能

**短ID生成规则**:
- 格式：`{前缀}{序号}`，如 `shiyu10000`、`shiyu10001`、`shiyu10002`
- 前缀：固定前缀（如 `shiyu`），可配置
- 起始序号：从 10000 开始，自动递增
- 序号长度：不补零，自然增长（如 `10000`、`10001`、`10002`...`10099`、`10100`）
- 长度：前缀长度 + 序号长度（如 `shiyu` + `10000` = 10 个字符）
- 生成器：使用 Redis 计数器或数据库序列生成，从 10000 开始累计
- **优势**：简单直观，不暴露真实用户数量（至少前 10000 个用户），实现简单

**序号生成示例**:
- 第 1 个用户：序号 10000 → 完整ID `shiyu10000`（10 字符）
- 第 2 个用户：序号 10001 → 完整ID `shiyu10001`（10 字符）
- 第 100 个用户：序号 10099 → 完整ID `shiyu10099`（10 字符）
- 第 1000 个用户：序号 10999 → 完整ID `shiyu10999`（10 字符）
- 第 10000 个用户：序号 19999 → 完整ID `shiyu19999`（10 字符）
- 第 90000 个用户：序号 99999 → 完整ID `shiyu99999`（10 字符）
- 第 90001 个用户：序号 100000 → 完整ID `shiyu100000`（11 字符）
- 第 100000 个用户：序号 109999 → 完整ID `shiyu109999`（11 字符）

**序号长度和ID总长度变化**:
```
序号范围      | 序号位数 | 前缀长度 | ID总长度 | 示例
------------|---------|---------|---------|------------------
10000-99999 | 5位     | 5位     | 10字符  | shiyu10000, shiyu99999
100000-999999 | 6位   | 5位     | 11字符  | shiyu100000, shiyu999999
1000000-9999999 | 7位 | 5位     | 12字符  | shiyu1000000, shiyu9999999
10000000-99999999 | 8位 | 5位   | 13字符  | shiyu10000000, shiyu99999999
```

**字段容量说明**:
- `user_id` 字段类型：`VARCHAR(50)`
- **容量支持**：理论上支持到 9999999999999999...（几十亿用户）
- **实际容量**：即使序号达到 9999999999999（13个9），ID长度也只有 18 个字符（前缀5 + 序号13）
- **结论**：`VARCHAR(50)` 完全足够，即使支持到亿级用户也不会有问题

**超过 99999 时的影响**:
- ✅ **无影响**：`VARCHAR(50)` 字段长度完全足够，不会超出限制
- ✅ **长度自然增长**：从 10 字符增加到 11 字符（序号从 5 位变为 6 位）
- ✅ **功能正常**：所有功能不受影响，只是ID长度略有增加（1个字符）
- ✅ **性能无影响**：字符串长度差异很小（10-13字符），性能影响可忽略
- ✅ **可扩展性**：支持到亿级用户也不会有问题（只需 13 字符左右）

**安全性**:
- 从 10000 开始，不暴露真实用户数量（至少前 10000 个用户）
- 实现简单，不需要编码/解码
- 基于自增数字，保证唯一性和性能
- 即使超过 99999，依然不会暴露真实用户数量（因为从 10000 开始）

---

### 3.2 用户积分表 (user_points)

**用途**: 存储用户积分信息和月度限制

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `user_id`: VARCHAR(50) UNIQUE NOT NULL INDEX（短用户ID，逻辑关联 users.user_id）
- `current_points`: INT DEFAULT 0（当前积分）
- `monthly_limit`: INT DEFAULT 1000（每月积分上限）
- `last_reset_date`: DATE NULL（上次重置日期）
- `is_unlimited`: BOOLEAN DEFAULT FALSE INDEX（是否无限积分）
- `unlimited_expire_date`: DATE NULL（无限积分到期日期）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（创建时间）
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP（更新时间）

**索引设计**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_id` (`user_id`)
- INDEX `idx_last_reset_date` (`last_reset_date`)
- INDEX `idx_is_unlimited` (`is_unlimited`)

**关联关系**:
- 逻辑关联: `user_points.user_id` -> `users.user_id`
- 一对一关系: 每个用户只有一条积分记录
- 关联维护: 应用层保证 `user_id` 的一致性

**业务规则**:
- 用户首次登录时自动创建积分记录（初始积分为 1000）
- 每月 1 号通过用户请求触发重置积分（非无限积分用户）
- 无限积分用户不受 1000 积分限制
- 重置逻辑：用户每天首次打开时检查是否跨月，如果跨月则重置到 1000 积分

---

### 3.3 积分记录表 (points_records)

**用途**: 记录所有积分变化历史

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `user_id`: VARCHAR(50) NOT NULL INDEX（短用户ID，逻辑关联 users.user_id）
- `points`: INT NOT NULL（积分变化值，正数为增加，负数为减少）
- `source`: VARCHAR(50) NOT NULL INDEX（来源类型：question/ads/wechat/yearly_code）
- `source_id`: VARCHAR(100) NULL（来源 ID，如题目 ID、兑换码等）
- `description`: VARCHAR(200) NULL（描述信息）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP INDEX（创建时间）

**索引设计**:
- PRIMARY KEY (`id`)
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_user_id_created` (`user_id`, `created_at`)（联合索引，用于查询用户积分历史）
- INDEX `idx_source` (`source`)
- INDEX `idx_created_at` (`created_at`)

**关联关系**:
- 逻辑关联: `points_records.user_id` -> `users.user_id`
- 一对多关系: 一个用户有多条积分记录
- 关联维护: 应用层保证 `user_id` 的一致性

**业务规则**:
- 所有积分变化都要记录
- 用于对账、统计和风控
- 可以按来源类型统计积分来源

---

### 3.4 兑换码表 (redemption_codes)

**用途**: 存储所有类型的兑换码

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `code`: VARCHAR(50) UNIQUE NOT NULL（兑换码，唯一）
- `code_type`: VARCHAR(20) NOT NULL INDEX（类型：wechat_free/yearly_unlimited）
- `points`: INT NULL（积分数量，仅 wechat_free 类型使用）
- `expire_date`: DATE NULL（过期日期）
- `max_uses`: INT DEFAULT 1（最大使用次数）
- `used_count`: INT DEFAULT 0（已使用次数）
- `is_active`: BOOLEAN DEFAULT TRUE（是否激活）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（创建时间）
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP（更新时间）

**索引设计**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_code` (`code`)
- INDEX `idx_code_type` (`code_type`)
- INDEX `idx_expire_date` (`expire_date`)

**业务规则**:
- `wechat_free` 类型：公众号免费积分兑换码
- `yearly_unlimited` 类型：年费无限积分兑换码
- 每个兑换码可以设置最大使用次数
- 可以设置过期日期

---

### 3.5 兑换记录表 (redemption_records)

**用途**: 记录所有兑换操作历史

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `user_id`: VARCHAR(50) NOT NULL INDEX（短用户ID，逻辑关联 users.user_id）
- `code_id`: BIGINT NOT NULL INDEX（兑换码 ID，逻辑关联 redemption_codes.id）
- `code`: VARCHAR(50) NOT NULL（兑换码，冗余存储便于查询）
- `redeemed_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（兑换时间）

**索引设计**:
- PRIMARY KEY (`id`)
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_code_id` (`code_id`)
- INDEX `idx_user_id_code_type` (`user_id`, `code`)（联合索引，用于检查是否已兑换特定类型）

**关联关系**:
- 逻辑关联: `redemption_records.user_id` -> `users.user_id`
- 逻辑关联: `redemption_records.code_id` -> `redemption_codes.id`
- 一对多关系: 一个用户可以有多次兑换记录，一个兑换码可以被多个用户使用（根据 max_uses）

**业务规则**:
- 记录所有兑换操作，便于审计
- 用于检查用户是否已兑换过特定类型的兑换码
- `code` 字段冗余存储，减少 JOIN 查询

---

### 3.6 广告观看记录表 (ad_watch_records)

**用途**: 记录用户观看广告的历史，确保每天只能观看一次

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `user_id`: VARCHAR(50) NOT NULL（短用户ID，逻辑关联 users.user_id）
- `watch_date`: DATE NOT NULL（观看日期）
- `points_earned`: INT DEFAULT 200（获得的积分）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（创建时间）

**索引设计**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_id_date` (`user_id`, `watch_date`)（唯一约束，防止同一天重复观看）
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_watch_date` (`watch_date`)

**关联关系**:
- 逻辑关联: `ad_watch_records.user_id` -> `users.user_id`
- 一对多关系: 一个用户可以有多次观看记录（不同日期）

**业务规则**:
- 使用唯一约束确保每天每个用户只能观看一次
- 观看广告可获得 200 积分
- 结合 Redis 做双重检查，防止并发问题

---

### 3.7 题目表 (questions)

**用途**: 存储题目信息

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `category_key`: VARCHAR(50) NOT NULL INDEX（分类标识）
- `title`: VARCHAR(200) NOT NULL（题目标题）
- `difficulty`: VARCHAR(20) NOT NULL INDEX（难度：简单/中等/困难）
- `view_count`: INT DEFAULT 0（浏览次数）
- `description`: TEXT NULL（题目描述）
- `code`: TEXT NULL（代码示例）
- `md_content`: LONGTEXT NULL（Markdown 格式内容）
- `tags`: JSON NULL（标签数组）
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（创建时间）
- `updated_at`: DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP（更新时间）

**索引设计**:
- PRIMARY KEY (`id`)
- INDEX `idx_category_key` (`category_key`)
- INDEX `idx_difficulty` (`difficulty`)
- INDEX `idx_created_at` (`created_at`)

---

### 3.8 题目阅读记录表 (question_read_records)

**用途**: 记录用户阅读题目的历史，防止重复获得积分

**字段设计**:
- `id`: BIGINT AUTO_INCREMENT PRIMARY KEY（自增主键）
- `user_id`: VARCHAR(50) NOT NULL INDEX（短用户ID，逻辑关联 users.user_id）
- `question_id`: BIGINT NOT NULL INDEX（题目 ID，逻辑关联 questions.id）
- `read_at`: DATETIME DEFAULT CURRENT_TIMESTAMP（阅读时间）

**索引设计**:
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_id_question` (`user_id`, `question_id`)（唯一约束，防止重复阅读）
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_question_id` (`question_id`)

**关联关系**:
- 逻辑关联: `question_read_records.user_id` -> `users.user_id`
- 逻辑关联: `question_read_records.question_id` -> `questions.id`

**数据存储策略**:
- **免费用户（user_type = 'free'）**：
  - ❌ **不保存在后端**：学习记录保存在小程序本地（localStorage）
  - ✅ 后端只保存必要信息（用户信息、积分）
  - 阅读记录、收藏、笔记等保存在小程序本地
  - 防止重复获得积分：通过本地数据检查
- **付费用户（user_type = 'premium'）**：
  - ✅ **保存在后端**：所有学习记录保存在后端
  - ✅ 支持云端同步和多设备访问
  - ✅ 提供完整的学习统计和分析功能

**业务规则**:
- 使用唯一约束确保每个用户每个题目只能获得一次积分（仅付费用户）
- 阅读不同难度的题目获得不同积分（简单1分，中等2分，困难3分）
- 免费用户通过小程序本地数据检查是否已阅读
- 付费用户通过后端数据检查是否已阅读

---

## 四、架构设计

### 4.1 低耦合架构设计

#### 4.1.1 接口定义

**Repository 接口**:
- `UserRepository` 接口：定义用户数据访问方法
- `PointsRepository` 接口：定义积分数据访问方法
- `RedemptionRepository` 接口：定义兑换数据访问方法
- `QuestionRepository` 接口：定义题目数据访问方法

**Service 接口**:
- `AuthService` 接口：定义认证业务逻辑方法
- `PointsService` 接口：定义积分业务逻辑方法
- `RedemptionService` 接口：定义兑换业务逻辑方法
- `QuestionService` 接口：定义题目业务逻辑方法
- `IDGeneratorService` 接口：定义短ID生成方法

**Cache 接口**:
- `Cache` 接口：定义缓存操作方法（Redis 实现）

#### 4.1.4 短ID生成器设计

**IDGeneratorService 接口**:
- `GenerateUserID() string`: 生成下一个短用户ID（如 `shiyu10000`、`shiyu10001`）
- `GetCurrentSequence() int64`: 获取当前序号（十进制数字）
- `ResetSequence(sequence int64) error`: 重置序号（仅管理员使用，最小值为 10000）

**实现方案**:

**方案A：使用 Redis 计数器（推荐）**
- Key: `id:generator:user_id:sequence`
- Value: 当前序号（整数）
- 操作：使用 `INCR` 命令自动递增
- 优势：性能好，支持分布式，原子操作
- 缺点：需要保证 Redis 可用性

**方案B：使用数据库序列**
- 创建独立的序列表 `id_sequences`
- 字段：`sequence_name`（序列名）、`current_value`（当前值）
- 使用数据库事务保证原子性
- 优势：数据持久化，可靠性高
- 缺点：性能略低于 Redis

**方案C：混合方案（推荐）**
- 使用 Redis 作为主要生成器（高性能）
- 定期同步到数据库（持久化）
- Redis 故障时使用数据库作为备用

**短ID格式化**:
- 前缀：从配置读取（如 `shiyu`）
- 序号：从计数器获取（从 10000 开始，如 `10000`, `10001`, `10002`...），存储在 Redis 或数据库中
- 格式：序号不补零，自然增长（如 `10000`, `10001`, `10002`...`10099`, `10100`）
- 组合：`{前缀}{序号}`（如 `shiyu10000`, `shiyu10001`, `shiyu10002`...）

**序号生成规则**:
- 起始序号：从 10000 开始（可配置）
- 递增：每次自动递增 1
- 长度：自然增长，不补零（如 `10000`, `10001`, `10002`...）
- 存储：序号存储在 Redis 或数据库中

**示例对照表**:
```
序号   | 完整短ID
------|----------
10000 | shiyu10000
10001 | shiyu10001
10002 | shiyu10002
10099 | shiyu10099
10100 | shiyu10100
10999 | shiyu10999
11000 | shiyu11000
```

**配置参数**:
- `user_id_prefix`: 用户ID前缀（如 `shiyu`），默认 `shiyu`
- `user_id_start_sequence`: 起始序号（如 `10000`），默认 `10000`
- `id_generator_type`: 生成器类型（`redis`/`database`/`hybrid`），默认 `hybrid`

**方案优势**:

| 特性 | 说明 |
|------|------|
| **简单直观** | 不需要编码/解码，实现简单 |
| **性能好** | 直接使用数字，无需转换 |
| **便于管理** | 序号连续，便于查询和统计 |
| **安全性** | 从 10000 开始，至少前 10000 个用户不暴露真实数量 |

**为什么从 10000 开始**:
1. **保护隐私**：至少前 10000 个用户不暴露真实用户数量
2. **简单实现**：不需要编码/解码，直接使用数字
3. **便于管理**：序号连续，便于查询和统计
4. **性能好**：直接使用数字，无需转换
5. **唯一性**：基于自增序号，保证唯一性
6. **递增性**：序号连续递增，便于管理和排序

**建议配置**:
- 前缀：`shiyu`（可根据品牌调整）
- 起始序号：`10000`（可根据需要调整）
- 序号格式：不补零，自然增长

**示例对比**（假设已有 1000 个用户）：

| 方案 | 第 1 个用户的ID | 第 1000 个用户的ID | 是否暴露数量 |
|------|----------------|------------------|------------|
| 从 1 开始 | `shiyu1` | `shiyu1000` | ❌ 是（可以看出有至少 1000 用户） |
| 从 10000 开始 | `shiyu10000` | `shiyu10999` | ✅ 否（至少前 10000 个用户不暴露真实数量） |

**结论**：从 10000 开始累计，既简单又实用，至少前 10000 个用户不暴露真实用户数量。

#### 4.1.2 依赖注入实现

**构造函数注入**:
- Handler 层通过构造函数注入 Service 接口
- Service 层通过构造函数注入 Repository 接口和 Cache 接口
- Repository 层通过构造函数注入数据库连接（GORM DB）

**依赖关系示例**:
```
PointsHandler
  ↓ 依赖 IPointsService 接口
PointsService (实现 IPointsService)
  ↓ 依赖 IPointsRepository 接口 + ICache 接口
PointsRepository (实现 IPointsRepository)
  ↓ 依赖 *gorm.DB
Database
```

#### 4.1.3 模块间通信

**原则**: 通过接口通信，不直接依赖实现

**实现方式**:
- 定义接口文件：`internal/service/points_service_interface.go`
- 实现接口文件：`internal/service/points_service.go`
- 使用接口类型：`IPointsService` 而不是 `*PointsService`

**优势**:
- 可以轻松替换实现（如测试时使用 mock）
- 降低耦合度
- 便于单元测试

### 4.2 项目结构

```
codeya-backend/
├── cmd/
│   └── server/
│       └── main.go                    # 应用入口
├── internal/
│   ├── config/
│   │   └── config.go                  # 配置管理
│   ├── model/
│   │   ├── user.go                    # 用户模型
│   │   ├── points.go                  # 积分相关模型
│   │   ├── redemption.go              # 兑换相关模型
│   │   └── question.go                # 题目相关模型
│   ├── repository/
│   │   ├── user_repo.go               # 用户数据访问层
│   │   ├── points_repo.go             # 积分数据访问层
│   │   ├── redemption_repo.go         # 兑换数据访问层
│   │   └── question_repo.go           # 题目数据访问层
│   ├── service/
│   │   ├── auth_service.go            # 认证服务
│   │   ├── points_service.go          # 积分服务
│   │   ├── redemption_service.go      # 兑换服务
│   │   ├── question_service.go        # 题目服务
│   │   └── id_generator_service.go    # 短ID生成服务
│   ├── handler/
│   │   ├── auth_handler.go            # 认证处理器
│   │   ├── points_handler.go          # 积分处理器
│   │   ├── redemption_handler.go      # 兑换处理器
│   │   └── question_handler.go        # 题目处理器
│   ├── middleware/
│   │   ├── auth.go                    # JWT 认证中间件
│   │   ├── cors.go                    # 跨域中间件
│   │   └── rate_limit.go              # 限流中间件
│   ├── cache/
│   │   └── redis_client.go            # Redis 客户端封装
│   ├── task/
│   │   └── scheduler.go               # 定时任务调度器
│   └── util/
│       ├── jwt.go                     # JWT 工具
│       ├── response.go                # 统一响应格式
│       └── validator.go               # 参数验证
├── pkg/
│   └── wechat/
│       └── wechat.go                  # 微信 API 封装
├── configs/
│   └── config.yaml                    # 配置文件
├── scripts/
│   └── migration/                     # 数据库迁移脚本
├── go.mod
├── go.sum
└── README.md
```

### 4.3 分层架构详解

#### 4.3.1 层次定义

**Handler 层**:
- **职责**: 处理 HTTP 请求和响应，参数验证，调用 Service 层
- **依赖**: 只依赖 Service 接口
- **特点**: 无业务逻辑，只做 HTTP 层处理

**Service 层**:
- **职责**: 业务逻辑处理，调用 Repository 和 Cache
- **依赖**: 依赖 Repository 接口和 Cache 接口
- **特点**: 包含所有业务逻辑，不直接访问数据库

**Repository 层**:
- **职责**: 数据访问，封装数据库操作，CRUD 操作
- **依赖**: 依赖 Model 和数据库连接（GORM DB）
- **特点**: 只做数据访问，无业务逻辑

**Model 层**:
- **职责**: 数据模型定义，GORM 模型
- **依赖**: 无依赖（纯数据结构）
- **特点**: 定义数据库表和字段映射

**Cache 层**:
- **职责**: Redis 缓存封装，提供缓存接口
- **依赖**: 依赖 Redis 客户端
- **特点**: 封装缓存操作，提供统一接口

**Middleware 层**:
- **职责**: HTTP 中间件（认证、跨域、限流等）
- **依赖**: 依赖 JWT、Redis 等工具
- **特点**: 横切关注点，可插拔

#### 4.3.2 依赖规则

**单向依赖**:
- Handler → Service → Repository → Model
- Handler → Service → Cache
- 不允许反向依赖
- 不允许跨层调用

**接口隔离**:
- 每层都定义接口
- 上层只依赖下层接口，不依赖实现
- 接口与实现分离

**依赖注入**:
- 所有依赖通过构造函数注入
- 不使用全局变量或单例模式（除了配置）
- 便于测试和替换实现

### 4.4 数据流向

```
HTTP 请求
  ↓
Middleware 层（认证、限流等）
  ↓
Handler 层（参数验证、调用 Service）
  ↓
Service 层（业务逻辑处理，调用 Repository 和 Cache）
  ↓
Repository 层（数据访问）← → Cache 层（缓存操作）
  ↓
MySQL / Redis
```

### 4.5 模块解耦策略

#### 4.5.1 服务解耦

**独立服务**:
- 每个 Service 都是独立的，不依赖其他 Service
- 如需要跨 Service 调用，通过接口定义依赖
- 避免循环依赖

**事件驱动**（未来扩展）:
- 可以使用事件机制解耦服务
- 积分变化可以发送事件
- 其他服务可以订阅事件

#### 4.5.2 数据访问解耦

**Repository 模式**:
- 每个数据实体都有对应的 Repository
- Repository 只负责数据访问，不包含业务逻辑
- 可以轻松替换数据库（如从 MySQL 切换到 PostgreSQL）

**缓存层抽象**:
- Cache 接口抽象，不绑定 Redis
- 可以替换为其他缓存实现（如 Memcached）
- 或者实现多级缓存

#### 4.5.3 配置解耦

**配置外部化**:
- 所有配置从配置文件读取
- 不同环境使用不同配置
- 配置变更不需要修改代码

**环境变量**:
- 敏感信息使用环境变量
- 便于容器化部署
- 提高安全性

## 五、数据一致性保证机制

### 5.1 应用层事务控制

**原则**: 所有涉及多表操作的业务逻辑使用数据库事务保证原子性

**场景**:
- 增加积分时，同时更新 `user_points` 表和插入 `points_records` 表
- 兑换操作时，同时更新 `redemption_codes`、插入 `redemption_records` 和增加积分
- 所有积分操作必须在一个事务中完成

**实现方式**: 使用 GORM 的事务功能，确保要么全部成功，要么全部回滚

### 5.2 数据校验策略

**写入前校验**:
- 操作前检查关联数据是否存在（如通过 `user_id` 检查用户是否存在）
- 验证业务规则（如是否超过积分上限）
- 检查唯一约束（如是否已兑换过）

**唯一约束**:
- 使用数据库唯一约束防止重复数据（如广告观看记录、兑换记录）
- 应用层也要做检查，提前返回友好错误信息

**完整性检查**:
- 定期检查孤立数据（如积分记录中的 `user_id` 是否在 `users` 表中存在）
- 修复不一致的数据（如删除孤立的记录或补充缺失的记录）
- 记录异常日志并告警

**关联一致性**:
- 确保所有关联表的 `user_id` 都对应有效的 `users.id`
- 删除用户时，需要处理关联表数据（使用软删除保留历史）
- 不允许直接删除关联表中的 `user_id`，需要级联处理

### 5.3 级联操作处理

**删除用户**:
- 使用软删除（`deleted_at` 字段），保留历史数据
- 关联表数据保留，但标记为已删除用户的数据
- 不实际删除数据，便于数据审计和恢复
- `user_id` 作为关联标识，不允许修改

**更新用户**:
- 仅更新 `users` 表，不影响关联表
- `id` 作为系统用户ID，不允许修改
- `open_id` 作为登录标识，不允许修改（如需修改，需要重新创建用户）

### 5.4 定期数据校验

**校验任务**:
- 每天/每周检查数据一致性
- 检查孤立数据（关联表中有但主表不存在的记录）
- 检查缺失数据（主表中有但关联表缺失的记录）
- 对账：积分表和积分记录表对账，确保积分计算的准确性

**修复策略**:
- 自动修复明显的问题（如创建缺失的积分记录）
- 人工介入处理复杂问题
- 记录所有修复操作

### 5.5 数据存储策略

**核心思想**: 所有用户的数据都保存在后端，小程序端通过用户类型（`user_type`）来限制功能访问权限

#### 5.5.1 用户类型定义

**免费用户（user_type = 'free'）**:
- 默认用户类型
- 所有数据保存在后端（与付费用户相同）
- 小程序端限制部分功能（如高级功能、完整统计等）
- 每月有积分限制（1000积分/月）

**付费用户（user_type = 'premium'）**:
- 年费无限积分用户
- 所有数据保存在后端
- 小程序端开放所有功能
- 无限积分（不受月度限制）
- 支持云端同步和多设备访问
- 提供完整的学习统计和分析功能

#### 5.5.2 数据存储划分

**所有用户 - 后端保存**:
- ✅ 用户基本信息（`users` 表）
- ✅ 积分信息（`user_points` 表）
- ✅ 积分记录（`points_records` 表）
- ✅ 兑换记录（`redemption_records` 表）
- ✅ 广告观看记录（`ad_watch_records` 表）
- ✅ 阅读记录（`question_read_records` 表）
- ✅ 收藏记录（`favorites` 表）- 如果实现
- ✅ 笔记（`notes` 表）- 如果实现
- ✅ 错题本（`wrong_questions` 表）- 如果实现
- ✅ 学习历史（`study_history` 表）- 如果实现
- ✅ 学习统计（`study_statistics` 表）- 如果实现

**小程序端功能限制**:
- 小程序端根据 `user_type` 字段决定是否显示/启用某些功能
- 后端不限制数据访问，所有用户都可以保存和读取数据
- 功能限制逻辑在小程序端实现

#### 5.5.3 业务逻辑处理

**阅读题目逻辑**:
- **所有用户**：
  - 检查后端是否已阅读（调用后端接口）
  - 如果未阅读，增加积分（调用后端接口）
  - 记录阅读历史到后端（调用后端接口）
  - 防止重复获得积分通过后端数据库检查

**获取学习统计**:
- **所有用户**：
  - 从后端获取学习统计（阅读记录、学习天数等）
  - 从后端获取积分信息（当前积分、月度信息）
  - 小程序端根据用户类型决定显示哪些统计信息

**防止重复获得积分**:
- **所有用户**：通过后端数据库检查是否已阅读

#### 5.5.4 数据迁移策略（从旧版本小程序迁移历史数据）

**说明**:
- 现在所有用户的数据都保存在后端，此接口主要用于从旧版本小程序迁移历史数据
- 旧版本小程序可能将数据保存在本地，升级后需要迁移到后端

**触发时机**:
- 用户首次使用新版本小程序时，检测到本地有历史数据
- 用户主动触发数据迁移（可选功能）

**迁移流程**:
1. 读取小程序本地存储的历史数据（阅读记录等）
2. 批量导入到后端数据库（`question_read_records` 表）
3. 导入其他本地数据（收藏、笔记、错题本等）
4. 返回迁移结果

**迁移接口**:
- `POST /api/v1/user/migrate-data`: 迁移本地数据到后端
- 请求：包含本地数据（阅读记录、收藏等）
- 响应：迁移结果（成功/失败，迁移数量）

**迁移注意事项**:
- 使用事务保证数据一致性
- 批量导入，避免一次性导入过多数据
- 导入时检查数据有效性（题目ID是否存在等）
- 自动去重（已存在的记录跳过）
- 迁移失败时，保留本地数据，不影响用户体验
- 提供迁移进度提示（可选）

**数据备份**:
- 迁移前，建议在小程序本地保留备份
- 迁移成功后，提示用户可以选择删除本地数据
- 迁移失败时，保留本地数据，用户可以稍后重试

#### 5.5.5 付费用户到期处理

**到期检查**:
- 用户每次请求时检查 `premium_expire_date` 是否过期
- 如果过期，更新 `user_type = 'free'`
- **数据保留**：所有数据都保留在后端，不删除
- 小程序端根据用户类型限制功能访问

**数据保留策略**:
- 付费用户到期后，所有数据都保留在后端
- 用户重新付费后，可以立即恢复所有功能
- 不删除任何数据，确保用户体验连续性

#### 5.5.6 存储优势

**统一数据管理**:
- 所有用户的数据都保存在后端，便于管理和分析
- 支持云端同步和多设备访问
- 数据更安全（云端备份）

**功能差异化**:
- 小程序端根据用户类型限制功能访问
- 付费用户享受更多功能和完整统计
- 免费用户享受基础功能

**增值服务**:
- 付费用户可以享受云端同步
- 支持多设备访问
- 提供完整的学习统计和分析
- 数据更安全（云端备份）

#### 5.5.7 实现注意事项

**小程序端**:
- 根据 `user_type` 字段决定功能显示和访问权限
- 实现功能权限控制逻辑
- 提供数据迁移功能（从旧版本迁移历史数据）

**后端端**:
- 所有用户的数据都保存到后端
- 不根据用户类型限制数据访问
- 提供数据迁移接口（用于从旧版本迁移）

**兼容性**:
- 确保数据迁移不影响用户使用
- 降级时不影响数据完整性，只限制功能访问

## 六、业务逻辑设计

### 6.1 用户认证流程

1. 小程序端调用 `wx.login()` 获取 `code`
2. 将 `code` 发送到后端 `/api/auth/login` 接口
3. 后端调用微信接口 `auth.code2Session` 换取 `openid` 和 `session_key`
4. 使用 `open_id` 查询 `users` 表中是否存在该用户
5. 如果不存在：
   - 调用 `IDGeneratorService.GenerateUserID()` 生成短用户ID（内部：获取序号 → 组合前缀，如 `shiyu10000`）
   - 创建新用户记录：
     - 设置 `user_id`（短ID，从 10000 开始，如 `shiyu10000`、`shiyu10001`）
     - 设置 `open_id`（微信 openId）
     - 设置 `user_type = 'free'`（默认免费用户）
     - 其他字段
   - 创建对应的积分记录（使用 `user_id` 关联）
   - 初始积分为 1000
6. 如果存在：
   - 更新最后登录时间等信息
   - 获取短用户ID（`user_id`，格式如 `shiyu10000`）
7. 生成 JWT token（包含 `user_id`（短ID，如 `shiyu10000`）和 `open_id`）返回给小程序
8. 小程序保存 token，后续请求携带 token
9. **注意**: 
   - 后续业务逻辑使用 `user_id`（短ID，如 `shiyu10000`、`shiyu10001`）进行关联
   - `open_id` 仅用于登录识别和查询用户
   - `id`（自增主键）仅用于内部关联和性能优化
   - 从 10000 开始，不暴露真实用户数量（至少前 10000 个用户）

### 6.2 积分增加流程（阅读题目）

**免费用户流程**:
1. 用户打开题目详情页
2. 首先触发积分重置检查（如果当天还未检查过）：
   - 调用 `PointsService.CheckAndResetIfNeeded(userID)`
   - 检查是否跨月，如果跨月则重置到 1000 积分
3. **检查小程序本地**是否已阅读过（localStorage 中的 `question_read_records`）
4. 如果已阅读过，返回错误（不调用后端接口）
5. 如果未阅读过，检查用户积分上限（非无限积分用户）
6. 检查是否超过月度上限（重置后应该不超过）
7. 如果通过验证，调用后端接口 `/api/questions/read`：
   - 增加 `user_points.current_points`
   - 插入 `points_records` 记录
   - **不插入** `question_read_records` 记录（免费用户不保存）
8. 更新 Redis 缓存
9. **在小程序本地记录阅读历史**（localStorage）
10. 返回结果

**付费用户流程**:
1. 用户打开题目详情页
2. 首先触发积分重置检查（如果当天还未检查过）：
   - 调用 `PointsService.CheckAndResetIfNeeded(userID)`
   - 检查是否跨月，如果跨月则重置到 1000 积分（如果非无限积分用户）
3. 调用后端接口 `/api/questions/read`，后端检查是否已阅读过：
   - 查询 `question_read_records` 表
   - 检查用户类型（`user_type = 'premium'`）
4. 如果已阅读过，返回错误
5. 如果未阅读过，检查用户积分上限（非无限积分用户）
6. 检查是否超过月度上限（重置后应该不超过）
7. 如果通过验证，使用事务：
   - 增加 `user_points.current_points`
   - 插入 `points_records` 记录
   - 插入 `question_read_records` 记录（付费用户保存）
8. 更新 Redis 缓存
9. 返回结果

### 6.3 每月积分重置流程（用户请求触发）

**触发时机**: 用户每天首次打开小程序时，调用 `/api/points/current` 或 `/api/auth/login` 接口

**重置逻辑**:
1. 用户请求触发：每天第一次请求时检查是否需要重置
2. 检查条件：
   - 通过 `user_id` 获取用户积分信息（先查 Redis 缓存，再查数据库）
   - 检查 `last_reset_date` 是否跨月
   - 判断标准：当前月份与 `last_reset_date` 的月份不同
   - 如果是跨月，且用户不是无限积分用户，则触发重置
3. 重置操作（使用事务和分布式锁）：
   - 使用分布式锁防止并发问题（Redis 锁：`lock:reset:{user_id}`）
   - 检查 `is_unlimited` 是否为 false
   - 如果为 false，重置积分：
     - `current_points = 1000`（重置到 1000 积分）
     - `last_reset_date = 当前日期`
   - 如果为 true（无限积分用户），检查 `unlimited_expire_date` 是否过期
   - 如果过期，恢复为普通用户并重置积分
4. 清除相关 Redis 缓存：
   - 删除 `user:points:{user_id}` 缓存
   - 删除重置锁
5. 记录重置日志（可选，用于审计）

**实现位置**:
- 在 `PointsService.GetCurrentPoints(userID)` 方法中实现重置检查
- 在 `AuthService.Login()` 方法中也可以触发重置检查（首次登录时）
- 重置逻辑封装为独立方法：`PointsService.CheckAndResetIfNeeded(userID)`

**注意**: 
- 所有业务逻辑使用 `user_id` 进行关联操作
- `open_id` 仅用于登录识别和查询用户，查询后需要转换为 `user_id`
- 可以通过 Redis 缓存 `user:openid:{open_id}` 快速查找 `user_id`

**优势**:
- 无需定时任务，降低系统复杂度
- 用户请求时才检查，节省资源
- 懒加载机制，按需重置
- 分布式锁保证并发安全

**注意事项**:
- 每天只检查一次，避免重复检查（使用 Redis 标记）
- 检查标记：`check:reset:{open_id}:{month}`（按月标记）
- 标记过期时间：32 天（确保跨月时能检查）

### 6.4 公众号免费积分兑换流程

1. 用户输入兑换码，调用 `/api/redemption/wechat` 接口
2. 检查用户是否已兑换过（查询 `redemption_records` 中 `wechat_free` 类型）
3. 验证兑换码：
   - 查询 `redemption_codes` 表
   - 检查 `code_type = 'wechat_free'`
   - 检查 `is_active = true`
   - 检查是否过期（`expire_date`）
   - 检查使用次数（`used_count < max_uses`）
4. 如果验证通过，使用事务：
   - 增加积分（调用积分服务）
   - 插入 `redemption_records` 记录
   - 更新 `redemption_codes.used_count`
5. 返回结果

### 6.5 观看广告获取积分流程

1. 用户点击"观看广告"按钮
2. 小程序播放激励视频广告
3. 广告播放完成后，调用 `/api/redemption/ads` 接口
4. 检查今天是否已观看：
   - 查询 `ad_watch_records` 表（今天日期）
   - 使用 Redis 做双重检查（防止并发）
5. 如果未观看，使用事务：
   - 增加 200 积分
   - 插入 `ad_watch_records` 记录
   - 设置 Redis 标记（24 小时过期）
6. 返回结果

### 6.6 年费无限积分兑换流程

1. 用户输入年费兑换码，调用 `/api/redemption/code` 接口
2. 验证兑换码：
   - 查询 `redemption_codes` 表
   - 检查 `code_type = 'yearly_unlimited'`
   - 检查是否过期和使用次数
3. 计算到期日期（当前日期 + 1 年）
4. 如果用户已有无限积分，延长到期日期（取较晚的日期）
5. 使用事务：
   - 更新 `users` 表：
     - `user_type = 'premium'`（升级为付费用户）
     - `premium_expire_date = 到期日期`
   - 更新 `user_points` 表：
     - `is_unlimited = true`
     - `unlimited_expire_date = 到期日期`
   - 插入 `redemption_records` 记录
   - 更新 `redemption_codes.used_count`
6. 清除用户相关缓存
7. 返回结果，提示用户可以进行数据迁移

**数据迁移提示**:
- 兑换成功后，提示免费用户可以将本地数据迁移到后端
- 小程序端可以调用 `/api/v1/user/migrate-data` 接口迁移数据
- 用户可以选择立即迁移或稍后迁移
- 迁移后享受云端同步和多设备访问功能

### 6.7 积分上限检查策略

**无限积分用户**:
- 不检查月度上限
- 直接增加积分
- 在重置检查时，检查 `unlimited_expire_date` 是否过期
- 如果过期，恢复为普通用户（`is_unlimited = false`），重置到 1000 积分

**普通用户**:
- 每次操作前先触发重置检查（如果当天还未检查过）
- 如果跨月，重置积分到 1000（`current_points = 1000`）
- 每次增加积分前检查月度上限
- 检查新积分是否超过 `monthly_limit`（1000）
- 如果超过，返回错误

**重置检查时机**:
- 用户每天首次请求时检查（如 `/api/points/current`）
- 用户登录时检查（`/api/auth/login`）
- 增加积分前检查（`/api/questions/read`）
- 使用 Redis 标记避免重复检查：`check:reset:{user_id}:{YYYY-MM}`

**实时检查**: 每次增加积分时实时检查，不使用延迟检查

**用户类型和积分检查**:
- **免费用户**：检查月度上限（1000积分），积分重置正常
- **付费用户（无限积分）**：不检查月度上限，积分重置功能禁用
- **付费用户到期**：恢复为免费用户（`user_type = 'free'`），恢复月度上限检查

**付费用户到期处理**:
- 每次请求时检查 `premium_expire_date` 是否过期
- 如果过期，更新 `user_type = 'free'` 和 `is_unlimited = false`
- 提示用户数据已降级，建议备份数据到本地
- 学习记录保留 30 天（可配置），30 天内重新付费可以恢复

## 七、Redis 使用场景

### 7.1 缓存策略

**用户积分信息缓存**:
- Key: `user:points:{user_id}`
- Value: 用户积分信息（JSON 格式）
- 过期时间: 5 分钟
- 更新策略: 写入时更新或删除缓存

**用途**: 减少数据库查询，提高响应速度

**用户ID映射缓存**:
- Key: `user:openid:{open_id}`
- Value: 短用户ID（`user_id`，如 `shiyu01`）
- 过期时间: 1 小时
- 更新策略: 登录时更新

**用途**: 通过 open_id 快速查找 user_id（短ID），避免每次都需要查询数据库

**短ID序号缓存**:
- Key: `id:generator:user_id:sequence`
- Value: 当前序号（整数，从 10000 开始，如 `10000`, `10001`, `10002`...）
- 过期时间: 永久（除非手动删除）
- 更新策略: 生成ID时使用 `INCR` 递增
- 初始化: 首次生成时，如果序号小于 10000，则设置为 10000

**用途**: 存储短ID生成器的当前序号，支持分布式ID生成，从 10000 开始累计

### 7.2 限流策略

**API 限流**:
- Key: `ratelimit:api:{user_id}:{endpoint}`
- Value: 请求计数
- 过期时间: 限流时间窗口
- 策略: 使用计数器实现滑动窗口限流

**IP 限流**:
- Key: `ratelimit:ip:{ip}:{endpoint}`
- 防止恶意调用

### 7.3 分布式锁

**积分重置锁**:
- Key: `lock:reset:{user_id}`
- Value: 锁标识
- 过期时间: 5 分钟
- 用途: 防止并发请求导致重复重置积分
- 说明: 在检查重置时获取锁，重置完成后释放

**广告观看锁**:
- Key: `lock:ad_watch:{user_id}:{date}`
- 过期时间: 24 小时
- 用途: 防止并发请求导致重复观看

### 7.4 防重复机制

**广告观看标记**:
- Key: `ad:watch:{user_id}:{date}`
- Value: "watched"
- 过期时间: 24 小时
- 用途: 快速检查今天是否已观看，减少数据库查询

**兑换码缓存**:
- Key: `redemption:code:{code}`
- Value: 兑换码信息
- 过期时间: 1 小时
- 用途: 提高兑换码验证速度

**积分重置检查标记**:
- Key: `check:reset:{user_id}:{YYYY-MM}`
- Value: "checked"
- 过期时间: 32 天（确保跨月时能检查）
- 用途: 防止每天重复检查积分重置，每月只检查一次
- 说明: 按月标记，跨月时自动失效，触发新的检查

## 八、API 接口设计

### 8.1 认证相关

- `POST /api/v1/auth/login`: 登录，获取 token（会自动检查并重置积分，如果跨月）
- `GET /api/v1/auth/user-info`: 获取用户信息

**说明**: 
- `POST /api/v1/auth/login` 接口在用户登录时会自动检查积分是否需要重置。如果检测到跨月，会自动重置积分到 1000。这是用户每天首次打开小程序的入口，确保及时重置积分。
- 返回的用户信息中包含 `user_type` 字段（`free` 或 `premium`），用于小程序端判断数据存储方式

### 8.2 积分相关

- `GET /api/v1/points/current`: 获取当前积分（会自动检查并重置积分，如果跨月）
- `GET /api/v1/points/records`: 获取积分记录（分页）
- `GET /api/v1/points/monthly-info`: 获取本月积分信息（会自动检查并重置积分，如果跨月）

**说明**: `GET /api/v1/points/current` 和 `GET /api/v1/points/monthly-info` 接口会自动检查积分是否需要重置。如果检测到跨月，会自动重置积分到 1000，并更新 `last_reset_date`。使用 Redis 标记确保每天只检查一次。

### 8.3 兑换相关

- `POST /api/v1/redemption/wechat`: 公众号免费积分兑换
- `POST /api/v1/redemption/ads`: 观看广告获取积分
- `POST /api/v1/redemption/code`: 年费无限积分兑换

### 8.4 题目相关

- `GET /api/v1/questions/categories`: 获取分类列表
- `GET /api/v1/questions/list`: 获取题目列表（分页）
- `GET /api/v1/questions/detail`: 获取题目详情
- `POST /api/v1/questions/read`: 记录阅读题目（自动加积分）

**说明**: 
- `POST /api/v1/questions/read` 接口的行为根据用户类型不同：
  - **免费用户**：只增加积分，不保存阅读记录到后端（阅读记录保存在小程序本地）
  - **付费用户**：增加积分并保存阅读记录到后端（用于云端同步）
- 防止重复获得积分：
  - 免费用户：通过小程序本地数据检查
  - 付费用户：通过后端数据库检查

### 8.5 用户数据相关

- `POST /api/v1/user/migrate-data`: 迁移本地数据到后端（免费用户升级为付费用户时）
- `GET /api/v1/user/study-statistics`: 获取学习统计（付费用户专用）

**说明**:
- `POST /api/v1/user/migrate-data`：
  - 请求参数：本地数据（阅读记录、收藏、笔记等）
  - 功能：将小程序本地数据迁移到后端
  - 触发时机：免费用户升级为付费用户时
  - 返回：迁移结果（成功/失败，迁移数量）
- `GET /api/v1/user/study-statistics`：
  - 功能：获取完整的学习统计（阅读记录、学习进度等）
  - 权限：仅付费用户可用
  - 免费用户：从小程序本地获取学习统计

## 九、任务调度设计

### 9.1 设计原则

**核心思想**: 不使用定时任务，所有业务逻辑通过用户请求触发

**优势**:
- 降低系统复杂度，无需管理定时任务
- 按需执行，节省服务器资源
- 懒加载机制，只在需要时检查
- 避免定时任务失败导致的业务异常
- 更符合云原生架构，便于水平扩展

### 9.2 积分重置机制（用户请求触发）

**不再使用定时任务**，改为用户请求时触发：

- **触发时机**: 用户每天首次打开小程序时
- **检查位置**: 
  - `/api/points/current` 接口（获取积分时）
  - `/api/auth/login` 接口（登录时）
  - 其他需要积分信息的接口
- **检查逻辑**: 封装在 `PointsService.CheckAndResetIfNeeded()` 方法中
- **防重复**: 使用 Redis 标记，每天只检查一次
- **并发安全**: 使用分布式锁防止并发问题

### 9.3 可选的后台任务（未来扩展）

如果未来需要定时任务，可以考虑以下场景（非必需）：

**数据校验任务**（可选）:
- **执行时间**: 每天凌晨 2:00（可配置）
- **任务内容**: 检查数据一致性，修复孤立数据
- **执行方式**: 可配置是否自动修复
- **说明**: 这不是业务必需的任务，仅用于数据维护

**缓存清理任务**（可选）:
- **执行时间**: 每小时执行一次（可配置）
- **任务内容**: 清理过期的缓存键
- **执行方式**: 扫描并删除过期的 key
- **说明**: Redis 可以配置过期策略，此任务可省略

## 十、安全性设计

### 10.1 认证授权

- 所有 API 接口（除登录外）都需要 JWT token
- Token 有效期 7 天
- Token 过期后需要重新登录
- 敏感操作（如兑换）需要额外验证

### 10.2 接口限流

- 每个接口都有请求频率限制
- 按用户和 IP 双重限流
- 防止恶意调用和刷接口

### 10.3 数据验证

- 所有输入参数都进行验证
- 防止 SQL 注入（使用参数化查询）
- 防止 XSS 攻击（输出转义）

### 10.4 日志审计

- 记录所有积分变化操作
- 记录所有兑换操作
- 记录异常操作和错误
- 便于问题追踪和数据审计

## 十一、性能优化

### 11.1 数据库优化

- 合理使用索引
- 避免全表扫描
- 使用分页查询
- 批量操作使用事务

### 11.2 缓存优化

- 热点数据缓存（用户积分信息）
- 减少数据库查询
- 设置合理的过期时间
- 缓存更新策略：写入时更新或删除

### 11.3 查询优化

- 避免 N+1 查询问题
- 使用批量查询替代循环查询
- 需要时使用 JOIN，但要注意性能
- 复杂查询考虑分库分表（未来扩展）

## 十二、监控和运维

### 12.1 日志记录

- 使用结构化日志（JSON 格式）
- 记录所有关键操作
- 记录错误和异常
- 日志分级（DEBUG/INFO/WARN/ERROR）

### 12.2 指标监控

- API 响应时间
- 接口调用次数和错误率
- 数据库连接池使用情况
- Redis 缓存命中率
- 积分操作成功率

### 12.3 告警机制

- 积分异常波动告警
- 兑换码大量使用告警
- 系统异常告警
- 定时任务执行失败告警

## 十三、扩展性设计

### 13.1 水平扩展

- 无状态服务，支持多实例部署
- Redis 支持集群模式
- 数据库支持读写分离（未来）

### 13.2 功能扩展

- 预留扩展字段
- 使用策略模式支持新的积分来源
- 支持新的兑换码类型
- 预留积分商城接口（未来功能）

### 13.3 数据迁移

- 支持从旧系统迁移数据
- 提供数据导入工具
- 支持增量迁移
- 数据校验和修复工具

## 十四、开发规范

### 14.1 代码规范

- 遵循 Go 官方代码规范
- 使用 `golangci-lint` 进行代码检查
- 代码注释完整，特别是公共函数和接口
- 错误处理完善，不忽略错误
- 使用接口定义依赖关系，降低耦合

### 14.2 低耦合实现规范

#### 14.2.1 接口定义规范

- 每个 Service 都定义对应的接口（如 `IPointsService`）
- 每个 Repository 都定义对应的接口（如 `IPointsRepository`）
- 接口文件独立（如 `points_service_interface.go`）
- 实现文件使用接口（如 `points_service.go` 实现 `IPointsService`）

#### 14.2.2 依赖注入规范

- 使用构造函数注入依赖
- 不使用全局变量或单例模式（除配置外）
- 在 `main.go` 中组装所有依赖
- Handler 通过构造函数接收 Service 接口
- Service 通过构造函数接收 Repository 接口和 Cache 接口

#### 14.2.3 分层调用规范

- Handler 层只调用 Service 层，不调用 Repository 层
- Service 层只调用 Repository 层和 Cache 层，不调用 Handler 层
- Repository 层只访问数据库，不调用 Service 层
- 禁止跨层调用
- 禁止反向依赖

#### 14.2.4 单一职责规范

- 每个模块只负责一个功能
- 每个函数只做一件事
- 避免函数过长（建议不超过 50 行）
- 使用组合而非继承

#### 14.2.5 测试规范

- 为每个 Service 编写单元测试
- 使用 mock 对象替代真实依赖
- 测试覆盖率不低于 70%
- 使用接口便于 mock

### 14.3 数据库规范

- 表名和字段名使用下划线命名
- 所有表都有 `created_at` 和 `updated_at` 字段
- 软删除使用 `deleted_at` 字段
- 不使用数据库外键约束
- 使用逻辑关联，通过 `user_id` 关联用户

### 14.4 短用户ID生成规范

**格式规则**:
- 格式：`{前缀}{序号}`
- 前缀：固定前缀（如 `shiyu`），可配置
- 起始序号：从 10000 开始，自动递增（可配置）
- 序号长度：不补零，自然增长（如 `10000`, `10001`, `10002`...`10099`, `10100`）
- 长度：前缀长度 + 序号长度（如 `shiyu` + `10000` = 10 个字符）

**生成方式**:
- 使用 Redis 计数器或数据库序列生成序号
- 从 10000 开始（首次生成时初始化为 10000）
- 每次自动递增 1
- 组合前缀和序号生成最终短ID
- 确保唯一性和递增性
- 支持分布式环境（使用分布式锁）

**实现位置**:
- 在 `IDGeneratorService` 中实现
- 用户注册时调用 `GenerateUserID()` 生成短ID
- 初始化时检查当前序号，如果小于 10000，则设置为 10000

**安全性说明**:
- **不暴露真实用户数量**：从 10000 开始，至少前 10000 个用户不暴露真实数量
- **简单直观**：不需要编码/解码，实现简单
- **便于管理**：序号连续，便于查询和统计

**配置参数**:
- `user_id_prefix`: 用户ID前缀（如 `shiyu`），默认 `shiyu`
- `user_id_start_sequence`: 起始序号（如 `10000`），默认 `10000`

**示例**:
- 第 1 个用户（序号 10000）：`shiyu10000`（10 字符）
- 第 2 个用户（序号 10001）：`shiyu10001`（10 字符）
- 第 100 个用户（序号 10099）：`shiyu10099`（10 字符）
- 第 1000 个用户（序号 10999）：`shiyu10999`（10 字符）
- 第 10000 个用户（序号 19999）：`shiyu19999`（10 字符）
- 第 90000 个用户（序号 99999）：`shiyu99999`（10 字符）
- 第 90001 个用户（序号 100000）：`shiyu100000`（11 字符）⚠️ **超过 99999，长度增加**
- 第 100000 个用户（序号 109999）：`shiyu109999`（11 字符）
- 第 1000000 个用户（序号 1009999）：`shiyu1009999`（12 字符）

**序号长度变化**:
- 序号 10000-99999：5位数字，ID总长度 10 字符
- 序号 100000-999999：6位数字，ID总长度 11 字符
- 序号 1000000-9999999：7位数字，ID总长度 12 字符
- 序号 10000000-99999999：8位数字，ID总长度 13 字符

**超过 99999 时的影响**:
- ✅ **字段容量**：`VARCHAR(50)` 完全足够，不会超出限制（即使到亿级用户也只需 13 字符左右）
- ✅ **功能正常**：所有功能不受影响，只是ID长度从 10 字符增加到 11 字符
- ✅ **性能无影响**：字符串长度差异很小（10-13字符），性能影响可忽略
- ✅ **安全性**：依然不会暴露真实用户数量（因为从 10000 开始）
- ✅ **可扩展性**：支持到亿级用户也不会有问题

**注意**: 从 10000 开始累计，至少前 10000 个用户不暴露真实用户数量。即使超过 99999，也不会有任何影响。

### 14.3 Git 规范

- 使用语义化提交信息
- 功能开发使用 feature 分支
- 代码审查通过后才能合并
- 使用标签标记版本

## 十五、部署方案

### 15.1 环境配置

- 开发环境：本地开发
- 测试环境：用于测试
- 生产环境：线上运行

### 15.2 配置文件

- 使用 YAML 配置文件
- 敏感信息使用环境变量
- 不同环境使用不同配置
- 配置热更新（可选）

### 15.3 数据库部署

- 主从复制（未来）
- 定期备份
- 备份恢复测试

### 15.4 Redis 部署

- 单机模式（初期）
- 集群模式（扩展时）
- 持久化配置
- 内存淘汰策略

---

**文档版本**: v1.0  
**最后更新**: 2024-01-XX  
**维护者**: CodeYa 开发团队

