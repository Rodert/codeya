// 存储键名
var STORAGE_KEYS = {
  POINTS: 'user_points',
  STUDY_HISTORY: 'study_history',
  STUDY_DAYS: 'study_days',
  LAST_STUDY_DATE: 'last_study_date'
};

// 获取用户积分
function getPoints() {
  return wx.getStorageSync(STORAGE_KEYS.POINTS) || 0;
}

// 增加积分
function addPoints(points) {
  var currentPoints = getPoints();
  var newPoints = currentPoints + points;
  wx.setStorageSync(STORAGE_KEYS.POINTS, newPoints);
  return newPoints;
}

// 获取学习历史
function getStudyHistory() {
  return wx.getStorageSync(STORAGE_KEYS.STUDY_HISTORY) || [];
}

// 添加学习记录
function addStudyRecord(questionId) {
  var history = getStudyHistory();
  var now = new Date();
  
  // 添加学习记录
  history.push({
    questionId: questionId,
    timestamp: now.getTime(),
    date: now.toISOString()
  });
  
  // 只保留最近100条记录
  if (history.length > 100) {
    history.shift();
  }
  
  wx.setStorageSync(STORAGE_KEYS.STUDY_HISTORY, history);
  
  // 更新学习天数
  updateStudyDays(now);
  
  // 每道题可以获得10积分
  return addPoints(10);
}

// 更新学习天数
function updateStudyDays(now) {
  var lastStudyDate = wx.getStorageSync(STORAGE_KEYS.LAST_STUDY_DATE);
  var currentDate = now.toISOString().split('T')[0];
  
  if (lastStudyDate !== currentDate) {
    var studyDays = wx.getStorageSync(STORAGE_KEYS.STUDY_DAYS) || 0;
    wx.setStorageSync(STORAGE_KEYS.STUDY_DAYS, studyDays + 1);
    wx.setStorageSync(STORAGE_KEYS.LAST_STUDY_DATE, currentDate);
  }
}

// 获取学习天数
function getStudyDays() {
  return wx.getStorageSync(STORAGE_KEYS.STUDY_DAYS) || 0;
}

// 获取用户统计信息
function getStatistics() {
  return {
    points: getPoints(),
    studyDays: getStudyDays(),
    totalQuestions: getStudyHistory().length
  };
}

module.exports = {
  getPoints: getPoints,
  addPoints: addPoints,
  getStudyHistory: getStudyHistory,
  addStudyRecord: addStudyRecord,
  getStudyDays: getStudyDays,
  getStatistics: getStatistics
};
