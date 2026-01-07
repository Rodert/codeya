/*
 * @Author: JavaPub
 * @Date: 2025-02-26 11:41:14
 * @LastEditors: your name
 * @LastEditTime: 2025-03-14 10:00:00
 * @Description: Here is the JavaPub code base. Search JavaPub on the whole web.
 * @FilePath: /codeya/app.js
 */

App({
  globalData: {
    userInfo: null,
    showBanner: true, // 控制横幅显示
    version: 'v1.0.23', // 直接定义版本号
    darkMode: false // 控制深色模式
  },
  onLaunch() {
    // 展示本地存储能力
    try {
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      
      // 初始化主题模式
      const darkMode = wx.getStorageSync('darkMode') || false
      this.globalData.darkMode = darkMode
      this.updateTheme(darkMode)
    } catch (e) {
      console.error('Storage operation failed in app.js:', e)
      // 使用异步方法尝试存储
      try {
        wx.getStorage({
          key: 'logs',
          success: (res) => {
            const logs = res.data || []
            logs.unshift(Date.now())
            wx.setStorage({
              key: 'logs',
              data: logs
            })
          },
          fail: () => {
            // 如果获取失败，直接创建新的日志
            const logs = [Date.now()]
            wx.setStorage({
              key: 'logs',
              data: logs
            })
          }
        })
        
        // 异步获取主题模式
        wx.getStorage({
          key: 'darkMode',
          success: (res) => {
            this.globalData.darkMode = res.data
            this.updateTheme(res.data)
          },
          fail: () => {
            // 默认为浅色模式
            this.globalData.darkMode = false
            this.updateTheme(false)
          }
        })
      } catch (asyncError) {
        console.error('Async storage also failed:', asyncError)
      }
    }

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
  
  // 更新主题
  updateTheme(darkMode) {
    // 设置系统级别深色模式
    if (wx.setWindowProperties) {
      wx.setWindowProperties({
        backgroundColor: darkMode ? '#222222' : '#f8f8f8',
        backgroundColorTop: darkMode ? '#222222' : '#f8f8f8',
        backgroundColorBottom: darkMode ? '#222222' : '#f8f8f8'
      })
    }
    
    // 更新系统导航栏颜色
    if (wx.setNavigationBarColor) {
      wx.setNavigationBarColor({
        frontColor: darkMode ? '#ffffff' : '#000000',
        backgroundColor: darkMode ? '#222222' : '#ffffff'
      })
    }
    
    // 尝试为当前页面添加深色模式类
    try {
      const pages = getCurrentPages()
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1]
        if (currentPage && currentPage.pageLifetimes) {
          wx.nextTick(() => {
            wx.createSelectorQuery()
              .select('page')
              .fields({
                node: true,
                size: true,
              })
              .exec((res) => {
                if (res && res[0] && res[0].node) {
                  if (darkMode) {
                    res[0].node.className = 'dark-mode'
                  } else {
                    res[0].node.className = ''
                  }
                }
              })
          })
        }
      }
    } catch (e) {
      console.error('Failed to update page theme:', e)
    }
  },
  
  // 切换主题模式
  toggleDarkMode() {
    const newMode = !this.globalData.darkMode
    this.globalData.darkMode = newMode
    wx.setStorageSync('darkMode', newMode)
    this.updateTheme(newMode)
    return newMode
  },

  // towxml markdown 转换工具
  towxml: require('/towxml/index')
})
