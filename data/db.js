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

module.exports = {
  getCategories,
  getQuestionsByCategory,
  getQuestionById,
  getTotalPoints,
  getQuestionPoints,
  addPoints
}
