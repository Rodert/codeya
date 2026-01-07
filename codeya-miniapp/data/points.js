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
    // 加载失败时使用默认数据
    pointsData = {
      totalPoints: 0,
      questionPoints: {}
    };
  }
}

// 保存积分数据到本地存储
function savePointsData() {
  try {
    wx.setStorageSync('userPoints', JSON.stringify(pointsData));
  } catch (e) {
    console.error('Failed to save points data:', e);
    // 同步保存失败时尝试异步保存
    try {
      wx.setStorage({
        key: 'userPoints',
        data: JSON.stringify(pointsData),
        fail: (err) => {
          console.error('Async storage also failed:', err);
        }
      });
    } catch (asyncError) {
      console.error('Failed to use async storage:', asyncError);
    }
  }
}

// 初始加载数据
try {
  loadPointsData();
} catch (e) {
  console.error('Initial load failed:', e);
}

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
