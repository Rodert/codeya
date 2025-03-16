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
  }
}

// 保存鸭屎数据到本地存储
function saveDuckPoopData() {
  try {
    wx.setStorageSync('userDuckPoop', JSON.stringify(duckPoopData));
  } catch (e) {
    console.error('Failed to save duck poop data:', e);
  }
}

// 初始加载数据
loadDuckPoopData();

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