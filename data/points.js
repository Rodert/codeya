// 积分数据管理模块
let pointsData = {
  totalPoints: 0,
  questionPoints: {}
};

// 从本地存储加载积分数据
function loadPointsData() {
  try {
    const savedPoints = wx.getStorageSync('userPoints');
    if (savedPoints) {
      pointsData = JSON.parse(savedPoints);
    }
  } catch (e) {
    console.error('Failed to load points data:', e);
  }
}

// 保存积分数据到本地存储
function savePointsData() {
  try {
    wx.setStorageSync('userPoints', JSON.stringify(pointsData));
  } catch (e) {
    console.error('Failed to save points data:', e);
  }
}

// 初始加载数据
loadPointsData();

module.exports = {
  get totalPoints() {
    return pointsData.totalPoints;
  },
  get questionPoints() {
    return pointsData.questionPoints;
  },
  set totalPoints(value) {
    pointsData.totalPoints = value;
    savePointsData();
  },
  set questionPoints(value) {
    pointsData.questionPoints = value;
    savePointsData();
  }
};
