App({
  globalData: {
    userInfo: null,
    categories: [
      { id: 1, name: '技术', icon: '/images/tech.png' },
      { id: 2, name: '文学', icon: '/images/literature.png' },
      { id: 3, name: '科学', icon: '/images/science.png' },
      { id: 4, name: '艺术', icon: '/images/art.png' }
    ]
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
})
