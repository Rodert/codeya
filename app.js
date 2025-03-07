/*
 * @Author: JavaPub
 * @Date: 2025-02-26 11:41:14
 * @LastEditors: your name
 * @LastEditTime: 2025-03-07 19:29:12
 * @Description: Here is the JavaPub code base. Search JavaPub on the whole web.
 * @FilePath: /codeya/app.js
 */
App({
  globalData: {
    userInfo: null,
    categories: [
      { id: 1, name: '技术', icon: '/images/tech.png' },
      { id: 2, name: '文学', icon: '/images/literature.png' },
      { id: 3, name: '科学', icon: '/images/science.png' },
      { id: 4, name: '艺术', icon: '/images/art.png' }
    ],
    showBanner: true // 控制横幅显示
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
    
    // 注意：横幅组件将在页面中通过WXML模板显示，不需要在这里调用
  },
  
  onShow() {
    // 每次显示小程序时设置全局变量，页面会根据这个变量决定是否显示横幅
    this.globalData.showBanner = true
  },

  // towxml markdown 转换工具
  towxml: require('/towxml/index')
})
