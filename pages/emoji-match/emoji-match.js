const db = require('../../data/db.js');

// 可用的表情列表
const EMOJIS = [
  // 动物表情
  '🦆', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻',
  '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
  '🐔', '🐧', '🐦', '🦉', '🦢', '🦅', '🐺', '🐗',
  '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐙',
  '🦓', '🦒', '🦘', '🦮', '🐕‍🦺', '🦝', '🦥', '🦦',
  '🦨', '🦔', '🐢', '🐊', '🐅', '🐆', '🦍', '🦧',
  // 原有表情
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', 
  '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', 
  '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', 
  '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐'
];

// 关卡配置
const LEVELS = [
  // 关卡1：4x4网格，60秒，简单表情
  {
    gridSize: 4,
    timeLimit: 60,
    emojiCount: 8, // 8对表情
    emojiPool: EMOJIS.slice(0, 16), // 使用前16个表情
    reward: 4, // 基础奖励（鸭屎数量）
    costPoints: 2 // 消耗积分
  },
  // 关卡2：4x4网格，50秒，更多表情
  {
    gridSize: 4,
    timeLimit: 50,
    emojiCount: 8,
    emojiPool: EMOJIS.slice(8, 24), // 使用不同的表情
    reward: 5,
    costPoints: 2
  },
  // 关卡3：4x5网格，60秒，更多表情
  {
    gridSize: 5,
    timeLimit: 60,
    emojiCount: 10, // 10对表情
    emojiPool: EMOJIS.slice(16, 36),
    reward: 6,
    costPoints: 3
  },
  // 关卡4：5x6网格，70秒，更多表情
  {
    gridSize: 6,
    timeLimit: 70,
    emojiCount: 15, // 15对表情
    emojiPool: EMOJIS.slice(0, 30),
    reward: 7,
    costPoints: 3
  },
  // 关卡5：6x6网格，60秒，全部表情
  {
    gridSize: 6,
    timeLimit: 60,
    emojiCount: 18, // 18对表情
    emojiPool: EMOJIS, // 使用所有表情
    reward: 8,
    costPoints: 4
  }
];

// 激励视频广告实例
let videoAd = null;

