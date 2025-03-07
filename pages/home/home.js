Page({
  data: {
    // 页面的初始数据
    showBanner: true // 控制横幅显示
  },

  onLoad: function() {
    // 页面加载时执行
  },

  onReady: function() {
    // 页面初次渲染完成时执行
  },

  onShow: function() {
    // 页面显示时执行
    // 从全局变量获取是否显示横幅
    const app = getApp();
    this.setData({
      showBanner: app.globalData.showBanner
    });
  },

  onHide: function() {
    // 页面隐藏时执行
  },

  onUnload: function() {
    // 页面卸载时执行
  },
  
  // 处理横幅关闭事件
  onBannerClose: function() {
    // 更新全局变量
    const app = getApp();
    app.globalData.showBanner = false;
    
    this.setData({
      showBanner: false
    });
  }
})