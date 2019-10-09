// pages/profile/profile.js
let app = getApp();

Page({
  data: {
    tabbar: {},
    profileMusic: [],
    isClose: false
  },
  onLoad: function() {
    app.editTabbar()
  },
  onShow: function (options) {
    this.setData({
      profileMusic: wx.getStorageSync('cacheMusic')
    })
  }
})