Page({
  data: {
    totalPoints: 0,
    totalPoop: 0,
    gameState: 'intro', // 'intro', 'level-select', 'playing', 'gameOver'
    score: 0,
    timeLeft: 60,
    moves: 0,
    gridSize: 4, // 默认4x4网格
    emojiGrid: [],
    selectedIndices: [],
    gameWon: false,
    reward: 0,
    timer: null,
    currentLevel: 0, // 当前关卡
    levels: LEVELS, // 关卡配置
    unlockedLevels: 1, // 已解锁的关卡数量
    levelProgress: {}, // 关卡进度
    showPointsInsufficientModal: false // 添加积分不足弹窗控制变量
  },

  onLoad: function() {
    // 加载用户积分和鸭屎数量
    this.loadUserData();
    
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    // 加载关卡进度
    this.loadLevelProgress();
    
    // 初始化激励视频广告
    this.initRewardedVideoAd();
  },
  
  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadUserData();
  },
  
  onUnload: function() {
    // 页面卸载时清除计时器
    this.clearTimers();
  },
  
  // 加载用户积分和鸭屎数量
  loadUserData: function() {
    const totalPoints = db.getTotalPoints();
    const totalPoop = db.getTotalDuckPoop();
    this.setData({
      totalPoints: totalPoints,
      totalPoop: totalPoop
    });
  },
  
  // 加载关卡进度
  loadLevelProgress: function() {
    try {
      const progress = wx.getStorageSync('emojiMatchLevelProgress');
      if (progress) {
        const parsedProgress = JSON.parse(progress);
        this.setData({
          unlockedLevels: parsedProgress.unlockedLevels || 1,
          levelProgress: parsedProgress.levelProgress || {}
        });
      }
    } catch (e) {
      console.error('Failed to load level progress:', e);
      // 加载失败时使用默认值
      this.setData({
        unlockedLevels: 1,
        levelProgress: {}
      });
      
      // 尝试使用异步方法获取
      wx.getStorage({
        key: 'emojiMatchLevelProgress',
        success: (res) => {
          try {
            const parsedProgress = JSON.parse(res.data);
            this.setData({
              unlockedLevels: parsedProgress.unlockedLevels || 1,
              levelProgress: parsedProgress.levelProgress || {}
            });
          } catch (parseError) {
            console.error('Failed to parse level progress:', parseError);
          }
        },
        fail: (err) => {
          console.error('Async get storage failed:', err);
        }
      });
    }
  },
  
  // 保存关卡进度
  saveLevelProgress: function() {
    try {
      const progress = {
        unlockedLevels: this.data.unlockedLevels,
        levelProgress: this.data.levelProgress
      };
      wx.setStorageSync('emojiMatchLevelProgress', JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save level progress:', e);
      // 同步保存失败时尝试异步保存
      const progress = {
        unlockedLevels: this.data.unlockedLevels,
        levelProgress: this.data.levelProgress
      };
      
      wx.setStorage({
        key: 'emojiMatchLevelProgress',
        data: JSON.stringify(progress),
        fail: (err) => {
          console.error('Async storage also failed:', err);
        }
      });
    }
  },
  
  // 显示关卡选择界面
  showLevelSelect: function() {
    this.setData({
      gameState: 'level-select'
    });
  },
  
  // 选择关卡
  selectLevel: function(e) {
    const level = e.currentTarget.dataset.level;
    
    // 检查关卡是否已解锁
    if (level >= this.data.unlockedLevels) {
      wx.showToast({
        title: '该关卡尚未解锁',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 设置当前关卡
    this.setData({
      currentLevel: level,
      gameState: 'intro'
    });
  },
  
  // 开始游戏
  startGame: function() {
    const levelConfig = LEVELS[this.data.currentLevel];
    
    // 检查积分是否足够
    if (this.data.totalPoints < levelConfig.costPoints) {
      // 显示积分不足弹窗，而不是简单的提示
      this.setData({
        showPointsInsufficientModal: true
      });
      return;
    }
    
    // 扣除积分
    const newPoints = this.data.totalPoints - levelConfig.costPoints;
    db.updateTotalPoints(newPoints);
    
    // 初始化游戏数据
    this.initGame(levelConfig);
    
    // 更新UI
    this.setData({
      totalPoints: newPoints,
      gameState: 'playing'
    });
    
    // 开始计时
    this.startTimer();
  },
  
  // 初始化游戏
  initGame: function(levelConfig) {
    const gridSize = levelConfig.gridSize;
    const totalCells = gridSize * gridSize;
    
    // 确保是偶数个格子
    if (totalCells % 2 !== 0 && levelConfig.emojiCount * 2 > totalCells) {
      console.error('Grid size must result in an even number of cells and enough for all emoji pairs');
      return;
    }
    
    // 创建表情对
    const pairCount = levelConfig.emojiCount;
    let selectedEmojis = [];
    
    // 随机选择表情
    while (selectedEmojis.length < pairCount) {
      const randomIndex = Math.floor(Math.random() * levelConfig.emojiPool.length);
      const emoji = levelConfig.emojiPool[randomIndex];
      
      // 确保不重复选择同一个表情
      if (!selectedEmojis.includes(emoji)) {
        selectedEmojis.push(emoji);
      }
    }
    
    // 创建表情对数组
    let emojiPairs = [];
    selectedEmojis.forEach(emoji => {
      emojiPairs.push({ emoji, matched: false, selected: false });
      emojiPairs.push({ emoji, matched: false, selected: false });
    });
    
    // 如果网格大小大于表情对数量的两倍，添加空白格子
    const emptyCount = totalCells - (pairCount * 2);
    for (let i = 0; i < emptyCount; i++) {
      emojiPairs.push({ emoji: '', matched: true, selected: false, empty: true });
    }
    
    // 随机打乱表情对数组
    for (let i = emojiPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojiPairs[i], emojiPairs[j]] = [emojiPairs[j], emojiPairs[i]];
    }
    
    // 更新数据
    this.setData({
      emojiGrid: emojiPairs,
      gridSize: gridSize,
      score: 0,
      timeLeft: levelConfig.timeLimit,
      moves: 0,
      selectedIndices: [],
      gameWon: false,
      reward: 0
    });
  },
  
  // 开始计时器
  startTimer: function() {
    // 清除之前的计时器
    this.clearTimers();
    
    // 设置新的计时器
    const timer = setInterval(() => {
      let timeLeft = this.data.timeLeft - 1;
      
      if (timeLeft <= 0) {
        // 时间到，游戏结束
        this.endGame(false);
        return;
      }
      
      this.setData({
        timeLeft: timeLeft
      });
    }, 1000);
    
    this.setData({
      timer: timer
    });
  },
  
  // 清除计时器
  clearTimers: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },
  
  // 处理表情点击事件
  onEmojiTap: function(e) {
    // 如果游戏未在进行中，忽略点击
    if (this.data.gameState !== 'playing') return;
    
    const index = e.currentTarget.dataset.index;
    const emojiGrid = this.data.emojiGrid;
    
    // 如果已经匹配、已经选中或是空白格子，忽略点击
    if (emojiGrid[index].matched || emojiGrid[index].selected || emojiGrid[index].empty) return;
    
    // 如果已经选中了两个表情，忽略点击
    if (this.data.selectedIndices.length >= 2) return;
    
    // 选中当前表情
    let selectedIndices = [...this.data.selectedIndices];
    selectedIndices.push(index);
    
    // 更新表情状态
    let newEmojiGrid = [...emojiGrid];
    newEmojiGrid[index].selected = true;
    
    this.setData({
      emojiGrid: newEmojiGrid,
      selectedIndices: selectedIndices
    });
    
    // 如果选中了两个表情，检查是否匹配
    if (selectedIndices.length === 2) {
      // 增加步数
      this.setData({
        moves: this.data.moves + 1
      });
      
      // 检查是否匹配
      setTimeout(() => {
        this.checkMatch();
      }, 500);
    }
  },
  
  // 检查两个选中的表情是否匹配
  checkMatch: function() {
    const selectedIndices = this.data.selectedIndices;
    const emojiGrid = this.data.emojiGrid;
    
    // 获取两个选中的表情
    const emoji1 = emojiGrid[selectedIndices[0]].emoji;
    const emoji2 = emojiGrid[selectedIndices[1]].emoji;
    
    // 检查是否匹配
    const isMatch = emoji1 === emoji2;
    
    // 更新表情状态
    let newEmojiGrid = [...emojiGrid];
    
    if (isMatch) {
      // 匹配成功，标记为已匹配
      newEmojiGrid[selectedIndices[0]].matched = true;
      newEmojiGrid[selectedIndices[1]].matched = true;
      
      // 增加分数
      const newScore = this.data.score + 10;
      
      this.setData({
        emojiGrid: newEmojiGrid,
        selectedIndices: [],
        score: newScore
      });
      
      // 检查是否所有表情都已匹配
      this.checkGameWon();
    } else {
      // 匹配失败，取消选中状态
      newEmojiGrid[selectedIndices[0]].selected = false;
      newEmojiGrid[selectedIndices[1]].selected = false;
      
      this.setData({
        emojiGrid: newEmojiGrid,
        selectedIndices: []
      });
    }
  },
  
  // 检查是否所有表情都已匹配
  checkGameWon: function() {
    const emojiGrid = this.data.emojiGrid;
    const allMatched = emojiGrid.every(item => item.matched);
    
    if (allMatched) {
      // 游戏胜利
      this.endGame(true);
    }
  },
  
  // 结束游戏
  endGame: function(won) {
    // 停止计时器
    this.clearTimers();
    
    const levelConfig = LEVELS[this.data.currentLevel];
    
    // 计算奖励鸭屎
    let reward = 0;
    if (won) {
      // 基础奖励
      reward = levelConfig.reward;
      
      // 时间奖励：每剩余10秒额外奖励1坨，最多2坨
      const timeBonus = Math.min(2, Math.floor(this.data.timeLeft / 10));
      reward += timeBonus;
      
      // 步数奖励：如果步数少于总格子数的一半，额外奖励2坨
      const minMoves = levelConfig.emojiCount;
      if (this.data.moves <= minMoves) {
        reward += 2;
      }
      
      // 如果是最后一关，额外奖励
      if (this.data.currentLevel === LEVELS.length - 1) {
        reward += 3;
      }
      
      // 解锁下一关卡
      if (this.data.currentLevel + 1 >= this.data.unlockedLevels && 
          this.data.currentLevel + 1 < LEVELS.length) {
        this.setData({
          unlockedLevels: this.data.currentLevel + 2
        });
        
        // 保存关卡进度
        this.saveLevelProgress();
        
        // 显示解锁提示
        wx.showToast({
          title: '恭喜解锁新关卡！',
          icon: 'success',
          duration: 2000
        });
      }
      
      // 更新关卡进度
      let levelProgress = this.data.levelProgress;
      const levelKey = 'level_' + this.data.currentLevel;
      
      // 记录最高分和最少步数
      if (!levelProgress[levelKey] || this.data.score > levelProgress[levelKey].highScore) {
        levelProgress[levelKey] = {
          highScore: this.data.score,
          bestMoves: this.data.moves,
          bestTime: this.data.timeLeft
        };
      } else if (this.data.score === levelProgress[levelKey].highScore) {
        // 如果分数相同，比较步数
        if (this.data.moves < levelProgress[levelKey].bestMoves) {
          levelProgress[levelKey].bestMoves = this.data.moves;
          levelProgress[levelKey].bestTime = this.data.timeLeft;
        }
      }
      
      this.setData({
        levelProgress: levelProgress
      });
      
      // 保存关卡进度
      this.saveLevelProgress();
    }
    
    // 更新用户鸭屎数量
    if (reward > 0) {
      const result = db.addDuckPoop('emojiMatch', reward);
      
      this.setData({
        totalPoop: result.totalPoop
      });
      
      wx.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });
    }
    
    // 更新游戏状态
    this.setData({
      gameState: 'gameOver',
      gameWon: won,
      reward: reward
    });
  },
  
  // 关闭积分不足弹窗
  closePointsInsufficientModal: function() {
    this.setData({
      showPointsInsufficientModal: false
    });
  },
  
  // 导航到学习页面
  navigateToStudy: function() {
    this.closePointsInsufficientModal();
    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        wx.showToast({
          title: '学习题目可获得积分',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 点击分享按钮
  onShareTap: function() {
    // 这里只记录用户点击了分享按钮
    console.log('用户点击了分享按钮');
    
    // 由于微信小程序限制，无法直接获知用户是否成功分享
    // 所以我们假设用户点击分享按钮后就成功分享了
    setTimeout(() => {
      this.addSharePoints();
    }, 1500); // 延迟1.5秒，模拟用户分享完成的时间
  },
  
  // 分享小程序
  onShareAppMessage: function() {
    return {
      title: '表情消消乐 - 编程鸭小游戏',
      path: '/pages/emoji-match/emoji-match',
      imageUrl: '/images/logo/codeya_logo1.jpg'
    };
  },
  
  // 初始化激励视频广告
  initRewardedVideoAd: function() {
    // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-49b33605e9adf471'  // 使用流量主提供的广告单元ID
      });
      
      videoAd.onLoad(() => {
        console.log('激励视频广告加载成功');
      });
      
      videoAd.onError((err) => {
        console.error('激励视频广告加载失败', err);
        // 加载失败时，显示提示并给予积分（为了测试）
        wx.showToast({
          title: '广告加载失败，模拟观看',
          icon: 'none',
          duration: 2000
        });
        
        // 模拟广告观看完成，给予积分奖励
        setTimeout(() => {
          const newPoints = this.data.totalPoints + 10;
          db.updateTotalPoints(newPoints);
          
          this.setData({
            totalPoints: newPoints
          });
          
          wx.showToast({
            title: '获得10积分奖励！',
            icon: 'success',
            duration: 2000
          });
        }, 2000);
      });
      
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          const newPoints = this.data.totalPoints + 10;
          db.updateTotalPoints(newPoints);
          
          this.setData({
            totalPoints: newPoints
          });
          
          wx.showToast({
            title: '获得10积分奖励！',
            icon: 'success',
            duration: 2000
          });
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '观看完整广告才能获得奖励',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },
  
  // 观看广告获取积分
  watchAdToGetPoints: function() {
    this.closePointsInsufficientModal();
    
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.error('激励视频广告显示失败', err);
            // 显示失败时，显示提示并给予积分（为了测试）
            wx.showToast({
              title: '广告显示失败，模拟观看',
              icon: 'none',
              duration: 2000
            });
            
            // 模拟广告观看完成，给予积分奖励
            setTimeout(() => {
              const newPoints = this.data.totalPoints + 10;
              db.updateTotalPoints(newPoints);
              
              this.setData({
                totalPoints: newPoints
              });
              
              wx.showToast({
                title: '获得10积分奖励！',
                icon: 'success',
                duration: 2000
              });
            }, 2000);
          });
      });
    } else {
      // 如果没有初始化成功，使用模拟方式
      wx.showModal({
        title: '观看广告获取积分',
        content: '观看一个短视频广告，可获得10积分奖励',
        confirmText: '观看广告',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '加载广告中...',
            });
            
            setTimeout(() => {
              wx.hideLoading();
              
              // 模拟广告观看完成，给予积分奖励
              const newPoints = this.data.totalPoints + 10;
              db.updateTotalPoints(newPoints);
              
              this.setData({
                totalPoints: newPoints
              });
              
              wx.showToast({
                title: '获得10积分奖励！',
                icon: 'success',
                duration: 2000
              });
            }, 2000);
          }
        }
      });
    }
  },
  
  // 分享小程序获取积分
  shareToGetPoints: function() {
    this.closePointsInsufficientModal();
    
    // 显示分享提示
    wx.showToast({
      title: '请点击分享按钮',
      icon: 'none',
      duration: 2000
    });
  },
  
  // 重新开始游戏
  restartGame: function() {
    const levelConfig = LEVELS[this.data.currentLevel];
    
    // 检查积分是否足够
    if (this.data.totalPoints < levelConfig.costPoints) {
      // 显示积分不足弹窗，而不是简单的提示
      this.setData({
        showPointsInsufficientModal: true
      });
      return;
    }
    
    // 重置游戏状态
    this.setData({
      gameState: 'intro'
    });
  },
  
  // 返回关卡选择
  backToLevelSelect: function() {
    this.setData({
      gameState: 'level-select'
    });
  },
  
  // 退出游戏
  exitGame: function() {
    wx.navigateBack();
  },
  
  // 添加分享积分
  addSharePoints: function() {
    const result = db.addSharePoints();
    if (result.success) {
      // 更新积分显示
      this.setData({
        totalPoints: db.getTotalPoints()
      });
      
      // 关闭积分不足弹窗
      this.setData({
        showPointsInsufficientModal: false
      });
      
      wx.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 2000
      });
    }
  }
}); 