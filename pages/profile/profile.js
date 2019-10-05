// pages/profile/profile.js
let app = getApp();

Page({
  data: {
    profileMusic: [],
    isClose: false
  },
  onShow: function (options) {
    this.setData({
      profileMusic: wx.getStorageSync('cacheMusic')
    })
  }
})