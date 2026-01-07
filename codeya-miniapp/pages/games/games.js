const db = require('../../data/db.js');

Page({
  data: {
    totalPoints: 0,
    totalPoop: 0,
    games: [
      {
        id: 'duckAdventure',
        name: '鸭鸭冒险',
        description: '控制小鸭子躲避障碍物，收集金币',
        icon: '/images/logo/codeya_logo3.jpg',
        cost: 5,
        reward: '鸭屎 💩'
      },
      {
        id: 'memoryCard',
        name: '记忆翻牌',
        description: '考验记忆力，找出所有配对的卡片',
        icon: '/images/logo/codeya_logo2.jpg',
        cost: 3,
        reward: '鸭屎 💩'
      },
      {
        id: 'emojiMatch',
        name: '表情消消乐',
        description: '匹配相同的表情，消除所有方块',
        icon: '/images/logo/codeya_logo1.jpg',
        cost: 2,
        reward: '鸭屎 💩'
      }
    ]
  },

  onLoad: function() {
    // 加载用户积分和鸭屎数量
    this.loadUserData();
  },
  
  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadUserData();
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
  
  // 导航到具体游戏
  navigateToGame: function(e) {
    const gameId = e.currentTarget.dataset.game;
    
    // 根据游戏ID进行不同的导航
    switch(gameId) {
      case 'duckAdventure':
        // 导航到鸭鸭冒险游戏页面
        wx.navigateTo({
          url: '/pages/duck-adventure/duck-adventure'
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
        
      case 'emojiMatch':
        // 导航到表情消消乐游戏页面
        wx.navigateTo({
          url: '/pages/emoji-match/emoji-match'
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