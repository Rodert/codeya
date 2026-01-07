// 鸭屎数据管理模块
let duckPoopData = {
  totalPoop: 0,
  gamePoop: {}
};

// 从本地存储加载鸭屎数据
function loadDuckPoopData() {
  try {
    const savedPoop = wx.getStorageSync('userDuckPoop');
    if (savedPoop) {
      duckPoopData = JSON.parse(savedPoop);
    }
  } catch (e) {
    console.error('Failed to load duck poop data:', e);
    // 加载失败时使用默认数据
    duckPoopData = {
      totalPoop: 0,
      gamePoop: {}
    };
  }
}

// 保存鸭屎数据到本地存储
function saveDuckPoopData() {
  try {
    wx.setStorageSync('userDuckPoop', JSON.stringify(duckPoopData));
  } catch (e) {
    console.error('Failed to save duck poop data:', e);
    // 同步保存失败时尝试异步保存
    try {
      wx.setStorage({
        key: 'userDuckPoop',
        data: JSON.stringify(duckPoopData),
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
  loadDuckPoopData();
} catch (e) {
  console.error('Initial duck poop load failed:', e);
}

module.exports = {
  get totalPoop() {
    return duckPoopData.totalPoop;
  },
  get gamePoop() {
    return duckPoopData.gamePoop;
  },
  set totalPoop(value) {
    duckPoopData.totalPoop = value;
    saveDuckPoopData();
  },
  set gamePoop(value) {
    duckPoopData.gamePoop = value;
    saveDuckPoopData();
  }
}; 