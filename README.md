<!--
 * @Author: JavaPub
 * @Date: 2025-02-26 11:52:01
 * @LastEditors: your name
 * @LastEditTime: 2025-03-12 12:43:45
 * @Description: Here is the JavaPub code base. Search JavaPub on the whole web.
 * @FilePath: /codeya/README.md
-->
# 编程鸭 (CodeYa)

<div align="center">
  <img src="/images/list/logo.png" alt="编程鸭 Logo" width="120">
</div>

## 项目介绍

编程鸭是一款专注于编程学习和面试题库的微信小程序，为开发者提供丰富的编程知识和面试题目。通过分类整理的题库，用户可以系统地学习各种编程语言和技术栈的核心知识点，提高编程技能和面试通过率。

## 功能特性

- **分类题库**：按技术领域（MySQL、Java、Redis、Python、GoLang等）分类整理的题库
- **详细解析**：每道题目都有详细的解题思路和代码实现
- **难度标识**：题目按简单、中等、困难三个难度级别分类
- **积分系统**：学习题目可获取积分，激励持续学习
- **Markdown渲染**：支持Markdown格式的内容渲染（基于towxml组件）
- **分享功能**：支持分享题目给好友或朋友圈
- **标签系统**：通过标签快速找到相关题目
- **横幅通知**：首页显示横幅通知，可由用户关闭
- **激活码系统**：提供激活码领取功能

## 技术栈

- **前端框架**：微信小程序原生框架
- **数据管理**：本地数据存储 + 微信云开发
- **UI组件**：自定义组件 + 微信原生组件
- **渲染引擎**：Towxml（Markdown渲染）
- **状态管理**：全局App实例 + 页面数据

## 项目结构

```
codeya/
├── components/           # 自定义组件
│   └── banner/           # 横幅组件
├── data/                 # 数据文件
│   ├── categories.js     # 分类数据
│   ├── questions.js      # 题目数据
│   ├── points.js         # 积分数据
│   └── db.js             # 数据操作接口
├── images/               # 图片资源
│   ├── list/             # 分类图标
│   └── logo/             # 应用logo
├── pages/                # 页面文件
│   ├── index/            # 首页（分类列表）
│   ├── category/         # 分类详情页
│   ├── detail/           # 题目详情页
│   ├── profile/          # 个人中心
│   ├── home/             # 主页（入口页面）
│   └── activation/       # 激活码页面
├── towxml/               # Markdown渲染组件
├── utils/                # 工具函数
├── app.js                # 应用入口
├── app.json              # 应用配置
└── app.wxss              # 应用样式
```

## 页面说明

### 1. 主页 (Home)
- **路径**: `/pages/home/home`
- **功能**: 应用入口页面，展示应用logo和主要导航按钮
- **组件**: 横幅通知、导航按钮

### 2. 首页 (Index)
- **路径**: `/pages/index/index`
- **功能**: 展示所有分类和热门题目
- **特点**: 
  - 分类按order字段排序
  - 支持展开/收起分类查看题目
  - 显示热门题目（按浏览量排序）

### 3. 分类详情页 (Category)
- **路径**: `/pages/category/category`
- **功能**: 展示特定分类下的所有题目
- **参数**: `key` - 分类的唯一标识

### 4. 题目详情页 (Detail)
- **路径**: `/pages/detail/detail`
- **功能**: 展示题目的详细内容和解析
- **参数**: 
  - `categoryKey` - 分类的唯一标识
  - `questionId` - 题目ID
- **特点**:
  - Markdown渲染题目内容
  - 支持分享功能
  - 显示标签
  - 阅读积分累计

### 5. 个人中心 (Profile)
- **路径**: `/pages/profile/profile`
- **功能**: 展示用户信息和积分

### 6. 激活码页面 (Activation)
- **路径**: `/pages/activation/activation`
- **功能**: 提供激活码领取功能

## 数据结构

### 分类数据 (categories.js)
```javascript
{
  id: 1,                  // 分类ID
  name: "MySQL",          // 分类名称
  key: "mysql",           // 分类唯一标识
  description: "MySQL数据库相关面试题", // 分类描述
  questionCount: 52,      // 题目数量
  icon: "/images/list/mysql.png", // 分类图标
  order: 1                // 排序字段，数字越小排序越靠前
}
```

### 题目数据 (questions.js)
```javascript
{
  id: 1,                  // 题目ID
  categoryId: "mysql",    // 所属分类
  title: "MySQL索引原理", // 题目标题
  difficulty: "中等",     // 难度级别（简单/中等/困难）
  viewCount: 1520,        // 浏览次数
  description: "请详细说明MySQL中索引的工作原理...", // 题目描述
  code: "",               // 代码示例
  md: "# MySQL索引原理\n\n## 索引的工作原理...", // Markdown格式内容
  tags: ["索引", "优化", "B+树"] // 标签
}
```

