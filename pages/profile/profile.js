// pages/profile/profile.js
Page({
  data: {
    profileMusic: []
  },
  onShow: function (options) {
    this.setData({
      profileMusic: wx.getStorageSync('cacheMusic')
    })
  }
})