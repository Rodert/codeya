const db = require('../../data/db.js');

Page({
  data: {
    categoryKey: null,
    questionId: null,
    question: null,
    prevQuestion: null,
    nextQuestion: null,
    showAnswer: false,
    points: 0,
    hasEarnedPoints: false,
    md: {} // md 内容，格式示例：
    // ## 渲染 code 方法
    //
    // ```html
    // <div>示例代码</div>
    // ```
  },

  onLoad: function(options) {
    // 分享朋友圈设置
    wx.showShareMenu({
        withShareTicket:true,
        menus:['shareAppMessage','shareTimeline']
    })

    console.log('Detail page options:', options);
    const categoryKey = options.categoryKey;
    const questionId = parseInt(options.questionId);

    this.setData({ 
      categoryKey: categoryKey,
      questionId: questionId,
      points: db.getTotalPoints()
    });
    
    this.loadQuestionData();
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

  loadQuestionData: function() {
    console.log('Loading question data for category:', this.data.categoryKey, 'id:', this.data.questionId);
    
    // 获取当前类别的所有题目
    const questions = db.getQuestionsByCategory(this.data.categoryKey);
    
    // 找到当前题目的索引
    let currentIndex = -1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id === this.data.questionId) {
        currentIndex = i;
        break;
      }
    }
    
    if (currentIndex === -1) {
      console.error('Question not found:', this.data.questionId);
      wx.showToast({
        title: '题目不存在',
        icon: 'none'
      });
      return;
    }

    // 获取当前题目、上一题和下一题
    const currentQuestion = questions[currentIndex];
    const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
    const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

    // 检查是否已经获得过积分
    const hasEarnedPoints = db.getQuestionPoints(this.data.questionId) > 0;

    console.log('Current question:', currentQuestion); // 添加日志

    // 使用 towxml 转换 markdown 内容
    const app = getApp();
    try {
      if (currentQuestion && currentQuestion.md) {
        console.log('Converting markdown content...');
        // 确保md内容是字符串类型
        const mdContent = typeof currentQuestion.md === 'string' 
          ? currentQuestion.md 
          : JSON.stringify(currentQuestion.md);
        
        currentQuestion.md = app.towxml(mdContent, 'markdown', {
          theme: 'light',
          events: {
            tap: (e) => {
              // 处理点击事件
              console.log('Tapped element:', e);
            }
          }
        });
        console.log('Markdown conversion successful');
      } else {
        console.warn('No markdown content found for question:', this.data.questionId);
        // 设置一个默认的空markdown对象，避免渲染错误
        currentQuestion.md = app.towxml('', 'markdown', { theme: 'light' });
      }
    } catch (error) {
      console.error('Error converting markdown:', error);
      // 设置一个默认的空markdown对象，避免渲染错误
      if (currentQuestion) {
        currentQuestion.md = app.towxml('*内容加载失败，请稍后再试*', 'markdown', { theme: 'light' });
      }
      
      wx.showToast({
        title: '内容加载失败',
        icon: 'none',
        duration: 2000
      });
    }

    // 确保currentQuestion存在且有效
    if (!currentQuestion) {
      currentQuestion = {
        title: '题目不存在或已被删除',
        difficulty: '简单',
        viewCount: 0,
        md: app.towxml('*题目不存在或已被删除*', 'markdown', { theme: 'light' })
      };
    }

    this.setData({
      question: currentQuestion,
      prevQuestion: prevQuestion,
      nextQuestion: nextQuestion,
      hasEarnedPoints: hasEarnedPoints
    });
  },

  toggleAnswer: function() {
    const showAnswer = this.data.showAnswer;
    const questionId = this.data.questionId;
    const hasEarnedPoints = this.data.hasEarnedPoints;
    
    // 如果是第一次查看答案，并且还没有获得过积分
    if (!showAnswer && !hasEarnedPoints) {
      // 添加积分
      const success = db.addPoints(questionId);
      
      if (success) {
        // 更新积分显示
        this.setData({
          points: db.getTotalPoints(),
          hasEarnedPoints: true
        });
        
        // 显示积分提示
        wx.showToast({
          title: '获得积分！',
          icon: 'success'
        });
      }
    }

    this.setData({
      showAnswer: !showAnswer
    });
  },

  goToPrev: function() {
    if (this.data.prevQuestion) {
      wx.redirectTo({
        url: '/pages/detail/detail?categoryKey=' + this.data.categoryKey + '&questionId=' + this.data.prevQuestion.id
      });
    }
  },

  goToNext: function() {
    if (this.data.nextQuestion) {
      wx.redirectTo({
        url: '/pages/detail/detail?categoryKey=' + this.data.categoryKey + '&questionId=' + this.data.nextQuestion.id
      });
    }
  },

  onShareTimeline: function() {
    return {
      title: this.data.question.title,
      query: `categoryKey=${this.data.categoryKey}&questionId=${this.data.questionId}`
    }
  }
});
