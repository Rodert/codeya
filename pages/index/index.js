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
    duckLevel: 1, // 鸭鸭等级
    duckGrowth: 0, // 鸭鸭成长值
    currentDuckSkin: 'default', // 当前鸭鸭皮肤
    currentDuckSkinIcon: '/images/logo/codeya_logo3.jpg', // 当前鸭鸭皮肤图标
    duckSkins: [
      { id: 'default', name: '普通鸭', unlocked: true, icon: '/images/logo/codeya_logo3.jpg' },
      { id: 'graduate', name: '学士鸭', unlocked: false, icon: '/images/duck/graduate.png', unlockLevel: 3 },
      { id: 'programmer', name: '程序鸭', unlocked: false, icon: '/images/duck/programmer.png', unlockLevel: 5 },
      { id: 'superhero', name: '超能鸭', unlocked: false, icon: '/images/duck/superhero.png', unlockLevel: 10 }
    ],
    adRewardedToday: false, // 今天是否已经通过广告获得奖励
    adVideoLoaded: false, // 广告是否加载完成
    premiumQuestions: [], // 高级题目列表
    premiumUnlocked: false, // 是否解锁高级题目
    showAdOptions: false,
    selectedReward: null
  },

  onLoad: function() {
    this.loadCategories();
    this.loadUserPoints();
    this.loadDuckGrowthData();
    this.loadDuckSkins();
    this.initRewardedVideoAd(); // 初始化激励视频广告
    this.checkAdRewardStatus(); // 检查广告奖励状态
    this.initAdVideo();
    
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

  // 初始化激励视频广告
  initRewardedVideoAd: function() {
    // 检查是否支持激励视频广告
    if (wx.createRewardedVideoAd) {
      // 创建激励视频广告实例
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-3bcf13ec62b2b6f3' // 替换为您的广告单元ID
      });
      
      // 监听加载事件
      this.videoAd.onLoad(() => {
        console.log('激励视频广告加载成功');
        this.setData({ adVideoLoaded: true });
      });
      
      // 监听错误事件
      this.videoAd.onError((err) => {
        console.log('激励视频广告加载失败', err);
        this.setData({ adVideoLoaded: false });
      });
      
      // 监听关闭事件
      this.videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.handleAdReward();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '需要完整观看广告才能获得奖励',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },
  
  // 检查广告奖励状态
  checkAdRewardStatus: function() {
    const today = new Date().toDateString();
    const lastAdRewardDate = wx.getStorageSync('lastAdRewardDate');
    
    // 如果今天已经获得过广告奖励，则设置标志
    if (lastAdRewardDate === today) {
      this.setData({ adRewardedToday: true });
    } else {
      this.setData({ adRewardedToday: false });
    }
    
    // 检查高级题目解锁状态
    const premiumUnlocked = wx.getStorageSync('premiumUnlocked') || false;
    this.setData({ premiumUnlocked: premiumUnlocked });
  },
  
  // 显示广告奖励选项
  showAdRewardOptions: function() {
    if (this.data.adRewardedToday) {
      wx.showToast({
        title: '今日已获得广告奖励，明天再来吧！',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      showAdOptions: true,
      adRewardOptions: [
        { id: 'growth', name: '成长值加速', desc: '获得20点成长值', icon: '🚀' },
        { id: 'skin', name: '皮肤解锁加速', desc: '皮肤解锁进度+20%', icon: '👔' },
        { id: 'premium', name: '解锁精选题目', desc: '解锁3道高质量题目', icon: '⭐' }
      ]
    });
  },
  
  // 选择广告奖励
  selectAdReward: function(e) {
    const rewardId = e.currentTarget.dataset.id;
    this.setData({
      selectedReward: rewardId
    });
    
    // 显示广告
    this.showAdVideo();
  },
  
  // 显示广告视频
  showAdVideo: function() {
    if (!this.videoAd) {
      wx.showToast({
        title: '广告组件未初始化',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.adVideoLoaded) {
      wx.showToast({
        title: '广告加载中，请稍后再试',
        icon: 'none'
      });
      return;
    }
    
    this.videoAd.show().catch(() => {
      // 失败重试
      this.videoAd.load()
        .then(() => this.videoAd.show())
        .catch(err => {
          wx.showToast({
            title: '广告展示失败',
            icon: 'none'
          });
          console.log('广告展示失败', err);
        });
    });
  },
  
  // 处理广告奖励
  handleAdReward: function() {
    const reward = this.data.selectedReward;
    
    switch (reward) {
      case 'growth':
        // 增加成长值
        this.addDuckGrowth(20);
        wx.showToast({
          title: '获得20点成长值！',
          icon: 'success'
        });
        break;
        
      case 'skin':
        // 加速皮肤解锁
        this.accelerateSkinUnlock();
        wx.showToast({
          title: '皮肤解锁进度+20%！',
          icon: 'success'
        });
        break;
        
      case 'premium':
        // 解锁高质量题目
        this.unlockPremiumQuestions();
        wx.showToast({
          title: '已解锁3道精选题目！',
          icon: 'success'
        });
        break;
        
      default:
        wx.showToast({
          title: '获得奖励！',
          icon: 'success'
        });
    }
    
    // 记录今日已获得广告奖励
    const today = new Date().toDateString();
    wx.setStorageSync('lastAdRewardDate', today);
    
    this.setData({
      adRewardedToday: true,
      showAdOptions: false
    });
  },

  // 加速皮肤解锁
  accelerateSkinUnlock: function() {
    // 获取当前解锁进度
    const skinProgress = wx.getStorageSync('skinProgress') || {};
    const nextSkins = ['学士鸭', '程序鸭', '超能鸭'].filter(skin => !this.data.unlockedSkins.includes(skin));
    
    if (nextSkins.length > 0) {
      const nextSkin = nextSkins[0];
      skinProgress[nextSkin] = (skinProgress[nextSkin] || 0) + 20;
      
      // 如果进度达到100%，解锁皮肤
      if (skinProgress[nextSkin] >= 100) {
        const unlockedSkins = [...this.data.unlockedSkins, nextSkin];
        this.setData({
          unlockedSkins: unlockedSkins
        });
        wx.setStorageSync('unlockedSkins', unlockedSkins);
        
        // 显示解锁提示
        wx.showModal({
          title: '恭喜！',
          content: `你已解锁新皮肤：${nextSkin}`,
          confirmText: '立即使用',
          cancelText: '稍后查看',
          success: (res) => {
            if (res.confirm) {
              this.setData({
                currentSkin: nextSkin,
                showSkinSelector: false
              });
              wx.setStorageSync('currentSkin', nextSkin);
            }
          }
        });
        
        // 清除该皮肤的进度
        delete skinProgress[nextSkin];
      }
      
      // 保存进度
      wx.setStorageSync('skinProgress', skinProgress);
    } else {
      wx.showToast({
        title: '已解锁所有皮肤！',
        icon: 'success'
      });
    }
  },

  // 解锁高质量题目
  unlockPremiumQuestions: function() {
    // 模拟从服务器获取精选题目
    const premiumQuestions = [
      { id: 'p1', title: '高级算法：红黑树实现', difficulty: 5, category: '算法' },
      { id: 'p2', title: 'React性能优化最佳实践', difficulty: 4, category: '前端' },
      { id: 'p3', title: '分布式系统设计原则', difficulty: 5, category: '系统设计' }
    ];
    
    this.setData({
      premiumQuestions: premiumQuestions,
      premiumUnlocked: true
    });
    
    // 保存到本地存储，实际应用中可能需要与服务器交互
    wx.setStorageSync('premiumQuestions', premiumQuestions);
    wx.setStorageSync('premiumUnlocked', true);
  },

  // 关闭广告选项弹窗
  closeAdOptions: function() {
    this.setData({
      showAdOptions: false
    });
  },

  // 初始化广告视频
  initAdVideo: function() {
    // 如果已经初始化过，就不再重复初始化
    if (this.videoAd) {
      return;
    }
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-xxxxxxxxxxxxxxxx' // 替换为实际的广告单元ID
      });
      
      this.videoAd.onLoad(() => {
        console.log('广告加载成功');
        this.setData({
          adVideoLoaded: true
        });
      });
      
      this.videoAd.onError(err => {
        console.log('广告加载失败', err);
        this.setData({
          adVideoLoaded: false
        });
      });
      
      this.videoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.handleAdReward();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '需要完整观看广告才能获得奖励',
            icon: 'none'
          });
        }
      });
    }
    
    // 检查今日是否已获得广告奖励
    const lastAdRewardDate = wx.getStorageSync('lastAdRewardDate') || '';
    const today = new Date().toDateString();
    this.setData({
      adRewardedToday: lastAdRewardDate === today
    });
  },

  // 加载鸭鸭成长数据
  loadDuckGrowthData: function() {
    // 从本地存储加载鸭鸭成长数据
    const duckGrowth = wx.getStorageSync('duckGrowth') || 0;
    const duckLevel = wx.getStorageSync('duckLevel') || 1;
    
    this.setData({
      duckGrowth: duckGrowth,
      duckLevel: duckLevel
    });
  },

  // 加载鸭鸭皮肤
  loadDuckSkins: function() {
    // 从本地存储加载鸭鸭皮肤数据
    const duckSkins = wx.getStorageSync('duckSkins') || [
      { id: 'default', name: '普通鸭', unlocked: true, icon: '/images/logo/codeya_logo3.jpg' },
      { id: 'graduate', name: '学士鸭', unlocked: false, icon: '/images/duck/graduate.png', unlockLevel: 3 },
      { id: 'programmer', name: '程序鸭', unlocked: false, icon: '/images/duck/programmer.png', unlockLevel: 5 },
      { id: 'superhero', name: '超能鸭', unlocked: false, icon: '/images/duck/superhero.png', unlockLevel: 10 }
    ];
    
    this.setData({
      duckSkins: duckSkins
    });
  },

  // 鸭鸭冒险 - 随机刷题功能
  startRandomQuestion: function() {
    // 获取随机题目
    const question = this.getRandomQuestion();
    if (!question) {
      wx.showToast({
        title: '获取题目失败，请重试',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 显示加载动画
    wx.showLoading({
      title: '鸭鸭正在寻找题目...',
      mask: true
    });

    // 模拟加载过程，增加趣味性
    setTimeout(() => {
      wx.hideLoading();
      
      // 显示随机题目的弹窗
      wx.showModal({
        title: this.data.premiumUnlocked ? '🌟 鸭鸭找到了一道题！' : '鸭鸭找到了一道题！',
        content: `[${question.categoryName}] ${question.title}\n\n难度：${question.difficulty}`,
        confirmText: '开始挑战',
        cancelText: '换一题',
        success: (res) => {
          if (res.confirm) {
            // 用户点击了开始挑战，跳转到题目详情页
            wx.navigateTo({
              url: '/pages/detail/detail?categoryKey=' + question.categoryKey + '&questionId=' + question.id
            });
            
            // 增加鸭鸭成长值
            this.addDuckGrowth(1);
          } else {
            // 用户点击了换一题，重新获取随机题目
            this.startRandomQuestion();
          }
        }
      });
    }, 1500); // 1.5秒后显示题目
  },

  // 显示成就系统
  showAchievements: function() {
    // 获取用户成就数据
    const achievements = wx.getStorageSync('achievements') || [];
    const completedCount = achievements.filter(a => a.completed).length;
    const totalCount = achievements.length || 10; // 默认10个成就
    
    // 显示成就弹窗
    wx.showModal({
      title: '我的成就',
      content: `已完成 ${completedCount}/${totalCount} 个成就\n\n继续努力，解锁更多成就！`,
      confirmText: '查看详情',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了查看详情，跳转到成就详情页
          // 这里可以实现跳转到成就详情页的逻辑
          wx.showToast({
            title: '成就详情页面开发中...',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  // 显示皮肤选择器
  showSkinSelector: function() {
    // 获取已解锁的皮肤
    const unlockedSkins = this.data.unlockedSkins || ['普通鸭'];
    const currentSkin = this.data.currentSkin || '普通鸭';
    
    // 构建皮肤选项
    const skinOptions = unlockedSkins.map(skin => `${skin}${skin === currentSkin ? ' (当前使用)' : ''}`);
    
    // 显示皮肤选择弹窗
    wx.showActionSheet({
      itemList: skinOptions,
      success: (res) => {
        const selectedSkin = unlockedSkins[res.tapIndex];
        if (selectedSkin && selectedSkin !== currentSkin) {
          // 用户选择了新皮肤
          this.setData({
            currentSkin: selectedSkin
          });
          
          // 更新皮肤图标
          let skinIcon = '/images/logo/codeya_logo3.jpg'; // 默认皮肤图标
          
          // 根据皮肤名称设置对应的图标
          switch (selectedSkin) {
            case '学士鸭':
              skinIcon = '/images/duck/graduate.png';
              break;
            case '程序鸭':
              skinIcon = '/images/duck/programmer.png';
              break;
            case '超能鸭':
              skinIcon = '/images/duck/superhero.png';
              break;
          }
          
          this.setData({
            currentDuckSkinIcon: skinIcon
          });
          
          // 保存用户选择
          wx.setStorageSync('currentSkin', selectedSkin);
          wx.setStorageSync('currentDuckSkinIcon', skinIcon);
          
          wx.showToast({
            title: '皮肤切换成功！',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },
  
  // 增加鸭鸭成长值
  addDuckGrowth: function(value) {
    // 获取当前成长值和等级
    let duckGrowth = this.data.duckGrowth;
    let duckLevel = this.data.duckLevel;
    
    // 增加成长值
    duckGrowth += value;
    
    // 检查是否升级
    const nextLevelThreshold = duckLevel * 10;
    if (duckGrowth >= nextLevelThreshold) {
      duckLevel += 1;
      duckGrowth = duckGrowth - nextLevelThreshold;
      
      // 显示升级提示
      wx.showToast({
        title: '鸭鸭升级了！现在是 Lv.' + duckLevel,
        icon: 'success',
        duration: 2000
      });
      
      // 检查是否有新皮肤可以解锁
      this.checkSkinUnlock(duckLevel);
    }
    
    // 更新数据
    this.setData({
      duckGrowth: duckGrowth,
      duckLevel: duckLevel
    });
    
    // 保存到本地存储
    wx.setStorageSync('duckGrowth', duckGrowth);
    wx.setStorageSync('duckLevel', duckLevel);
  },
  
  // 检查皮肤解锁
  checkSkinUnlock: function(level) {
    // 根据等级检查是否有新皮肤可以解锁
    let newSkin = null;
    
    if (level >= 3 && !this.data.unlockedSkins.includes('学士鸭')) {
      newSkin = '学士鸭';
    } else if (level >= 5 && !this.data.unlockedSkins.includes('程序鸭')) {
      newSkin = '程序鸭';
    } else if (level >= 10 && !this.data.unlockedSkins.includes('超能鸭')) {
      newSkin = '超能鸭';
    }
    
    if (newSkin) {
      // 解锁新皮肤
      const unlockedSkins = [...this.data.unlockedSkins, newSkin];
      this.setData({
        unlockedSkins: unlockedSkins
      });
      
      // 保存到本地存储
      wx.setStorageSync('unlockedSkins', unlockedSkins);
      
      // 显示解锁提示
      wx.showModal({
        title: '新皮肤解锁！',
        content: `恭喜！你已解锁"${newSkin}"皮肤！\n\n要立即使用新皮肤吗？`,
        confirmText: '立即使用',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            // 用户选择立即使用新皮肤
            let skinIcon = '/images/logo/codeya_logo3.jpg'; // 默认皮肤图标
            
            // 根据皮肤名称设置对应的图标
            switch (newSkin) {
              case '学士鸭':
                skinIcon = '/images/duck/graduate.png';
                break;
              case '程序鸭':
                skinIcon = '/images/duck/programmer.png';
                break;
              case '超能鸭':
                skinIcon = '/images/duck/superhero.png';
                break;
            }
            
            this.setData({
              currentSkin: newSkin,
              currentDuckSkinIcon: skinIcon
            });
            
            // 保存用户选择
            wx.setStorageSync('currentSkin', newSkin);
            wx.setStorageSync('currentDuckSkinIcon', skinIcon);
          }
        }
      });
    }
  }
});
