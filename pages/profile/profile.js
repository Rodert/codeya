const storage = require('../../utils/storage.js');

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
    const stats = storage.getStatistics();
    this.setData({
      statistics: stats
    });
  },

  handleFunctionClick(e) {
    const functionId = e.currentTarget.dataset.id;
    switch (functionId) {
      case 'history':
        wx.showToast({
          title: '正在开发中...',
          icon: 'none'
        });
        break;
      case 'points':
        wx.showModal({
          title: '我的积分',
          content: `当前积分：${this.data.statistics.points}\n每答对一题可获得10积分`,
          showCancel: false
        });
        break;
      case 'wrong':
        wx.showToast({
          title: '正在开发中...',
          icon: 'none'
        });
        break;
      case 'feedback':
        wx.showToast({
          title: '正在开发中...',
          icon: 'none'
        });
        break;
    }
  }
});
