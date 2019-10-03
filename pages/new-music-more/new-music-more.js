// pages/new-music-more/new-music-more.js
import {
  getMusicUrl
} from '../../service/musicUrl.js'

import {
  debounce
} from "../../utils/debounce.js"

let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();
let app = getApp();

Page({
  data: {
    newMusic: [],
    playIndex: -1
  },
  onLoad: function(options) {
    // this._getNewMusic();

    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on('newMusicData', data => {
      this.setData({
        newMusic: data
      })
    })
  },
  onShow: function() {
    this.setData({
      playIndex: app.globalData.playIndex
    })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let songIds = []
    this.data.newMusic.forEach(list => {
      let id = list.songId;
      songIds.push(id)
    })
    let songId = songIds.join(',')
    this._getMusicUrl(songId)
  },

  // -----------事件处理函数-----------
  handlePlay(e) {
    let index = e.currentTarget.dataset.index;
    if (app.globalData.index !== index) {
      app.globalData.index = index;
      app.globalData.isPlay = false;

      innerAudioContext.src = this.data.newMusic[index].url;

      backgroundAudioManager.title = this.data.newMusic[index].songName;
      backgroundAudioManager.coverImgUrl = this.data.newMusic[index].image;
      backgroundAudioManager.singer = this.data.newMusic[index].singer;
      backgroundAudioManager.src = this.data.newMusic[index].url;
    }
    if (!(backgroundAudioManager.src === this.data.newMusic[index].url)) {
      innerAudioContext.src = this.data.newMusic[index].url;
      backgroundAudioManager.src = this.data.newMusic[index].url;

      app.globalData.isPlay = false;
    }

    if (!app.globalData.isPlay) {
      backgroundAudioManager.play();
    } else {
      backgroundAudioManager.pause();
    }

    backgroundAudioManager.onPlay(() => {
      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.playIndex = index;
      this.setData({
        playIndex: app.globalData.playIndex
      })
    })

    backgroundAudioManager.onPause(() => {
      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.playIndex = -1;
      this.setData({
        playIndex: -1
      })
    })

    backgroundAudioManager.onStop(() => {
      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.playIndex = -1;
      this.setData({
        playIndex: -1
      })
    })
  },
  // imageLoad: debounce(function() {
  //   this.data.newMusic.forEach(list => {
  //     let id = list.songId;
  //     this._getMusicUrl(id)
  //   })
  // }, 500),

  // -----------网络请求-----------
  // _getNewMusic() {
  //   getNewMusic().then(res => {
  //     const data = res.data.data;
  //     for (let i = 0; i < 50; i++) {
  //       let newMusicItem = {};
  //       newMusicItem.songId = data[i].id;
  //       newMusicItem.img = data[i].album.picUrl;
  //       newMusicItem.songName = data[i].name;
  //       newMusicItem.singerId = data[i].artists[0].id;
  //       newMusicItem.singer = data[i].artists[0].name;
  //       this.data.newMusic.push(newMusicItem)
  //       this.setData({
  //         newMusic: this.data.newMusic
  //       })
  //     }
  //   }).catch(err => {
  //     console.error(err)
  //   })
  // },
  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      for (let i = 0; i < this.data.newMusic.length; i++) {
        this.data.newMusic[i].url = data.find(item => item.id === this.data.newMusic[i].songId).url;
      }
      this.setData({
        newMusic: this.data.newMusic
      })

      wx.hideLoading()
    }).catch(err => {
      console.error(err)
    })
  }
})