/**
 * 主题相关工具函数
 */

/**
 * 为当前页面设置主题类
 * @param {boolean} isDarkMode - 是否为深色模式
 */
const applyThemeToPage = (isDarkMode) => {
  try {
    wx.nextTick(() => {
      wx.createSelectorQuery()
        .select('page')
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          if (res && res[0] && res[0].node) {
            if (isDarkMode) {
              res[0].node.className = 'dark-mode';
            } else {
              res[0].node.className = '';
            }
          }
        });
    });
  } catch (e) {
    console.error('Failed to apply theme to page:', e);
  }
};

/**
 * 同步全局主题设置到当前页面
 */
const syncTheme = () => {
  try {
    const app = getApp();
    const isDarkMode = app.globalData.darkMode;
    
    // 设置导航栏颜色
    wx.setNavigationBarColor({
      frontColor: isDarkMode ? '#ffffff' : '#000000',
      backgroundColor: isDarkMode ? '#222222' : '#ffffff'
    });
    
    // 应用页面主题
    applyThemeToPage(isDarkMode);
    
    return isDarkMode;
  } catch (e) {
    console.error('Failed to sync theme:', e);
    return false;
  }
};

module.exports = {
  applyThemeToPage,
  syncTheme
}; 