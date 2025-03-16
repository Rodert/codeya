const storage = require('../../utils/storage.js');
const pointsDb = require('../../data/points.js');
const db = require('../../data/db.js');

// 激励视频广告实例
let videoAd = null;

Page({
  data: {
    hasUserInfo: false,
    showBanner: true,
    showFeedbackSheet: false,
    showEncourageSheet: false,
    appVersion: '', // 应用版本号
    statistics: {
      points: 0,
      studyDays: 0,
      totalQuestions: 0
    },
    functionList: [
      {
        id: 'history',
        name: '学习历史'
      },
      {
        id: 'points',
        name: '我的积分'
      },
      {
        id: 'games',
        name: '游戏轻松一刻'
      },
      {
        id: 'encourage',
        name: '鼓励开发者'
      },
      {
        id: 'feedback',
        name: '意见反馈'
      },
      {
        id: 'clearData',
        name: '清除所有数据',
        icon: '⚠️'
      }
    ]
  },

  onLoad() {
    // 检查是否已有用户信息
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        hasUserInfo: true
      });
    }
    // 加载统计数据
    this.loadStatistics();
    
    // 设置应用版本号（从全局获取）
    const app = getApp();
    this.setData({
      appVersion: app.globalData.version
    });
    
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    // 初始化激励视频广告
    this.initRewardedVideoAd();
  },
  
  // 初始化激励视频广告
  initRewardedVideoAd() {
    // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
    // 在页面中定义激励视频广告
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-3bcf13ec62b2b6f3'
      });
      
      videoAd.onLoad(() => {
        console.log('激励视频广告加载成功');
      });
      
      videoAd.onError((err) => {
        console.error('激励视频广告加载失败', err);
        wx.showToast({
          title: '广告加载失败，请稍后再试',
          icon: 'none',
          duration: 2000
        });
      });
      
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          wx.showToast({
            title: '感谢您为开发者贡献的五星好评！',
            icon: 'success',
            duration: 2000
          });
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '完整观看广告才能给开发者好评',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },
  
  // 显示激励视频广告
  showRewardedVideoAd() {
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.error('激励视频广告显示失败', err);
            wx.showToast({
              title: '广告显示失败，请稍后再试',
              icon: 'none',
              duration: 2000
            });
          });
      });
    } else {
      wx.showToast({
        title: '广告组件不存在，请稍后再试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onShow() {
    // 每次显示页面时更新统计数据
    this.loadStatistics();
    
    // 从全局变量获取是否显示横幅
    const app = getApp();
    this.setData({
      showBanner: app.globalData.showBanner
    });
    
    // 如果横幅显示，设置5秒后自动关闭
    if (this.data.showBanner) {
      setTimeout(() => {
        // 更新全局变量
        app.globalData.showBanner = false;
        
        this.setData({
          showBanner: false
        });
      }, 5000); // 5秒后自动关闭
    }
  },

  getUserInfo(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.setData({
        hasUserInfo: true
      });
    }
  },

  loadStatistics() {
    this.setData({
      statistics: {
        days: db.getStudyDays(),
        questions: db.getTotalQuestions(),
        points: db.getTotalPoints()
      }
    });
  },

  handleFunctionClick(e) {
    const id = e.currentTarget.dataset.id;
    
    switch(id) {
      case 'history':
        wx.navigateTo({
          url: '/pages/history/history',
        });
        break;
      case 'points':
        wx.navigateTo({
          url: '/pages/points/points',
        });
        break;
      case 'games':
        wx.navigateTo({
          url: '/pages/games/games',
        });
        break;
      case 'encourage':
        this.setData({
          showEncourageSheet: true
        });
        break;
      case 'feedback':
        this.setData({
          showFeedbackSheet: true
        });
        break;
      case 'clearData':
        wx.showModal({
          title: '确认清除数据',
          content: '确定要清除所有数据吗？这将重置您的积分、鸭屎和游戏进度。此操作不可撤销！',
          confirmColor: '#e74c3c',
          success: (res) => {
            if (res.confirm) {
              // 二次确认
              wx.showModal({
                title: '最终确认',
                content: '您真的确定要清除所有数据吗？此操作执行后无法恢复！',
                confirmText: '确定清除',
                confirmColor: '#e74c3c',
                cancelText: '取消',
                success: (secondRes) => {
                  if (secondRes.confirm) {
                    // 显示加载中
                    wx.showLoading({
                      title: '正在清除数据...',
                      mask: true
                    });
                    
                    // 延迟执行，显示动画效果
                    setTimeout(() => {
                      const result = db.clearAllUserData();
                      
                      // 隐藏加载中
                      wx.hideLoading();
                      
                      if (result.success) {
                        wx.showToast({
                          title: '数据已清除',
                          icon: 'success',
                          duration: 2000
                        });
                        // 刷新页面数据
                        this.loadStatistics();
                        // 更新用户信息显示
                        this.setData({
                          hasUserInfo: false
                        });
                      } else {
                        wx.showToast({
                          title: '清除失败',
                          icon: 'error',
                          duration: 2000
                        });
                        console.error('清除数据失败:', result.error);
                      }
                    }, 1000); // 延迟1秒执行
                  }
                }
              });
            }
          }
        });
        break;
    }
  },

  onFeedbackSheetClose() {
    this.setData({
      showFeedbackSheet: false
    });
  },
  
  onEncourageSheetClose() {
    this.setData({
      showEncourageSheet: false
    });
  },
  
  handleEncourageOption(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({
      showEncourageSheet: false
    });
    
    switch(option) {
      case 'donate':
        wx.showModal({
          title: '打赏提示',
          content: '谢谢股东支持，打赏没开放',
          showCancel: false,
          confirmText: '我知道了'
        });
        break;
      case 'share':
        // 显示分享选项提示
        wx.showActionSheet({
          itemList: ['分享给好友', '分享到朋友圈'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 分享给好友
              wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage']
              });
              // 触发分享事件
              setTimeout(() => {
                wx.showToast({
                  title: '请点击右上角"..."分享',
                  icon: 'none',
                  duration: 2000
                });
              }, 300);
            } else if (res.tapIndex === 1) {
              // 分享到朋友圈
              wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareTimeline']
              });
              // 触发分享事件
              setTimeout(() => {
                wx.showToast({
                  title: '请点击右上角"..."分享到朋友圈',
                  icon: 'none',
                  duration: 2000
                });
              }, 300);
            }
          }
        });
        break;
      case 'rate':
        // 显示激励视频广告，观看后给予五星好评
        wx.showModal({
          title: '给开发者五星好评',
          content: '观看一个短视频广告，即可为开发者贡献五星好评支持',
          confirmText: '观看广告',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.showRewardedVideoAd();
            }
          }
        });
        break;
    }
  },

  handleContact(e) {
    console.log('联系客服', e);
    // 关闭底部弹出框
    this.setData({
      showFeedbackSheet: false
    });
    
    // 这里可以添加联系客服的统计或其他逻辑
    wx.showToast({
      title: '正在连接客服...',
      icon: 'loading',
      duration: 1000
    });
  },

  // 分享到微信好友
  onShareAppMessage: function() {
    return {
      title: '编程鸭 - 让编程学习更简单',
      path: '/pages/home/home',
      imageUrl: '/images/share_cover.png'
    };
  },
  
  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: '编程鸭 - 让编程学习更简单',
      query: '',
      imageUrl: '/images/share_cover.png'
    };
  },
  
  // 点击分享按钮
  onShareTap: function() {
    // 这里只记录用户点击了分享按钮
    // 实际的积分添加在用户成功分享后处理
    console.log('用户点击了分享按钮');
    
    // 由于微信小程序限制，无法直接获知用户是否成功分享
    // 所以我们假设用户点击分享按钮后就成功分享了
    setTimeout(() => {
      const result = db.addSharePoints();
      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success',
          duration: 2000
        });
        
        // 刷新积分显示
        this.loadStatistics();
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration: 2000
        });
      }
    }, 1500); // 延迟1.5秒，模拟用户分享完成的时间
  },

  // 处理横幅关闭事件
  onBannerClose: function() {
    // 更新全局变量
    const app = getApp();
    app.globalData.showBanner = false;
    
    this.setData({
      showBanner: false
    });
  },

  // 预览二维码
  previewQrcode: function() {
    wx.previewImage({
      urls: ['/images/qrcode.jpg'],
      current: '/images/qrcode.jpg'
    });
  },

  // 清除所有用户数据
  clearAllUserData() {
    const result = db.clearAllUserData();
    
    if (result.success) {
      // 刷新统计数据
      this.loadStatistics();
      
      wx.showToast({
        title: '数据已清除',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 2000
      });
    }
  }
});
