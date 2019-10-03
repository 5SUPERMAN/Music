// pages/new-music-more/new-music-more.js
import {
  getMusicUrl
} from '../../service/musicUrl.js'

Page({
  data: {
    newMusic: [],
    isLoading: true
  },
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on('newMusicData', data => {
      this.setData({
        newMusic: data
      })
    })
  },
  onShow: function() {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })

    let songIds = []
    this.data.newMusic.forEach(list => {
      let id = list.songId;
      songIds.push(id)
    })
    let songId = songIds.join(',')
    this._getMusicUrl(songId)
  },

  // -----------网络请求-----------
  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      for (let i = 0; i < this.data.newMusic.length; i++) {
        this.data.newMusic[i].url = data.find(item => item.id === this.data.newMusic[i].songId).url;
      }
      this.setData({
        newMusic: this.data.newMusic
      })

      // wx.hideLoading()
      this.setData({
        isLoading: false
      })
    }).catch(err => {
      console.error(err)
    })
  }
})