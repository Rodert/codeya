// 加载数据
const categoriesData = require('./categories.js')
const questionsData = require('./questions.js')
const pointsData = require('./points.js')

// 获取所有类别
function getCategories() {
  return categoriesData.categories
}

// 获取指定类别的所有题目
function getQuestionsByCategory(categoryKey) {
  console.log('Getting questions for category:', categoryKey) // 添加日志
  const questions = questionsData.questions[categoryKey] || []
  console.log('Found questions:', questions) // 添加日志
  return questions
}

// 获取指定题目
function getQuestionById(categoryKey, questionId) {
  const questions = getQuestionsByCategory(categoryKey)
  return questions.find(q => q.id === questionId)
}

// 获取用户总积分
function getTotalPoints() {
  return pointsData.totalPoints || 0
}

// 获取题目的积分记录
function getQuestionPoints(questionId) {
  return pointsData.questionPoints[questionId] || 0
}

// 添加积分
function addPoints(questionId) {
  // 如果这道题已经获得过积分，返回false
  if (pointsData.questionPoints[questionId]) {
    return false
  }

  const question = Object.values(questionsData.questions)
    .flat()
    .find(q => q.id === questionId)

  if (!question) {
    return false
  }

  // 根据难度给予不同的积分
  const points = {
    '简单': 1,
    '中等': 2,
    '困难': 3
  }[question.difficulty] || 1

  // 更新积分
  pointsData.totalPoints = (pointsData.totalPoints || 0) + points
  pointsData.questionPoints[questionId] = points

  return true
}

// 添加分享积分
function addSharePoints() {
  // 固定给予6积分
  const sharePoints = 6
  
  // 获取当前日期作为key前缀，用于记录每天的分享次数
  const today = new Date().toISOString().split('T')[0]
  const shareKeyPrefix = 'share_' + today + '_'
  
  // 检查今天已经分享了多少次
  let shareCount = 0
  for (let i = 1; i <= 5; i++) {
    const shareKey = shareKeyPrefix + i
    if (pointsData.questionPoints[shareKey]) {
      shareCount++
    }
  }
  
  // 如果今天已经分享了5次，返回false
  if (shareCount >= 5) {
    return {
      success: false,
      message: '今天的分享次数已用完，明天再来吧！'
    }
  }
  
  // 当前分享是第几次
  const currentShareNumber = shareCount + 1
  const shareKey = shareKeyPrefix + currentShareNumber
  
  // 更新积分
  pointsData.totalPoints = (pointsData.totalPoints || 0) + sharePoints
  pointsData.questionPoints[shareKey] = sharePoints
  
  return {
    success: true,
    points: sharePoints,
    message: `第${currentShareNumber}/5次分享，获得${sharePoints}积分！`,
    remainingShares: 5 - currentShareNumber
  }
}

module.exports = {
  getCategories,
  getQuestionsByCategory,
  getQuestionById,
  getTotalPoints,
  getQuestionPoints,
  addPoints,
  addSharePoints
}
