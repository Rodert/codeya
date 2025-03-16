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
    const lastShowDate = wx.getStorageSync('lastBannerShowDate');
    
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
      wx.setStorageSync('lastBannerShowDate', today);
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
    const lastQuestionCompleted = wx.getStorageSync('lastQuestionCompleted'); // 是否完成了每日一题
    
    // 如果从未显示过，或者不是今天显示的，或者今天显示了但没完成，则显示每日一题
    if (!lastQuestionDate || lastQuestionDate !== today || (lastQuestionDate === today && !lastQuestionCompleted)) {
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
        // 记录最后显示日期
        wx.setStorageSync('lastDailyQuestionDate', today);
        
        if (res.confirm) {
          // 用户点击了立即学习，记录完成状态
          wx.setStorageSync('lastQuestionCompleted', true);
          // 跳转到题目详情页
          wx.navigateTo({
            url: '/pages/detail/detail?categoryKey=' + question.categoryKey + '&questionId=' + question.id
          });
        } else {
          // 用户点击了稍后再说，清除完成状态
          wx.setStorageSync('lastQuestionCompleted', false);
        }
      }
    });
  },

  // ==================== 鸭鸭冒险游戏相关函数 ====================

  // 开始鸭鸭冒险游戏
  startDuckGame: function() {
    // 先重新加载最新的积分数据
    const latestPoints = db.getTotalPoints();
    this.setData({
      totalPoints: latestPoints
    });
    
    // 检查积分是否足够
    if (latestPoints < 5) {
      wx.showToast({
        title: '积分不足，无法开始游戏',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 显示游戏弹窗
    this.setData({
      showGamePopup: true,
      gameStarted: false,
      gameOver: false,
      gameScore: 0,
      gameTime: 0
    });

    // 初始化游戏画布
    this.initGameCanvas();
  },

  // 初始化游戏画布
  initGameCanvas: function() {
    const query = wx.createSelectorQuery();
    query.select('.game-canvas').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        
        // 设置画布尺寸
        this.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          duckPosition: {
            x: canvasWidth / 2,
            y: canvasHeight - 100
          }
        });
        
        // 绘制初始画面
        this.drawGameScene();
      }
    });
  },

  // 开始游戏
  startGame: function() {
    // 先重新加载最新的积分数据
    const latestPoints = db.getTotalPoints();
    
    // 检查积分是否足够
    if (latestPoints < 5) {
      wx.showToast({
        title: '积分不足，无法开始游戏',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 扣除积分
    const newPoints = latestPoints - 5;
    
    // 更新数据库中的积分
    db.updateTotalPoints(newPoints);
    
    this.setData({
      totalPoints: newPoints,
      gameStarted: true,
      gameOver: false,
      gameScore: 0,
      gameTime: 0,
      gameObjects: []
    });
    
    // 开始游戏循环
    this.startGameLoop();
    
    // 开始生成障碍物和金币
    this.startObstacleGeneration();
    this.startCoinGeneration();
  },

  // 开始游戏循环
  startGameLoop: function() {
    // 清除之前的计时器
    if (this.data.gameTimer) clearInterval(this.data.gameTimer);
    if (this.data.animationTimer) clearInterval(this.data.animationTimer);
    
    // 设置游戏计时器（每秒更新一次时间）
    const gameTimer = setInterval(() => {
      const newTime = this.data.gameTime + 1;
      this.setData({
        gameTime: newTime
      });
    }, 1000);
    
    // 设置动画计时器（每帧更新一次游戏状态和画面）
    const animationTimer = setInterval(() => {
      this.updateGameState();
      this.drawGameScene();
    }, 16); // 约60fps
    
    this.setData({
      gameTimer: gameTimer,
      animationTimer: animationTimer
    });
  },

  // 开始生成障碍物
  startObstacleGeneration: function() {
    // 清除之前的计时器
    if (this.data.obstacleTimer) clearInterval(this.data.obstacleTimer);
    
    // 设置障碍物生成计时器（每2-4秒生成一个障碍物）
    const obstacleTimer = setInterval(() => {
      if (!this.data.gameStarted || this.data.gameOver) return;
      
      const canvasWidth = this.data.canvasWidth;
      const newObstacle = {
        type: 'obstacle',
        x: Math.random() * (canvasWidth - 40),
        y: -50,
        width: 40,
        height: 40,
        speed: 3 + Math.random() * 2
      };
      
      const gameObjects = [...this.data.gameObjects, newObstacle];
      this.setData({
        gameObjects: gameObjects
      });
    }, 2000 + Math.random() * 2000);
    
    this.setData({
      obstacleTimer: obstacleTimer
    });
  },

  // 开始生成金币
  startCoinGeneration: function() {
    // 清除之前的计时器
    if (this.data.coinTimer) clearInterval(this.data.coinTimer);
    
    // 设置金币生成计时器（每1-3秒生成一个金币）
    const coinTimer = setInterval(() => {
      if (!this.data.gameStarted || this.data.gameOver) return;
      
      const canvasWidth = this.data.canvasWidth;
      const newCoin = {
        type: 'coin',
        x: Math.random() * (canvasWidth - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2 + Math.random() * 1.5
      };
      
      const gameObjects = [...this.data.gameObjects, newCoin];
      this.setData({
        gameObjects: gameObjects
      });
    }, 1000 + Math.random() * 2000);
    
    this.setData({
      coinTimer: coinTimer
    });
  },

  // 更新游戏状态
  updateGameState: function() {
    if (!this.data.gameStarted || this.data.gameOver) return;
    
    const canvasHeight = this.data.canvasHeight;
    const duckPosition = this.data.duckPosition;
    let gameObjects = [...this.data.gameObjects];
    let gameScore = this.data.gameScore;
    
    // 更新游戏对象位置
    gameObjects = gameObjects.filter(obj => {
      // 移动对象
      obj.y += obj.speed;
      
      // 检查是否超出屏幕底部
      if (obj.y > canvasHeight) {
        return false;
      }
      
      // 检查是否与鸭鸭碰撞
      if (this.checkCollision(obj, duckPosition)) {
        if (obj.type === 'obstacle') {
          // 碰到障碍物，游戏结束
          this.endGame();
          return false;
        } else if (obj.type === 'coin') {
          // 碰到金币，加分
          gameScore += 10;
          return false;
        }
      }
      
      return true;
    });
    
    this.setData({
      gameObjects: gameObjects,
      gameScore: gameScore
    });
  },

  // 检查碰撞
  checkCollision: function(obj, duckPos) {
    // 简单的矩形碰撞检测
    const duckWidth = 50;
    const duckHeight = 50;
    
    return (
      duckPos.x < obj.x + obj.width &&
      duckPos.x + duckWidth > obj.x &&
      duckPos.y < obj.y + obj.height &&
      duckPos.y + duckHeight > obj.y
    );
  },

  // 绘制游戏场景
  drawGameScene: function() {
    const ctx = wx.createCanvasContext('gameCanvas');
    
    // 清空画布
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 绘制背景
    ctx.setFillStyle('#f0f9ff');
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 如果游戏未开始，显示提示文字
    if (!this.data.gameStarted && !this.data.gameOver) {
      ctx.setFillStyle('#2196f3');
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText('点击"开始游戏"按钮开始', this.data.canvasWidth / 2, this.data.canvasHeight / 2);
      ctx.draw();
      return;
    }
    
    // 绘制游戏对象
    this.data.gameObjects.forEach(obj => {
      if (obj.type === 'obstacle') {
        // 绘制障碍物（红色方块）
        ctx.setFillStyle('#f44336');
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      } else if (obj.type === 'coin') {
        // 绘制金币（黄色圆形）
        ctx.setFillStyle('#ffc107');
        ctx.beginPath();
        ctx.arc(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // 绘制鸭鸭（蓝色圆形）
    ctx.setFillStyle('#2196f3');
    ctx.beginPath();
    ctx.arc(this.data.duckPosition.x, this.data.duckPosition.y, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // 绘制鸭鸭眼睛
    ctx.setFillStyle('white');
    ctx.beginPath();
    ctx.arc(this.data.duckPosition.x - 8, this.data.duckPosition.y - 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.data.duckPosition.x + 8, this.data.duckPosition.y - 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // 绘制鸭鸭嘴巴
    ctx.setFillStyle('#ff9800');
    ctx.beginPath();
    ctx.moveTo(this.data.duckPosition.x - 10, this.data.duckPosition.y + 5);
    ctx.lineTo(this.data.duckPosition.x + 10, this.data.duckPosition.y + 5);
    ctx.lineTo(this.data.duckPosition.x, this.data.duckPosition.y + 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.draw();
  },

  // 触摸开始事件
  onTouchStart: function(e) {
    if (!this.data.gameStarted || this.data.gameOver) return;
    
    const touch = e.touches[0];
    this.setData({
      duckPosition: {
        x: touch.x,
        y: this.data.duckPosition.y
      }
    });
  },

  // 触摸移动事件
  onTouchMove: function(e) {
    if (!this.data.gameStarted || this.data.gameOver) return;
    
    const touch = e.touches[0];
    this.setData({
      duckPosition: {
        x: touch.x,
        y: this.data.duckPosition.y
      }
    });
  },

  // 触摸结束事件
  onTouchEnd: function(e) {
    // 可以添加一些触摸结束的逻辑
  },

  // 结束游戏
  endGame: function() {
    this.setData({
      gameOver: true
    });
    
    // 清除所有计时器
    if (this.data.gameTimer) clearInterval(this.data.gameTimer);
    if (this.data.animationTimer) clearInterval(this.data.animationTimer);
    if (this.data.obstacleTimer) clearInterval(this.data.obstacleTimer);
    if (this.data.coinTimer) clearInterval(this.data.coinTimer);
    
    // 根据得分和时间计算奖励积分
    const bonusPoints = Math.floor(this.data.gameScore / 10) + Math.floor(this.data.gameTime / 5);
    
    // 更新用户积分
    if (bonusPoints > 0) {
      // 先获取最新的积分
      const currentPoints = db.getTotalPoints();
      const newPoints = currentPoints + bonusPoints;
      
      // 更新数据库中的积分
      db.updateTotalPoints(newPoints);
      
      // 更新显示
      this.setData({
        totalPoints: newPoints
      });
      
      // 显示奖励提示
      wx.showToast({
        title: `获得${bonusPoints}积分奖励！`,
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 重新开始游戏
  restartGame: function() {
    // 先重新加载最新的积分数据
    const latestPoints = db.getTotalPoints();
    this.setData({
      totalPoints: latestPoints
    });
    
    // 检查积分是否足够
    if (latestPoints < 5) {
      wx.showToast({
        title: '积分不足，无法重新开始',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 重置游戏状态
    this.setData({
      gameStarted: false,
      gameOver: false,
      gameScore: 0,
      gameTime: 0,
      gameObjects: []
    });
    
    // 重新绘制初始画面
    this.drawGameScene();
    
    // 开始新游戏
    this.startGame();
  },

  // 关闭游戏弹窗
  closeGamePopup: function() {
    // 清除所有计时器
    if (this.data.gameTimer) clearInterval(this.data.gameTimer);
    if (this.data.animationTimer) clearInterval(this.data.animationTimer);
    if (this.data.obstacleTimer) clearInterval(this.data.obstacleTimer);
    if (this.data.coinTimer) clearInterval(this.data.coinTimer);
    
    // 重新加载最新的积分数据
    const latestPoints = db.getTotalPoints();
    
    this.setData({
      showGamePopup: false,
      totalPoints: latestPoints
    });
  }
});
