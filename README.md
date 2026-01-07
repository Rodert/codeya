# CodeYa 编程鸭

<div align="center">
  <img src="codeya-miniapp/images/logo/codeya_logo3.jpg" alt="编程鸭 Logo" width="120">
</div>

## 项目简介

编程鸭（CodeYa）是一款专注于编程学习和面试题库的微信小程序，为开发者提供丰富的编程知识和面试题目。通过分类整理的题库，用户可以系统地学习各种编程语言和技术栈的核心知识点，提高编程技能和面试通过率。

## 主要功能

- 📚 **分类题库** - 按技术领域分类整理的题库（MySQL、Java、Redis、Python、GoLang等）
- 💡 **详细解析** - 每道题目都有详细的解题思路和代码实现
- 🎮 **游戏中心** - 提供多种休闲小游戏，让学习过程更加轻松有趣
- 🏆 **积分系统** - 学习题目可获取积分，激励持续学习
- 🎨 **主题切换** - 支持深色/浅色主题模式
- 📱 **Markdown渲染** - 支持Markdown格式的内容渲染

## 系统架构

CodeYa 是一个多端学习系统，包含以下子项目：

- **codeya-miniapp** - 微信小程序端（✅ 已完成）
  - 面向普通用户的学习和刷题平台
  - 提供题库浏览、题目详情、游戏中心等功能
  
- **codeya-frontend** - Web 管理后台（🚧 待开发）
  - 面向管理员的内容管理平台
  - 题库管理、用户管理、数据统计等功能
  
- **codeya-backend** - 后端 API 服务（🚧 待开发）
  - 统一的后端服务，为所有前端提供数据接口
  - 用户认证、题库管理、积分系统等核心业务逻辑
  
- **codeya-h5** - H5 移动端（🚧 待开发）
  - 面向移动浏览器的轻量级学习平台
  - 题目分享、快速刷题等功能

## 项目结构

```
codeya/
├── codeya-miniapp/        # 微信小程序源代码（已完成）
│   ├── pages/             # 页面文件
│   ├── components/        # 自定义组件
│   ├── data/              # 数据文件
│   ├── utils/             # 工具函数
│   └── towxml/            # Markdown渲染组件
├── codeya-frontend/       # Web管理后台（待开发）
├── codeya-backend/        # 后端API服务（待开发）
├── codeya-h5/             # H5移动端（待开发）
└── README.md              # 项目说明（本文件）
```

## 快速开始

1. 克隆项目到本地
   ```bash
   git clone <repository-url>
   cd codeya
   ```

2. 使用微信开发者工具打开 `codeya-miniapp` 目录

3. 在微信开发者工具中预览和调试

4. 发布到微信小程序平台

## 详细文档

更多详细信息请查看 [codeya-miniapp/README.md](./codeya-miniapp/README.md)

## 技术栈

### 小程序端（codeya-miniapp）
- **前端框架**：微信小程序原生框架
- **数据管理**：本地数据存储（后续将迁移至后端API）
- **渲染引擎**：Towxml（Markdown渲染）
- **UI组件**：自定义组件 + 微信原生组件

### 其他端（待开发）
- **Web前端**：待定（React/Vue + UI框架）
- **后端服务**：待定（Spring Boot / Node.js）
- **H5端**：待定（与Web前端共用或独立实现）

## 许可证

[MIT License](LICENSE)

## 授权说明

本项目已申请软件著作权，仅用于学习、研究或公益用途时，如需授权可通过下方联系方式与作者取得联系，可免费获取授权使用。

## 联系方式

- 微信公众号：编程鸭
- 邮箱：731444260@qq.com

---

© 2024 编程鸭 - 让编程学习更简单

