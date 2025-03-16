const db = require('../../data/db.js');

// 励志语录数组
const motivationalQuotes = [
  "编程改变世界，学习改变人生",
  "每天进步一点点，离梦想就近一点点",
  "代码写出来是给人看的，附带能在机器上运行",
  "不要害怕困难，代码的每一行都是你的成长",
  "程序员的成长是一个持续迭代的过程",
  "没有解决不了的bug，只有不够努力的程序员",
  "学习编程最好的时机是十年前，其次是现在",
  "写代码要像写诗一样优雅，像写散文一样流畅",
  "程序员的进步在于每天写的代码都比昨天好一点",
  "你的指尖有改变世界的力量"
];

// 获取今天的励志语录
function getTodayQuote() {
  const today = new Date().toDateString();
  const lastQuoteDate = wx.getStorageSync('lastQuoteDate');
  const lastQuoteIndex = wx.getStorageSync('lastQuoteIndex');
  
  if (!lastQuoteDate || lastQuoteDate !== today) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (newIndex === lastQuoteIndex);
    
    wx.setStorageSync('lastQuoteDate', today);
    wx.setStorageSync('lastQuoteIndex', newIndex);
    return motivationalQuotes[newIndex];
  }
  
  return motivationalQuotes[lastQuoteIndex];
}

