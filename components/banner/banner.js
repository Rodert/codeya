Component({
  properties: {
    text: {
      type: String,
      value: '随时随地学编程'
    },
    duration: {
      type: Number,
      value: 0 // 0表示不自动关闭
    }
  },
  
  data: {
    show: true
  },
  
  lifetimes: {
    attached() {
      // 如果设置了持续时间，则在指定时间后自动关闭
      if (this.properties.duration > 0) {
        setTimeout(() => {
          this.closeBanner();
        }, this.properties.duration);
      }
    }
  },
  
  methods: {
    closeBanner() {
      this.setData({
        show: false
      });
      
      // 触发关闭事件
      this.triggerEvent('close');
    },
    
    showBanner() {
      this.setData({
        show: true
      });
    }
  }
}) 