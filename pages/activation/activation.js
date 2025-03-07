Page({
  data: {
    bannerList: [
      '/images/logo/codeya_logo1.jpg',
      '/images/activation/ideajihuoma.jpg',
      '/images/activation/intellij-480x300.jpg',
      '/images/activation/phpstorm-480x300.jpg',
      '/images/activation/pycharm-480x300.jpg',
      '/images/activation/tongyong.jpg',
      '/images/activation/webstorm-480x300.jpg',
      '/images/logo/codeya_logo2.jpg',
      '/images/logo/codeya_logo3.jpg'
    ],
    description: '请复制下方激活码完成激活，开启您的学习之旅。(激活码从官网购买，仅供学习和交流)\n\n激活码每日更新，如果失效了，第二天会更新。\n\n等不及本页正版激活码更新的兄弟，可以联系客服用永久激活，资源来源于网络，仅供学习交流使用。',
    activationCode: '2L2BY8USBJ-eyJsaWNlbnNlSWQiOiIyTDJCWThVU0JKIiwibGljZW5zZWVOYW1lIjoi5rC45LmF5Zyw5Z2AIHd3d8K3YWppaHVvwrdjb20iLCJsaWNlbnNlZVR5cGUiOiJQRVJTT05BTCIsImFzc2lnbmVlTmFtZSI6IiIsImFzc2lnbmVlRW1haWwiOiIiLCJsaWNlbnNlUmVzdHJpY3Rpb24iOiIiLCJjaGVja0NvbmN1cnJlbnRVc2UiOmZhbHNlLCJwcm9kdWN0cyI6W3siY29kZSI6IkdPIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSUzAiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRNIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJDTCIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUlNVIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSU0MiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUEMiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRTIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSRCIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUUEiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlJDIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSU0YiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUk0iLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IklJIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJEUE4iLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRCIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJEQyIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUFMiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlJSIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSU1YiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiV1MiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlBTSSIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQQ1dNUCIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJBSUwiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlJTIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IkRQIiwicGFpZFVwVG8iOiIyMDI1LTA0LTA2IiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsInBhaWRVcFRvIjoiMjAyNS0wNC0wNiIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQUlIiLCJwYWlkVXBUbyI6IjIwMjUtMDQtMDYiLCJleHRlbmRlZCI6dHJ1ZX1dLCJtZXRhZGF0YSI6IjAyMjAyNTAzMDdQUEFNMDAwMDA1QSIsImhhc2giOiI2NzM0ODExNS8wOjUxNTk1MDQzMCIsImdyYWNlUGVyaW9kRGF5cyI6NywiYXV0b1Byb2xvbmdhdGVkIjpmYWxzZSwiaXNBdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJ0cmlhbCI6ZmFsc2UsImFpQWxsb3dlZCI6dHJ1ZX0=-FjdUXQSYnguQd6qRDzMxVhASUuCMlCB49TuV6d34zrd8rX4gGS5dImGg0DTthlP/28a+YHNM+qK5sbFTPpUcnyl2uGCNmwORl6hoFxta4qL2doqoQx1mJ9kXfA7U0wdjzMoyr04l6gcTYpi6HfJCZIvijIVFDsHnoZwwSBVKiZhgiytZ7Upl1s4m7JQ769hcGCra3NvgjLyQIgle5IPgQfl92supnQgf+3tMHIG5J1MdYLFa0InpsOJlZieFhoHI29gCftQNhVxTdDlVBnsD5EvE91Z34LK5natjdfQeQXwEWnyjbjOVToftAv3krlADtsBGy8SCEPBiU/fwq4axrw==-MIIETDCCAjSgAwIBAgIBETANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTI0MDkyMDEyMTEyN1oXDTI2MDkyMjEyMTEyN1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyNDA5MjAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7SH/XcUoMwkDi8JJPzXWWHWFdOZdrP2Dqkz2W8iUi650cwz2vdPEd0tMzosLAj7ifkFEHUyiuEcL//q9d9Op7ZsV23lpPXX8tFMLFwugoQ9D8jDLT/XP9pp/YukWkKF5jpNbaCvsVQkDdYkArBkYvhH3aN4v9BkEsXahfgLLOPe4IG2FDJNf9R4to9V1vt+m2UVJB0zV4a/sVMKUZLgqKmKKKOKoLrE3OjBlZlb+Q0z2N5dsW0hDEVRFGmBUAbHN/mp44MMMvEIFKfoLIGpgic92P2O6uFh75PI7mcultL6yuR48ajErx8CjjQEGOSnoq/8hD+yVE+6GW2gJa2CPvAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUb5NERj05GyNerQ/Mjm9XH8HXtLIwSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBALq6VfVUjmPI3N/w0RYoPGFYUieCfRO0zVvD1VYHDWsN3F9buVsdudhxEsUb8t7qZPkDKTOB6DB+apgt2ZdKwok8S0pwifwLfjHAhO3b+LUQaz/VmKQW8gTOS5kTVcpM0BY7UPF8cRBqxMsdUfm5ejYk93lBRPBAqntznDY+DNc9aXOldFiACyutB1/AIh7ikUYPbpEIPZirPdAahroVvfp2tr4BHgCrk9z0dVi0tk8AHE5t7Vk4OOaQRJzy3lST4Vv6Mc0+0z8lNa+Sc3SVL8CrRtnTAs7YpD4fpI5AFDtchNrgFalX+BZ9GLu4FDsshVI4neqV5Jd5zwWPnwRuKLxsCO/PB6wiBKzdapQBG+P9z74dQ0junol+tqxd7vUV/MFsR3VwVMTndyapIS+fMoe+ZR5g+y44R8C7fXyVE/geg+JXQKvRwS0C5UpnS5FcGk+61b0e4U7pwO20RlwhEFHLSaP61p2TaVGo/TQtT/fWmrtV+HegAv9P3X3Se+xIVtJzQsk8QrB/w52IB3FKiAKl/KRn1egbMIs4uoNAkqNZ9Ih2P1NpiQnONFmkiAgeynJ+0FPykKdJQbV3Mx44jkaHIif4aFReTsYX1WUBNu/QerZRjn4FVSHRaZPSR5Oi82Wz0Nj7IY9ocTpLnXFrqkb/Kt3S6B9s2Kol3Lr1ElYA',
    showBanner: true // 控制横幅显示
  },

  onLoad: function() {
    // 页面加载时执行的逻辑
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
  },
  
  onShow: function() {
    // 从全局变量获取是否显示横幅
    const app = getApp();
    this.setData({
      showBanner: app.globalData.showBanner
    });
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

  copyActivationCode: function() {
    const { activationCode } = this.data;
    wx.setClipboardData({
      data: activationCode,
      success: function() {
        wx.showToast({
          title: '激活码已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
})