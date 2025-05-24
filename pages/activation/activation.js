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
    hint: '免费激活码需要更新请留言',
    activationCode: '2CAZF8VQ4C-eyJsaWNlbnNlSWQiOiIyQ0FaRjhWUTRDIiwibGljZW5zZWVOYW1lIjoi5rC45LmF5Zyw5Z2AIHd3d8K3YWppaHVvwrdjb20iLCJsaWNlbnNlZVR5cGUiOiJQRVJTT05BTCIsImFzc2lnbmVlTmFtZSI6IiIsImFzc2lnbmVlRW1haWwiOiIiLCJsaWNlbnNlUmVzdHJpY3Rpb24iOiIiLCJjaGVja0NvbmN1cnJlbnRVc2UiOmZhbHNlLCJwcm9kdWN0cyI6W3siY29kZSI6IkdPIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSUzAiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRNIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJDTCIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUlNVIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSU0MiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUEMiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRTIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJSRCIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUkMiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlJTRiIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJSTSIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiSUkiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRQTiIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiREIiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IkRDIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJQUyIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUlIiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlJTViIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJXUyIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUFNJIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBDV01QIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IkFJTCIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUlMiLCJwYWlkVXBUbyI6IjIwMjUtMDYtMjEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFJSIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IkRQIiwicGFpZFVwVG8iOiIyMDI1LTA2LTIxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsInBhaWRVcFRvIjoiMjAyNS0wNi0yMSIsImV4dGVuZGVkIjp0cnVlfV0sIm1ldGFkYXRhIjoiMDIyMDI1MDUyMlBQQU0wMDAwMDVBIiwiaGFzaCI6IjcwNDE4OTk4LzA6OTQ3MDQ3Mzg2IiwiZ3JhY2VQZXJpb2REYXlzIjo3LCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2UsInRyaWFsIjpmYWxzZSwiYWlBbGxvd2VkIjp0cnVlfQ==-P0f+va/IpdxjasYQkhmZO4VTLawI3A8zKbppPOJet1bHgL6dx8WO7YxfsN2H+1wYpozCSxaaMGB+8PqslHdMeiQCHwl6zqVsBY3n6fSccAjT+nt+wMZQWrrq7RQ51oBF605eJL5GvyD9YC2OFbfGulZnj0pt3hfDBKP9qtfw9JPSyLVpcrZlLyfPqLy1wPt6wcoBSMOBOt0x6W12s/nJrjgDZtUaLoMyDBj2c6qs878mBquhh/h1IlevKIRqVHwbxQ0v/6rssXEIHnRRXItlPoY1K9aq6BVwhznrQLnaD4lcaKRbOrNUOmCc+9iRN4kFBXrFRw06cag+beiDESOeoA==-MIIETDCCAjSgAwIBAgIBETANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTI0MDkyMDEyMTEyN1oXDTI2MDkyMjEyMTEyN1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyNDA5MjAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7SH/XcUoMwkDi8JJPzXWWHWFdOZdrP2Dqkz2W8iUi650cwz2vdPEd0tMzosLAj7ifkFEHUyiuEcL//q9d9Op7ZsV23lpPXX8tFMLFwugoQ9D8jDLT/XP9pp/YukWkKF5jpNbaCvsVQkDdYkArBkYvhH3aN4v9BkEsXahfgLLOPe4IG2FDJNf9R4to9V1vt+m2UVJB0zV4a/sVMKUZLgqKmKKKOKoLrE3OjBlZlb+Q0z2N5dsW0hDEVRFGmBUAbHN/mp44MMMvEIFKfoLIGpgic92P2O6uFh75PI7mcultL6yuR48ajErx8CjjQEGOSnoq/8hD+yVE+6GW2gJa2CPvAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUb5NERj05GyNerQ/Mjm9XH8HXtLIwSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBALq6VfVUjmPI3N/w0RYoPGFYUieCfRO0zVvD1VYHDWsN3F9buVsdudhxEsUb8t7qZPkDKTOB6DB+apgt2ZdKwok8S0pwifwLfjHAhO3b+LUQaz/VmKQW8gTOS5kTVcpM0BY7UPF8cRBqxMsdUfm5ejYk93lBRPBAqntznDY+DNc9aXOldFiACyutB1/AIh7ikUYPbpEIPZirPdAahroVvfp2tr4BHgCrk9z0dVi0tk8AHE5t7Vk4OOaQRJzy3lST4Vv6Mc0+0z8lNa+Sc3SVL8CrRtnTAs7YpD4fpI5AFDtchNrgFalX+BZ9GLu4FDsshVI4neqV5Jd5zwWPnwRuKLxsCO/PB6wiBKzdapQBG+P9z74dQ0junol+tqxd7vUV/MFsR3VwVMTndyapIS+fMoe+ZR5g+y44R8C7fXyVE/geg+JXQKvRwS0C5UpnS5FcGk+61b0e4U7pwO20RlwhEFHLSaP61p2TaVGo/TQtT/fWmrtV+HegAv9P3X3Se+xIVtJzQsk8QrB/w52IB3FKiAKl/KRn1egbMIs4uoNAkqNZ9Ih2P1NpiQnONFmkiAgeynJ+0FPykKdJQbV3Mx44jkaHIif4aFReTsYX1WUBNu/QerZRjn4FVSHRaZPSR5Oi82Wz0Nj7IY9ocTpLnXFrqkb/Kt3S6B9s2Kol3Lr1ElYA',
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