### 积分数据 (points.js)
```javascript
// 积分系统相关功能和数据结构
```

## 全局状态管理

应用通过全局App实例管理共享状态：

```javascript
App({
  globalData: {
    userInfo: null,
    showBanner: true // 控制横幅显示
  },
  // ...其他全局方法
})
```

## 自定义组件

### 横幅组件 (Banner)
- **路径**: `/components/banner/banner`
- **功能**: 在页面顶部显示通知横幅
- **属性**:
  - `text`: 横幅文本
  - `duration`: 显示时长
- **事件**:
  - `bindclose`: 关闭横幅事件

## 版本历史

### v1.1.1 (2025-03-12)
1. 添加分类排序功能，通过order字段控制首页分类列表的显示顺序
2. 优化README文档，完善项目说明

### v1.1.0
1. 支持 Markdown 渲染，解题思路模块使用 Markdown 转 HTML 渲染(基于towxml组件)
2. 新增 MySQL 和 Redis 部分题目
3. 删除解题思路模块文本、图片隔离渲染

### v1.0.9
1. 列表图标更新
2. 新增详情页 tag 标签展示
3. 新增详情页分享
4. 新增阅读积分（存储到用户微信本地）

### v1.0.12
1. 新增激活码页面

### v1.0.11
1. 新增首页 Home
2. 新增编程鸭 logo

### v1.0.17
1. 页面横幅（仅在首页显示）
2. 优化分类页面和详情页面布局
3. 使用有意义的字符串作为分类ID，提高代码可读性

## 详细更新日志

### 2025-03-13
- **功能优化**: 将分享功能移至个人中心页面底部，优化用户体验
- **UI改进**: 简化分享按钮设计，移除图标，保留纯文本样式
- **积分系统**: 改进分享积分机制，每天前5次分享均可获得6积分
- **交互优化**: 添加分享次数提示，增强用户参与感

### 2025-03-12
- **功能增强**: 实现分类排序功能，通过order字段优化展示顺序
- **文档完善**: 重构README文档，添加详细项目说明和结构
- **数据优化**: 更新分类数据结构，提高代码可读性
- **系统改进**: 建立更新日志记录系统，便于追踪项目演进

### 2025-03-11
- **内容优化**: 完善项目说明文档，提升专业性
- **数据改进**: 优化分类描述内容，增强用户理解度
- **Bug修复**: 解决首页分类展示顺序问题

### 2025-03-08
- **功能优化**: 改进横幅显示逻辑，提升用户体验
- **Bug修复**: 解决多处样式兼容性问题

### 2025-03-07
- **组件开发**: 添加自定义组件，增强UI复用性
- **UI优化**: 改进页面整体布局，提升视觉体验

### 2025-03-02
- **核心功能**: 集成Towxml组件，支持Markdown渲染
- **功能扩展**: 新增激活码页面和Home主页
- **品牌建设**: 设计并添加编程鸭logo

### 2025-02-27
- **核心功能**: 实现积分系统，增强用户激励机制
- **页面开发**: 完成个人中心页面，展示用户信息和积分

### 2025-02-26
- **项目初始化**: 搭建基础框架和目录结构
- **核心开发**: 实现数据管理模块和基本页面结构

## 安装和使用

1. 克隆代码库到本地
   ```bash
   git clone https://github.com/yourusername/codeya.git
   ```

2. 使用微信开发者工具打开项目

3. 在微信开发者工具中预览和调试

4. 发布到微信小程序平台

## 开发指南

### 添加新分类
1. 在 `data/categories.js` 中添加新的分类对象
2. 准备对应的分类图标，放置在 `images/list/` 目录下
3. 设置合适的 `order` 值控制显示顺序

### 添加新题目
1. 在 `data/questions.js` 中添加新的题目对象
2. 确保 `categoryId` 字段与已有分类的 `key` 值匹配
3. 使用Markdown格式编写题目内容和解析

### 自定义组件开发
1. 在 `components` 目录下创建新的组件目录
2. 按照微信小程序组件规范编写组件代码
3. 在需要使用的页面中引入并使用组件

## 性能优化建议

1. 大型数据集考虑分页加载
2. 图片资源优化压缩
3. 使用微信云开发存储大量数据
4. 实现数据缓存机制减少重复请求

## 贡献指南

欢迎提交 Issue 或 Pull Request 来帮助改进这个项目。贡献时请遵循以下步骤：

1. Fork 项目仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 微信公众号：编程鸭
- 邮箱： 731444260@qq.com

---

© 2025 编程鸭 - 让编程学习更简单





