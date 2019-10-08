// pages/audio/audio.js
let app = getApp();

Page({
  data: {
    audioSong: {},
    // coverOrLyric: true,
    isOpacity: true
  },
  onShow: function () {
    this.setData({
      audioSong: app.globalData.audioSong
    })
  },
  handleCoverOrLyric() {
    this.setData({
      // coverOrLyric: !this.data.coverOrLyric,
      isOpacity: !this.data.isOpacity
    })
  }
})