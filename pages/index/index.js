const db = require('../../data/db.js');

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
    recentQuestions: [],
    expandedCategoryKey: null,
    categoryQuestions: [],
    showBanner: true // 控制横幅显示
  },

  onLoad: function() {
    this.loadCategories();
    this.loadRecentQuestions();
    
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
  },
  
  onShow: function() {
    // 从全局变量获取是否显示横幅
    const app = getApp();
    this.setData({
      showBanner: app.globalData.showBanner
    });
  },
  
  // 处理横幅关闭事件
  onBannerClose: function() {
    // 更新全局变量
    const app = getApp();
    app.globalData.showBanner = false;
    
    this.setData({
      showBanner: false
    });
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

  loadRecentQuestions: function() {
    const categories = db.getCategories();
    let recentQuestions = [];
    
    // 从每个类别中获取问题
    categories.forEach(function(category) {
      const questions = db.getQuestionsByCategory(category.key);
      if (questions && questions.length > 0) {
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
        recentQuestions = recentQuestions.concat(questionsWithCategory);
      }
    });

    // 按照浏览次数排序
    recentQuestions.sort(function(a, b) {
      return b.viewCount - a.viewCount;
    });
    
    this.setData({
      recentQuestions: recentQuestions.slice(0, 5)
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
  }
});
