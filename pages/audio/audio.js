// pages/audio/audio.js
let app = getApp();

Page({
  data: {
    audioSong: {}
  },
  onShow: function () {
    this.setData({
      audioSong: app.globalData.audioSong
    })
  }
})