const db = require('../../data/db.js');

Page({
  data: {
    totalPoints: 0,
    totalPoop: 0,
    gameStarted: false,
    gameOver: false,
    gameScore: 0,
    gameTime: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    duckPosition: {
      x: 0,
      y: 0
    },
    obstacles: [],
    coins: [],
    gameTimer: null,
    obstacleTimer: null,
    coinTimer: null,
    gravity: 0.5,
    duckVelocity: {
      x: 0,
      y: 0
    },
    isJumping: false,
    touchStartX: 0,
    touchStartY: 0,
    showPointsInsufficientModal: false
  },

  onLoad: function() {
    // 加载用户积分和鸭屎数量
    this.loadUserData();
    
    // 初始化游戏画布
    this.initGameCanvas();
  },
  
  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadUserData();
  },
  
  onUnload: function() {
    // 页面卸载时清除所有计时器
    this.clearAllTimers();
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
        this.drawGame();
      }
    });
  },
  
  // 开始游戏
  startGame: function() {
    // 检查积分是否足够
    if (this.data.totalPoints < 5) {
      // 显示积分不足弹窗，而不是简单的提示
      this.setData({
        showPointsInsufficientModal: true
      });
      return;
    }
    
    // 扣除积分
    const newPoints = this.data.totalPoints - 5;
    db.updateTotalPoints(newPoints);
    
    // 重置游戏状态
    this.setData({
      totalPoints: newPoints,
      gameStarted: true,
      gameOver: false,
      gameScore: 0,
      gameTime: 0,
      obstacles: [],
      coins: [],
      duckPosition: {
        x: this.data.canvasWidth / 2,
        y: this.data.canvasHeight - 100
      },
      duckVelocity: {
        x: 0,
        y: 0
      },
      isJumping: false
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
    this.clearAllTimers();
    
    // 设置游戏主循环
    const gameTimer = setInterval(() => {
      if (this.data.gameOver) {
        this.clearAllTimers();
        return;
      }
      
      // 更新游戏时间
      this.setData({
        gameTime: this.data.gameTime + 1
      });
      
      // 更新游戏状态
      this.updateGameState();
      
      // 绘制游戏
      this.drawGame();
      
      // 检查碰撞
      this.checkCollisions();
    }, 1000 / 30); // 30 FPS
    
    this.setData({
      gameTimer: gameTimer
    });
  },
  
  // 开始生成障碍物
  startObstacleGeneration: function() {
    const obstacleTimer = setInterval(() => {
      if (this.data.gameOver) {
        return;
      }
      
      // 生成新障碍物
      this.generateObstacle();
    }, 2000); // 每2秒生成一个障碍物
    
    this.setData({
      obstacleTimer: obstacleTimer
    });
  },
  
  // 开始生成金币
  startCoinGeneration: function() {
    const coinTimer = setInterval(() => {
      if (this.data.gameOver) {
        return;
      }
      
      // 生成新金币
      this.generateCoin();
    }, 3000); // 每3秒生成一个金币
    
    this.setData({
      coinTimer: coinTimer
    });
  },
  
  // 生成障碍物
  generateObstacle: function() {
    const obstacles = this.data.obstacles;
    
    // 创建新障碍物
    const newObstacle = {
      x: this.data.canvasWidth,
      y: this.data.canvasHeight - 50 - Math.random() * 100,
      width: 30,
      height: 50,
      speed: 5 + Math.random() * 3
    };
    
    obstacles.push(newObstacle);
    
    this.setData({
      obstacles: obstacles
    });
  },
  
  // 生成金币
  generateCoin: function() {
    const coins = this.data.coins;
    
    // 创建新金币
    const newCoin = {
      x: this.data.canvasWidth,
      y: 100 + Math.random() * (this.data.canvasHeight - 200),
      radius: 15,
      speed: 4 + Math.random() * 2
    };
    
    coins.push(newCoin);
    
    this.setData({
      coins: coins
    });
  },
  
  // 更新游戏状态
  updateGameState: function() {
    // 更新鸭子位置
    let duckPosition = this.data.duckPosition;
    let duckVelocity = this.data.duckVelocity;
    
    // 应用重力
    duckVelocity.y += this.data.gravity;
    
    // 更新位置
    duckPosition.x += duckVelocity.x;
    duckPosition.y += duckVelocity.y;
    
    // 边界检查
    if (duckPosition.y > this.data.canvasHeight - 50) {
      duckPosition.y = this.data.canvasHeight - 50;
      duckVelocity.y = 0;
      this.setData({
        isJumping: false
      });
    }
    
    if (duckPosition.y < 50) {
      duckPosition.y = 50;
      duckVelocity.y = 0;
    }
    
    if (duckPosition.x < 50) {
      duckPosition.x = 50;
      duckVelocity.x = 0;
    }
    
    if (duckPosition.x > this.data.canvasWidth - 50) {
      duckPosition.x = this.data.canvasWidth - 50;
      duckVelocity.x = 0;
    }
    
    // 更新障碍物位置
    let obstacles = this.data.obstacles;
    obstacles = obstacles.filter(obstacle => {
      obstacle.x -= obstacle.speed;
      return obstacle.x > -obstacle.width;
    });
    
    // 更新金币位置
    let coins = this.data.coins;
    coins = coins.filter(coin => {
      coin.x -= coin.speed;
      return coin.x > -coin.radius * 2;
    });
    
    // 更新数据
    this.setData({
      duckPosition: duckPosition,
      duckVelocity: duckVelocity,
      obstacles: obstacles,
      coins: coins
    });
  },
  
  // 检查碰撞
  checkCollisions: function() {
    const duckPosition = this.data.duckPosition;
    const duckRadius = 30; // 鸭子的碰撞半径
    
    // 检查与障碍物的碰撞
    for (const obstacle of this.data.obstacles) {
      // 简单的矩形碰撞检测
      if (
        duckPosition.x + duckRadius > obstacle.x &&
        duckPosition.x - duckRadius < obstacle.x + obstacle.width &&
        duckPosition.y + duckRadius > obstacle.y &&
        duckPosition.y - duckRadius < obstacle.y + obstacle.height
      ) {
        // 碰撞到障碍物，游戏结束
        this.gameOver();
        return;
      }
    }
    
    // 检查与金币的碰撞
    let coins = this.data.coins;
    let gameScore = this.data.gameScore;
    let collectedCoins = false;
    
    coins = coins.filter(coin => {
      // 简单的圆形碰撞检测
      const distance = Math.sqrt(
        Math.pow(duckPosition.x - coin.x, 2) +
        Math.pow(duckPosition.y - coin.y, 2)
      );
      
      if (distance < duckRadius + coin.radius) {
        // 收集金币
        gameScore += 10;
        collectedCoins = true;
        return false;
      }
      
      return true;
    });
    
    if (collectedCoins) {
      this.setData({
        coins: coins,
        gameScore: gameScore
      });
    }
  },
  
  // 绘制游戏
  drawGame: function() {
    const ctx = wx.createCanvasContext('gameCanvas');
    
    // 清空画布
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 绘制背景
    ctx.setFillStyle('#87CEEB'); // 天空蓝
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    // 绘制地面
    ctx.setFillStyle('#8B4513'); // 棕色
    ctx.fillRect(0, this.data.canvasHeight - 30, this.data.canvasWidth, 30);
    
    // 绘制草地
    ctx.setFillStyle('#7CFC00'); // 草绿色
    ctx.fillRect(0, this.data.canvasHeight - 40, this.data.canvasWidth, 10);
    
    // 如果游戏已开始，绘制游戏元素
    if (this.data.gameStarted) {
      // 绘制障碍物
      ctx.setFillStyle('#FF4500'); // 红橙色
      for (const obstacle of this.data.obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
      
      // 绘制金币
      ctx.setFillStyle('#FFD700'); // 金色
      for (const coin of this.data.coins) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // 绘制鸭子
      ctx.setFillStyle('#FFFF00'); // 黄色
      ctx.beginPath();
      ctx.arc(this.data.duckPosition.x, this.data.duckPosition.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      // 绘制鸭子眼睛
      ctx.setFillStyle('#000000'); // 黑色
      ctx.beginPath();
      ctx.arc(this.data.duckPosition.x + 10, this.data.duckPosition.y - 10, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // 绘制鸭子嘴巴
      ctx.setFillStyle('#FF8C00'); // 橙色
      ctx.beginPath();
      ctx.moveTo(this.data.duckPosition.x + 20, this.data.duckPosition.y);
      ctx.lineTo(this.data.duckPosition.x + 40, this.data.duckPosition.y);
      ctx.lineTo(this.data.duckPosition.x + 30, this.data.duckPosition.y + 10);
      ctx.closePath();
      ctx.fill();
    } else {
      // 游戏未开始，绘制提示
      ctx.setFillStyle('#000000');
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText('点击开始按钮开始游戏', this.data.canvasWidth / 2, this.data.canvasHeight / 2);
    }
    
    // 绘制到画布
    ctx.draw();
  },
  
  // 游戏结束
  gameOver: function() {
    this.setData({
      gameOver: true
    });
    
    // 清除所有计时器
    this.clearAllTimers();
    
    // 计算奖励鸭屎
    const poopReward = Math.floor(this.data.gameScore / 10) + Math.floor(this.data.gameTime / 5);
    
    // 添加奖励鸭屎
    if (poopReward > 0) {
      const result = db.addDuckPoop('duckAdventure', poopReward);
      
      this.setData({
        totalPoop: result.totalPoop
      });
      
      wx.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });
    }
  },
  
  // 重新开始游戏
  restartGame: function() {
    // 检查积分是否足够
    if (this.data.totalPoints < 5) {
      // 显示积分不足弹窗，而不是简单的提示
      this.setData({
        showPointsInsufficientModal: true
      });
      return;
    }
    
    // 重置游戏状态
    this.setData({
      gameStarted: false,
      gameOver: false
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
  
  // 分享小程序
  onShareAppMessage: function() {
    // 延迟添加积分，模拟用户分享完成
    setTimeout(() => {
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
    }, 1000);
    
    return {
      title: '鸭鸭冒险 - 编程鸭小游戏',
      path: '/pages/duck-adventure/duck-adventure',
      imageUrl: '/images/logo/codeya_logo3.jpg'
    };
  },
  
  // 观看广告获取积分
  watchAdToGetPoints: function() {
    this.closePointsInsufficientModal();
    
    wx.showModal({
      title: '观看广告获取积分',
      content: '观看一个短视频广告，可获得10积分奖励',
      confirmText: '观看广告',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 这里应该调用广告API，但由于微信小程序的广告API需要真实的广告单元ID，
          // 所以这里只是模拟广告观看完成后的奖励
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
  },
  
  // 退出游戏
  exitGame: function() {
    wx.navigateBack();
  },
  
  // 清除所有计时器
  clearAllTimers: function() {
    if (this.data.gameTimer) {
      clearInterval(this.data.gameTimer);
    }
    
    if (this.data.obstacleTimer) {
      clearInterval(this.data.obstacleTimer);
    }
    
    if (this.data.coinTimer) {
      clearInterval(this.data.coinTimer);
    }
  },
  
  // 触摸事件处理
  onTouchStart: function(e) {
    if (!this.data.gameStarted || this.data.gameOver) {
      return;
    }
    
    this.setData({
      touchStartX: e.touches[0].clientX,
      touchStartY: e.touches[0].clientY
    });
  },
  
  onTouchMove: function(e) {
    if (!this.data.gameStarted || this.data.gameOver) {
      return;
    }
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchX - this.data.touchStartX;
    const deltaY = touchY - this.data.touchStartY;
    
    // 更新鸭子速度
    let duckVelocity = this.data.duckVelocity;
    duckVelocity.x = deltaX * 0.1;
    
    // 如果向上滑动且鸭子在地面上，则跳跃
    if (deltaY < -50 && !this.data.isJumping) {
      duckVelocity.y = -12;
      this.setData({
        isJumping: true
      });
    }
    
    this.setData({
      duckVelocity: duckVelocity,
      touchStartX: touchX,
      touchStartY: touchY
    });
  },
  
  onTouchEnd: function(e) {
    if (!this.data.gameStarted || this.data.gameOver) {
      return;
    }
    
    // 停止水平移动
    let duckVelocity = this.data.duckVelocity;
    duckVelocity.x = 0;
    
    this.setData({
      duckVelocity: duckVelocity
    });
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
  }
});