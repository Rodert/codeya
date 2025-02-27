const storage = require('../../utils/storage.js');
const pointsDb = require('../../data/points.js');

Page({
  data: {
    statistics: {
      points: 0,
      studyDays: 0,
      totalQuestions: 0
    },
    functionList: [
      {
        id: 'history',
        name: '学习记录'
      },
      {
        id: 'points',
        name: '我的积分'
      },
      {
        id: 'wrong',
        name: '错题本'
      },
      {
        id: 'feedback',
        name: '意见反馈'
      }
    ]
  },

  onLoad() {
    this.loadStatistics();
  },

  onShow() {
    // 每次显示页面时更新统计数据
    this.loadStatistics();
  },

  loadStatistics() {
    // 从本地存储获取统计数据
    const stats = storage.getStatistics() || {};
    
    // 获取最新的积分数据
    stats.points = pointsDb.totalPoints || 0;
    
    this.setData({
      statistics: stats
    });
  },

  handleFunctionClick(e) {
    const functionId = e.currentTarget.dataset.id;
    switch (functionId) {
      case 'history':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
        break;
      case 'points':
        // 显示积分详情
        wx.showModal({
          title: '积分详情',
          content: `当前积分：${this.data.statistics.points}\n\n获取积分方式：\n- 简单题：1分\n- 中等题：2分\n- 困难题：3分`,
          showCancel: false
        });
        break;
      case 'wrong':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
        break;
      case 'feedback':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
        break;
    }
  }
});
