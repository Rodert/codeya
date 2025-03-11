<!--
 * @Author: JavaPub
 * @Date: 2025-02-26 11:52:01
 * @LastEditors: your name
 * @LastEditTime: 2025-03-11 16:25:55
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

- **分类题库**：按技术领域（MySQL、Java、Redis等）分类整理的题库
- **详细解析**：每道题目都有详细的解题思路和代码实现
- **难度标识**：题目按简单、中等、困难三个难度级别分类
- **积分系统**：学习题目可获取积分，激励持续学习
- **Markdown渲染**：支持Markdown格式的内容渲染
- **分享功能**：支持分享题目给好友或朋友圈
- **标签系统**：通过标签快速找到相关题目

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
├── pages/                # 页面文件
│   ├── index/            # 首页
│   ├── category/         # 分类详情页
│   ├── detail/           # 题目详情页
│   ├── profile/          # 个人中心
│   ├── home/             # 主页
│   └── activation/       # 激活码页面
├── towxml/               # Markdown渲染组件
├── utils/                # 工具函数
├── app.js                # 应用入口
├── app.json              # 应用配置
└── app.wxss              # 应用样式
```

## 安装和使用

1. 克隆代码库到本地
   ```bash
   git clone https://github.com/yourusername/codeya.git
   ```

2. 使用微信开发者工具打开项目

3. 在微信开发者工具中预览和调试

4. 发布到微信小程序平台

## 数据结构

### 分类数据 (categories.js)
```javascript
{
  id: 1,
  name: "MySQL",
  key: "mysql",
  description: "MySQL数据库相关面试题",
  questionCount: 12,
  icon: "/images/list/mysql.png",
  order: 1  // 排序字段，数字越小排序越靠前
}
```

### 题目数据 (questions.js)
```javascript
{
  id: 1,
  categoryId: "mysql",
  title: "MySQL索引原理",
  difficulty: "中等",
  viewCount: 1520,
  description: "请详细说明MySQL中索引的工作原理...",
  code: "",
  md: "# MySQL索引原理\n\n## 索引的工作原理...",
  tags: ["索引", "优化", "B+树"]
}
```

## 版本历史

### v1.1.1
1. 添加分类排序功能，通过order字段控制首页分类列表的显示顺序

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

## 贡献指南

欢迎提交 Issue 或 Pull Request 来帮助改进这个项目。

## 许可证

[MIT License](LICENSE)

## 联系方式

- 微信公众号：编程鸭
- 邮箱： 731444260@qq.com

---

© 2025 编程鸭 - 让编程学习更简单





