const db = require('../../data/db.js');

Page({
  data: {
    category: null,
    questions: [],
    showBanner: true
  },

  onLoad: function(options) {
    const categoryKey = options.key;
    
    // 获取分类信息
    const categories = db.getCategories();
    const category = categories.find(c => c.key === categoryKey);
    
    if (!category) {
      wx.showToast({
        title: '分类不存在',
        icon: 'none'
      });
      return;
    }

    // 获取该分类下的所有题目
    const questions = db.getQuestionsByCategory(categoryKey);

    this.setData({
      category: category,
      questions: questions
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: category.name
    });

    // 开启分享功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShow: function() {
    // 从全局变量获取是否显示横幅
    const app = getApp();
    this.setData({
      showBanner: app.globalData.showBanner
    });
  },
  
  onBannerClose: function() {
    // 更新全局变量
    const app = getApp();
    app.globalData.showBanner = false;
    
    this.setData({
      showBanner: false
    });
  },

  goToDetail: function(e) {
    const questionId = e.currentTarget.dataset.questionId;
    wx.navigateTo({
      url: '/pages/detail/detail?categoryKey=' + this.data.category.key + '&questionId=' + questionId
    });
  },

  // 分享给朋友
  onShareAppMessage: function() {
    return {
      title: this.data.category.name + ' - ' + this.data.category.description,
      path: '/pages/category/category?key=' + this.data.category.key,
      imageUrl: this.data.category.icon
    };
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: this.data.category.name + ' - ' + this.data.category.description,
      query: 'key=' + this.data.category.key,
      imageUrl: this.data.category.icon
    };
  }
}); 