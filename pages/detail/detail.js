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
    hasEarnedPoints: false
  },

  onLoad: function(options) {
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
  }
});
