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

Page({
  data: {
    totalPoints: 0,
    gameState: 'intro', // 'intro', 'playing', 'gameOver'
    score: 0,
    timeLeft: 60,
    moves: 0,
    gridSize: 4, // 4x4 网格
    emojiGrid: [],
    selectedIndices: [],
    gameWon: false,
    reward: 0,
    timer: null
  },

  onLoad: function() {
    // 加载用户积分
    this.loadUserPoints();
  },
  
  onShow: function() {
    // 每次显示页面时刷新积分
    this.loadUserPoints();
  },
  
  onUnload: function() {
    // 页面卸载时清除计时器
    this.clearTimers();
  },
  
  // 加载用户积分
  loadUserPoints: function() {
    const totalPoints = db.getTotalPoints();
    this.setData({
      totalPoints: totalPoints
    });
  },
  
  // 开始游戏
  startGame: function() {
    // 检查积分是否足够
    if (this.data.totalPoints < 2) {
      wx.showToast({
        title: '积分不足，无法开始游戏',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 扣除积分
    const newPoints = this.data.totalPoints - 2;
    db.updateTotalPoints(newPoints);
    
    // 初始化游戏数据
    this.initGame();
    
    // 更新UI
    this.setData({
      totalPoints: newPoints,
      gameState: 'playing'
    });
    
    // 开始计时
    this.startTimer();
  },
  
  // 初始化游戏
  initGame: function() {
    const gridSize = this.data.gridSize;
    const totalCells = gridSize * gridSize;
    
    // 确保是偶数个格子
    if (totalCells % 2 !== 0) {
      console.error('Grid size must result in an even number of cells');
      return;
    }
    
    // 创建表情对
    const pairCount = totalCells / 2;
    let selectedEmojis = [];
    
    // 随机选择表情
    while (selectedEmojis.length < pairCount) {
      const randomIndex = Math.floor(Math.random() * EMOJIS.length);
      const emoji = EMOJIS[randomIndex];
      
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
    
    // 随机打乱表情对数组
    for (let i = emojiPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojiPairs[i], emojiPairs[j]] = [emojiPairs[j], emojiPairs[i]];
    }
    
    // 更新数据
    this.setData({
      emojiGrid: emojiPairs,
      score: 0,
      timeLeft: 60,
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
    
    // 如果已经匹配或已经选中，忽略点击
    if (emojiGrid[index].matched || emojiGrid[index].selected) return;
    
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
    
    // 计算奖励积分
    let reward = 0;
    if (won) {
      // 基础奖励：4分
      reward = 4;
      
      // 时间奖励：每剩余10秒额外奖励1分，最多2分
      const timeBonus = Math.min(2, Math.floor(this.data.timeLeft / 10));
      reward += timeBonus;
      
      // 步数奖励：如果步数少于总格子数的一半，额外奖励2分
      const minMoves = this.data.emojiGrid.length / 2;
      if (this.data.moves <= minMoves) {
        reward += 2;
      }
    }
    
    // 更新用户积分
    if (reward > 0) {
      const newPoints = this.data.totalPoints + reward;
      db.updateTotalPoints(newPoints);
      
      this.setData({
        totalPoints: newPoints
      });
    }
    
    // 更新游戏状态
    this.setData({
      gameState: 'gameOver',
      gameWon: won,
      reward: reward
    });
  },
  
  // 重新开始游戏
  restartGame: function() {
    // 检查积分是否足够
    if (this.data.totalPoints < 2) {
      wx.showToast({
        title: '积分不足，无法重新开始',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 重置游戏状态
    this.setData({
      gameState: 'intro'
    });
  },
  
  // 退出游戏
  exitGame: function() {
    wx.navigateBack();
  }
}); 