Page({
  data: {
    banners: [
      {
        id: 1,
        imageUrl: '/images/banner1.png'
      },
      {
        id: 2,
        imageUrl: '/images/banner2.png'
      }
    ],
    categories: [],
    expandedCategoryKey: null,
    categoryQuestions: [],
    showBanner: false, // 默认不显示横幅
    totalPoints: 0, // 用户总积分
    dailyQuestion: null, // 每日一题数据
    bannerText: '', // 横幅文本
    premiumQuestions: [], // 高级题目列表
    premiumUnlocked: false, // 是否解锁高级题目
    
    // 鸭鸭冒险游戏相关数据
    showGamePopup: false, // 是否显示游戏弹窗
    gameStarted: false, // 游戏是否已开始
    gameOver: false, // 游戏是否结束
    gameScore: 0, // 游戏得分
    gameTime: 0, // 游戏时间（秒）
    gameObjects: [], // 游戏对象（障碍物、金币等）
    duckPosition: { x: 0, y: 0 }, // 鸭鸭位置
    canvasWidth: 0, // 画布宽度
    canvasHeight: 0, // 画布高度
    gameTimer: null, // 游戏计时器
    animationTimer: null, // 动画计时器
    obstacleTimer: null, // 障碍物生成计时器
    coinTimer: null, // 金币生成计时器
  },

  onLoad: function() {
    this.loadCategories();
    this.loadUserPoints();
    
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  onShow: function() {
    // 检查是否需要显示横幅
    this.checkBannerDisplay();
    
    // 检查是否需要显示每日一题
    this.checkDailyQuestion();
    
    // 刷新积分数据
    this.loadUserPoints();
  },

  // 检查是否需要显示横幅
  checkBannerDisplay: function() {
    const today = new Date().toDateString(); // 获取当前日期（不含时间）
    let lastShowDate = null;
    
    try {
      lastShowDate = wx.getStorageSync('lastBannerShowDate');
    } catch (e) {
      console.error('Failed to get lastBannerShowDate:', e);
      // 如果获取失败，默认显示横幅
      lastShowDate = null;
    }
    
    // 如果从未显示过或者不是今天显示的，则显示横幅
    if (!lastShowDate || lastShowDate !== today) {
      // 更新全局变量
      const app = getApp();
      app.globalData.showBanner = true;
      
      // 获取今天的励志语录
      const todayQuote = getTodayQuote();
      
      this.setData({
        showBanner: true,
        bannerText: todayQuote
      });
      
      // 如果横幅显示，设置10秒后自动关闭
      setTimeout(() => {
        this.closeBanner();
      }, 10000); // 10秒后自动关闭
      
      // 记录显示日期
      try {
        wx.setStorageSync('lastBannerShowDate', today);
      } catch (e) {
        console.error('Failed to save lastBannerShowDate:', e);
        // 尝试使用异步方法保存
        wx.setStorage({
          key: 'lastBannerShowDate',
          data: today,
          fail: (err) => {
            console.error('Async storage also failed:', err);
          }
        });
      }
    } else {
      // 如果今天已经显示过，则不显示
      const app = getApp();
      app.globalData.showBanner = false;
      
      this.setData({
        showBanner: false
      });
    }
  },
  
  // 关闭横幅的统一处理函数
  closeBanner: function() {
    // 更新全局变量
    const app = getApp();
    app.globalData.showBanner = false;
    
    this.setData({
      showBanner: false
    });
  },
  
  // 处理横幅关闭事件
  onBannerClose: function() {
    this.closeBanner();
  },
  
  // 加载用户积分
  loadUserPoints: function() {
    const totalPoints = db.getTotalPoints();
    this.setData({
      totalPoints: totalPoints
    });
  },

  // 分享到微信好友
  onShareAppMessage: function() {
    return {
      title: '编程鸭 - 让编程学习更简单',
      path: '/pages/home/home',
      imageUrl: '/images/share_cover.png'
    };
  },
  
  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: '编程鸭 - 让编程学习更简单',
      query: '',
      imageUrl: '/images/share_cover.png'
    };
  },
  
  // 点击分享按钮
  onShareTap: function() {
    // 这里只记录用户点击了分享按钮
    // 实际的积分添加在用户成功分享后处理
    console.log('用户点击了分享按钮');
    
    // 由于微信小程序限制，无法直接获知用户是否成功分享
    // 所以我们假设用户点击分享按钮后就成功分享了
    setTimeout(() => {
      const result = db.addSharePoints();
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success',
          duration: 2000
        });
        
        // 刷新积分显示
        this.loadUserPoints();
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration: 2000
        });
      }
    }, 1500); // 延迟1.5秒，模拟用户分享完成的时间
  },

  loadCategories: function() {
    const categories = db.getCategories();
    console.log('Loading categories:', categories);
    
    // 根据order字段排序（升序）
    const sortedCategories = [...categories].sort((a, b) => {
      // 如果有order字段，按order排序
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // 如果没有order字段，保持原顺序
      return 0;
    });
    
    this.setData({
      categories: sortedCategories
    });
  },

  expandCategory: function(e) {
    const categoryKey = e.currentTarget.dataset.key;
    
    // 如果点击的是当前展开的类别，则收起
    if (this.data.expandedCategoryKey === categoryKey) {
      this.setData({
        expandedCategoryKey: null,
        categoryQuestions: []
      });
      return;
    }

    // 否则展开新的类别
    const categories = this.data.categories;
    let category = null;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].key === categoryKey) {
        category = categories[i];
        break;
      }
    }

    if (category) {
      const questions = db.getQuestionsByCategory(category.key);
      // 为每个问题添加categoryKey
      const questionsWithCategory = questions.map(function(q) {
        return {
          id: q.id,
          categoryId: q.categoryId,
          title: q.title,
          difficulty: q.difficulty,
          viewCount: q.viewCount,
          description: q.description,
          answer: q.answer,
          code: q.code,
          tags: q.tags,
          categoryKey: category.key
        };
      });
      
      this.setData({
        expandedCategoryKey: categoryKey,
        categoryQuestions: questionsWithCategory
      });
    }
  },

  goToCategory: function(e) {
    const categoryKey = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/category/category?key=' + categoryKey
    });
  },

  goToDetail: function(e) {
    const categoryKey = e.currentTarget.dataset.categoryKey;
    const questionId = e.currentTarget.dataset.questionId;
    wx.navigateTo({
      url: '/pages/detail/detail?categoryKey=' + categoryKey + '&questionId=' + questionId
    });
  },

  // 检查是否需要显示每日一题
  checkDailyQuestion: function() {
    const today = new Date().toDateString();
    const lastQuestionDate = wx.getStorageSync('lastDailyQuestionDate');
    
    // 只有从未显示过，或者不是今天显示的，才显示每日一题
    if (!lastQuestionDate || lastQuestionDate !== today) {
      this.showDailyQuestion();
    }
  },

  // 获取随机题目
  getRandomQuestion: function() {
    const categories = this.data.categories;
    if (!categories || categories.length === 0) return null;

    // 随机选择一个分类
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const questions = db.getQuestionsByCategory(randomCategory.key);
    
    if (!questions || questions.length === 0) return null;

    // 随机选择一道题目
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return {
      ...randomQuestion,
      categoryKey: randomCategory.key,
      categoryName: randomCategory.name
    };
  },

  // 显示每日一题弹窗
  showDailyQuestion: function() {
    const question = this.getRandomQuestion();
    if (!question) return;

    this.setData({ dailyQuestion: question });

    const today = new Date().toDateString();
    wx.showModal({
      title: '每日一题',
      content: `[${question.categoryName}] ${question.title}\n\n难度：${question.difficulty}`,
      confirmText: '立即学习',
      cancelText: '稍后再说',
      success: (res) => {
        // 记录最后显示日期，无论用户选择什么，都标记为今天已经显示过
        wx.setStorageSync('lastDailyQuestionDate', today);
        
        if (res.confirm) {
          // 用户点击了立即学习
          wx.navigateTo({
            url: '/pages/detail/detail?categoryKey=' + question.categoryKey + '&questionId=' + question.id
          });
        }
      }
    });
  },

  // 导航到问题详情
  navigateToQuestion: function(e) {
    const id = e.currentTarget.dataset.id;
    // 查找问题所属的类别
    let categoryKey = '';
    let questionId = '';
    
    for (const key in this.data.questions) {
      const found = this.data.questions[key].find(q => q.id === id);
      if (found) {
        categoryKey = key;
        questionId = found.id;
        break;
      }
    }
    
    if (categoryKey && questionId) {
      wx.navigateTo({
        url: `/pages/detail/detail?categoryKey=${categoryKey}&questionId=${questionId}`
      });
    }
  },
  
  // 导航到游戏列表页面
  navigateToGames: function() {
    wx.navigateTo({
      url: '/pages/games/games'
    });
  },

  // ==================== 广告相关函数 ====================

  // 显示广告奖励选项
  showAdRewardOptions: function() {
    // ... existing code ...
  },
});
