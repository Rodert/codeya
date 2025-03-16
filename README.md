<!--
 * @Author: JavaPub
 * @Date: 2025-02-26 11:52:01
 * @LastEditors: your name
 * @LastEditTime: 2025-03-14 16:31:26
 * @Description: Here is the JavaPub code base. Search JavaPub on the whole web.
 * @FilePath: /codeya/README.md
-->
# 编程鸭 (CodeYa)

<div align="center">
  <img src="/images/logo/codeya_logo3.jpg" alt="编程鸭 Logo" width="120">
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
- **鸭鸭冒险**：首页底部的随机刷题功能，增加学习趣味性
- **成长系统**：鸭鸭随着用户学习进度成长，提供等级和成就系统
- **皮肤系统**：通过提升等级解锁不同的鸭鸭形象，增加用户粘性
- **广告奖励**：通过观看广告获得成长值加速、皮肤解锁加速和精选题目
- **精选题库**：高质量精选题目，通过广告解锁，提供更深入的学习内容
- **游戏中心**：提供多种休闲小游戏，让学习过程更加轻松有趣
- **鸭屎奖励系统**：游戏获胜后获得"鸭屎"作为奖励，增添幽默元素

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
│   ├── duckPoop.js       # 鸭屎数据
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
│   ├── activation/       # 激活码页面
│   ├── games/            # 游戏列表页面
│   ├── emoji-match/      # 表情消消乐游戏
│   └── duck-adventure/   # 鸭鸭冒险游戏
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
  - 游戏入口区域，提供休闲游戏

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

### 7. 游戏列表页面 (Games)
- **路径**: `/pages/games/games`
- **功能**: 展示所有可玩的小游戏
- **特点**:
  - 显示游戏消耗的积分
  - 显示游戏奖励（鸭屎）
  - 显示用户当前积分和鸭屎数量

### 8. 表情消消乐游戏 (Emoji Match)
- **路径**: `/pages/emoji-match/emoji-match`
- **功能**: 匹配相同表情的消除游戏
- **特点**:
  - 多个难度关卡
  - 消耗积分开始游戏
  - 获得鸭屎作为奖励

### 9. 鸭鸭冒险游戏 (Duck Adventure)
- **路径**: `/pages/duck-adventure/duck-adventure`
- **功能**: 控制小鸭子躲避障碍物的游戏
- **特点**:
  - 消耗积分开始游戏
  - 获得鸭屎作为奖励
  - 坚持时间越长，奖励越多

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

