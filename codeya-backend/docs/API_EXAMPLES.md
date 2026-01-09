# API 使用示例

## 基础信息

- Base URL: `http://localhost:8080/api/v1`
- 认证方式: Bearer Token（JWT）
- Content-Type: `application/json`

## 1. 用户认证

### 1.1 登录

**接口**: `POST /auth/login`

**请求**:
```json
{
  "code": "微信小程序 wx.login() 返回的 code"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": "shiyu10000",
    "open_id": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
    "user_type": "free",
    "user_info": {
      "id": 1,
      "user_id": "shiyu10000",
      "open_id": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
      "user_type": "free",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

**cURL 示例**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "your_wechat_code"}'
```

### 1.2 获取用户信息

**接口**: `GET /auth/user-info`

**请求头**:
```
Authorization: Bearer your_token
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "user_id": "shiyu10000",
    "open_id": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
    "user_type": "free",
    "nickname": "用户昵称",
    "avatar_url": "头像URL",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 2. 积分管理

### 2.1 获取当前积分

**接口**: `GET /points/current`

**请求头**:
```
Authorization: Bearer your_token
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "current_points": 1000,
    "monthly_limit": 1000,
    "remaining": 0,
    "last_reset_date": "2024-01-01T00:00:00Z",
    "is_unlimited": false,
    "unlimited_expire_date": null
  }
}
```

### 2.2 获取月度积分信息

**接口**: `GET /points/monthly`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "current_points": 1000,
    "monthly_limit": 1000,
    "remaining": 0,
    "last_reset_date": "2024-01-01T00:00:00Z",
    "is_unlimited": false,
    "unlimited_expire_date": null,
    "month_start": "2024-01-01T00:00:00Z",
    "month_end": "2024-01-31T23:59:59Z"
  }
}
```

### 2.3 获取积分记录

**接口**: `GET /points/records?page=1&page_size=20`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "user_id": "shiyu10000",
        "points": 2,
        "source": "question",
        "source_id": "123",
        "description": "阅读题目：Java基础",
        "created_at": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

## 3. 兑换功能

### 3.1 兑换公众号免费积分

**接口**: `POST /redemption/wechat-free`

**请求**:
```json
{
  "code": "WECHAT_FREE_2024"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "兑换成功"
  }
}
```

### 3.2 观看广告获取积分

**接口**: `POST /redemption/ads`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "观看成功，获得200积分"
  }
}
```

**注意**: 每天只能观看一次，重复观看会返回错误。

### 3.3 兑换年费无限积分

**接口**: `POST /redemption/yearly-unlimited`

**请求**:
```json
{
  "code": "YEARLY_2024"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "兑换成功，已升级为付费用户"
  }
}
```

## 4. 题目管理

### 4.1 获取分类列表

**接口**: `GET /questions/categories`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "key": "java",
      "name": "Java",
      "description": "Java 相关题目",
      "question_count": 100,
      "icon": "",
      "order": 1
    }
  ]
}
```

### 4.2 获取题目列表

**接口**: `GET /questions/list?category_key=java&page=1&page_size=20`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "questions": [
      {
        "id": 1,
        "category_key": "java",
        "title": "Java基础题目",
        "difficulty": "简单",
        "view_count": 100,
        "description": "题目描述",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

### 4.3 获取题目详情

**接口**: `GET /questions/detail/1`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "category_key": "java",
    "title": "Java基础题目",
    "difficulty": "简单",
    "view_count": 101,
    "description": "题目描述",
    "code": "代码示例",
    "md_content": "Markdown内容",
    "tags": ["java", "基础"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 4.4 记录阅读题目（自动加积分）

**接口**: `POST /questions/read`

**请求**:
```json
{
  "question_id": 1
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "阅读成功",
    "points": 2,
    "user_type": "free"
  }
}
```

**注意**:
- 所有用户的阅读记录都保存到后端
- 自动增加积分（根据题目难度：简单1分、中等2分、困难3分）
- 重复阅读会返回错误（通过后端数据库检查）

## 5. 用户数据迁移

### 5.1 迁移本地数据到后端

**接口**: `POST /user/migrate-data`

**请求**:
```json
{
  "read_records": [
    {
      "question_id": 1,
      "read_at": "2024-01-01T10:00:00Z"
    },
    {
      "question_id": 2,
      "read_at": "2024-01-01T11:00:00Z"
    }
  ]
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "success": true,
    "migrated_count": 2,
    "failed_count": 0,
    "message": "成功迁移 2 条记录"
  }
}
```

**注意**: 
- 此接口主要用于从旧版本小程序迁移历史数据
- 现在所有用户的数据都保存在后端，新版本小程序不需要使用此接口
- 自动去重（已存在的记录会跳过）

## 6. 健康检查

### 6.1 健康检查

**接口**: `GET /health`

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": "ok",
    "checks": {
      "database": {
        "status": "ok",
        "open_connections": 5,
        "in_use": 1,
        "idle": 4
      },
      "redis": {
        "status": "ok"
      }
    }
  }
}
```

## 错误响应格式

```json
{
  "code": 1,
  "message": "错误信息"
}
```

## 常见错误码

- `0`: 成功
- `1`: 通用错误
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `429`: 请求过于频繁
- `500`: 服务器内部错误
- `503`: 服务不可用

## 小程序端集成示例

### 登录流程

```javascript
// 1. 调用微信登录
wx.login({
  success: (res) => {
    if (res.code) {
      // 2. 调用后端登录接口
      wx.request({
        url: 'http://localhost:8080/api/v1/auth/login',
        method: 'POST',
        data: {
          code: res.code
        },
        success: (res) => {
          if (res.data.code === 0) {
            // 3. 保存 token
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('user_id', res.data.data.user_id);
            wx.setStorageSync('user_type', res.data.data.user_type);
          }
        }
      });
    }
  }
});
```

### 请求拦截器

```javascript
// 在请求前添加 token
const request = (options) => {
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = options.header || {};
    options.header['Authorization'] = `Bearer ${token}`;
  }
  return wx.request(options);
};
```


