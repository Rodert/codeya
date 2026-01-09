/*
 * @Author: JavaPub
 * @Date: 2025-03-07 19:18:15
 * @LastEditors: your name
 * @LastEditTime: 2025-03-14 16:41:58
 * @Description: Here is the JavaPub code base. Search JavaPub on the whole web.
 * @FilePath: /codeya/components/banner/banner.js
 */
Component({
  properties: {
    text: {
      type: String,
      value: ''  // 移除默认值，使用传入的文本
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