### 鸭屎数据 (duckPoop.js)
```javascript
// 鸭屎奖励系统相关功能和数据结构
let duckPoopData = {
  totalPoop: 0,           // 总鸭屎数量
  gamePoop: {}            // 游戏获得的鸭屎记录
};
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

## 游戏奖励系统：鸭屎收集

### 概述

在编程鸭小程序中，我们实现了一个独特的游戏奖励系统。玩家在游戏中获胜后，不再获得积分，而是获得"鸭屎"作为奖励。这个有趣的设计为游戏增添了幽默元素，同时保持了游戏的基本机制不变。

### 游戏与鸭屎

小程序中包含多个小游戏，每个游戏都有自己的鸭屎奖励机制：

1. **鸭鸭冒险**
   - 消耗5积分开始游戏
   - 控制小鸭子躲避障碍物，收集金币
   - 奖励计算：游戏得分/10 + 游戏时间/5
   - 坚持时间越长，获得的鸭屎越多

2. **表情消消乐**
   - 包含5个难度递增的关卡
   - 消耗2-4积分开始游戏（根据关卡难度）
   - 匹配相同的表情，消除所有方块
   - 基础奖励：4-8坨鸭屎（根据关卡）
   - 额外奖励：
     - 时间奖励：每剩余10秒额外奖励1坨，最多2坨
     - 步数奖励：如果步数少于总格子数的一半，额外奖励2坨
     - 最后一关额外奖励：3坨

3. **记忆翻牌**（开发中）
   - 消耗3积分开始游戏
   - 考验记忆力，找出所有配对的卡片
   - 将同样提供鸭屎奖励

### 技术实现

鸭屎奖励系统的实现包括以下组件：

1. **数据管理**
   - `data/duckPoop.js`：管理鸭屎数量的模块
   - 使用本地存储保存鸭屎数据
   - 提供API获取和更新鸭屎数量

2. **数据库接口**
   - `data/db.js`中添加了鸭屎相关的函数
   - `getTotalDuckPoop`：获取用户总鸭屎数量
   - `addDuckPoop`：添加鸭屎奖励
   - `updateTotalDuckPoop`：直接更新鸭屎数量

3. **UI展示**
   - 在游戏界面和游戏列表页面显示鸭屎数量
   - 使用💩表情符号表示鸭屎
   - 棕色渐变背景显示鸭屎计数器

### 游戏经济系统

- **消费**：玩家使用积分来玩游戏
- **奖励**：玩家通过游戏获得鸭屎
- **积分获取**：通过学习编程题目和分享小程序获得积分
- **鸭屎用途**：目前仅作为收集物品，未来可能添加鸭屎商店或其他功能

## 版本历史

### v1.2.0 (2025年3月20日)
1. 新增游戏中心，提供多种休闲小游戏
2. 实现鸭屎奖励系统，游戏获胜后获得鸭屎作为奖励
3. 添加表情消消乐游戏，支持多个难度关卡
4. 优化鸭鸭冒险游戏，移至独立页面
5. 改进UI交互体验，增加游戏相关动画效果

### v1.1.2 (2025年3月16日)
1. 新增广告奖励系统，用户可通过观看广告获得多种奖励
2. 新增精选题目功能，通过广告解锁高质量题目
3. 优化鸭鸭冒险功能，增加皮肤解锁加速选项
4. 改进UI交互体验，增加动画效果

### v1.1.1 (2025-03-12)
1. 添加分类排序功能，通过order字段控制首页分类列表的显示顺序
2. 优化README文档，完善项目说明
3. 优化每日一题功能，每天只弹出一次
4. 新增"鸭鸭冒险"随机刷题功能，增加学习趣味性

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

### 2025年3月20日
1. **游戏中心**：
   - 新增游戏列表页面，展示所有可玩的小游戏
   - 实现游戏积分消耗和奖励机制
   - 优化游戏UI设计，提供统一的游戏风格

2. **鸭屎奖励系统**：
   - 实现鸭屎数据管理模块，用于存储和更新鸭屎数量
   - 在游戏界面和游戏列表页面显示鸭屎数量
   - 设计鸭屎奖励算法，根据游戏表现计算奖励

3. **表情消消乐游戏**：
   - 实现多个难度关卡，支持关卡解锁机制
   - 设计匹配消除玩法，提供丰富的表情素材
   - 优化游戏界面，增加动画效果
   - 修复游戏介绍界面中的奖励描述，将"积分"改为"坨鸭屎"，确保与鸭屎奖励系统一致

4. **鸭鸭冒险游戏优化**：
   - 将鸭鸭冒险游戏移至独立页面
   - 改进游戏机制，增加障碍物和金币收集
   - 优化游戏控制，提供更流畅的游戏体验

### 2025年3月16日
1. **广告奖励系统**：
   - 新增广告奖励选项弹窗，提供三种奖励选择
   - 实现成长值加速功能，通过广告获得额外成长值
   - 实现皮肤解锁加速功能，加快皮肤解锁进度
   - 实现精选题目解锁功能，获取高质量学习内容
   - 优化广告体验，确保用户获得有价值的回报

2. **精选题目功能**：
   - 新增精选题目展示区域，突出显示高质量题目
   - 实现精选题目的存储和管理
   - 优化题目展示效果，增加视觉吸引力

3. **UI交互优化**：
   - 新增多处动画效果，提升用户体验
   - 优化按钮样式和交互反馈
   - 改进弹窗设计，增强视觉层次感

### 2025-03-14
- **功能优化**: 优化每日一题功能，确保每天只弹出一次，提升用户体验
- **UI改进**: 简化分享按钮设计，移除图标，保留纯文本样式
- **积分系统**: 改进分享积分机制，每天前5次分享均可获得6积分
- **交互优化**: 添加分享次数提示，增强用户参与感
- **新增功能**: 添加"鸭鸭冒险"随机刷题功能，让用户可以随机探索题库，增加学习趣味性
- **游戏化设计**: 为鸭鸭冒险添加成长系统和成就系统，提高用户参与度和学习动力
- **皮肤系统**: 添加鸭鸭皮肤系统，通过提升等级解锁不同的鸭鸭形象

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

## 未来计划

1. 添加鸭屎商店，让玩家使用鸭屎购买游戏道具或装饰品
2. 实现鸭屎排行榜，展示收集鸭屎最多的玩家
3. 为不同游戏添加特殊的鸭屎类型
4. 开发更多使用鸭屎的小游戏
5. 增加更多编程语言和技术栈的题目
6. 优化用户界面，提供更好的学习体验
7. 添加社区功能，让用户可以讨论题目和分享解题思路

---

*注：鸭屎仅为游戏内虚拟物品，并无实际意义。这个设计纯粹是为了增加游戏的趣味性和幽默感。*

© 2025 编程鸭 - 让编程学习更简单

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





