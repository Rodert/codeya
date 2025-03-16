const db = require('../../data/db.js');

Page({
  data: {
    totalPoints: 0,
    games: [
      {
        id: 'duckAdventure',
        name: '鸭鸭冒险',
        description: '控制小鸭子躲避障碍物，收集金币',
        icon: '/images/logo/codeya_logo3.jpg',
        cost: 5,
        reward: '根据得分'
      },
      {
        id: 'memoryCard',
        name: '记忆翻牌',
        description: '考验记忆力，找出所有配对的卡片',
        icon: '/images/logo/codeya_logo2.jpg',
        cost: 3,
        reward: '最多10积分'
      },
      {
        id: 'codeGuess',
        name: '代码猜猜猜',
        description: '猜测代码片段的输出结果',
        icon: '/images/logo/codeya_logo1.jpg',
        cost: 2,
        reward: '每题2积分'
      }
    ]
  },

  onLoad: function() {
    // 加载用户积分
    this.loadUserPoints();
  },
  
  onShow: function() {
    // 每次显示页面时刷新积分
    this.loadUserPoints();
  },
  
  // 加载用户积分
  loadUserPoints: function() {
    const totalPoints = db.getTotalPoints();
    this.setData({
      totalPoints: totalPoints
    });
  },
  
  // 导航到具体游戏
  navigateToGame: function(e) {
    const gameId = e.currentTarget.dataset.game;
    
    // 根据游戏ID进行不同的导航
    switch(gameId) {
      case 'duckAdventure':
        // 直接在首页打开鸭鸭冒险游戏
        wx.switchTab({
          url: '/pages/index/index',
          success: () => {
            // 通过页面栈获取首页实例，并调用其startDuckGame方法
            const pages = getCurrentPages();
            const indexPage = pages[pages.length - 1];
            if (indexPage && indexPage.startDuckGame) {
              setTimeout(() => {
                indexPage.startDuckGame();
              }, 500); // 延迟调用，确保页面已完全加载
            }
          }
        });
        break;
        
      case 'memoryCard':
        // 记忆翻牌游戏暂未实现，显示提示
        wx.showModal({
          title: '游戏开发中',
          content: '记忆翻牌游戏正在开发中，敬请期待！',
          showCancel: false
        });
        break;
        
      case 'codeGuess':
        // 代码猜猜猜游戏暂未实现，显示提示
        wx.showModal({
          title: '游戏开发中',
          content: '代码猜猜猜游戏正在开发中，敬请期待！',
          showCancel: false
        });
        break;
        
      default:
        wx.showToast({
          title: '游戏暂未开放',
          icon: 'none',
          duration: 2000
        });
    }
  }
}); 