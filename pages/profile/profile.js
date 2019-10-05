// pages/profile/profile.js
let app = getApp();

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