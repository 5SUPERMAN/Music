// pages/new-music-more/new-music-more.js
import {
  getNewMusic
} from "../../service/music.js"

import {
  getMusicUrl
} from '../../service/musicUrl.js'

import {
  debounce
} from "../../utils/debounce.js"

const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    newMusic: [],
    isPlay: false,
    index: 0,
    playIndex: -1
  },
  onLoad: function(options) {
    this._getNewMusic();
  },
  onShow: function() {
    this.data.newMusic.forEach(list => {
      let id = list.songId;
      this._getMusicUrl(id)
    })
  },

  // -----------事件函数-----------
  handlePlay(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.index !== index) {
      this.data.index = index;
      innerAudioContext.src = this.data.newMusic[index].url;
      this.data.isPlay = false;
      this.setData({
        playIndex: index
      })
    }
    if (!innerAudioContext.src) {
      innerAudioContext.src = this.data.newMusic[index].url;
      this.data.isPlay = false;
    }

    if (!this.data.isPlay) {
      this.data.isPlay = !this.data.isPlay;
      innerAudioContext.play();
      this.setData({
        playIndex: this.data.index
      })
    } else {
      this.data.isPlay = !this.data.isPlay;
      innerAudioContext.pause();
      this.setData({
        playIndex: -1
      })
    }
  },
  imageLoad: debounce(function() {
    this.data.newMusic.forEach(list => {
      let id = list.songId;
      this._getMusicUrl(id)
    })
  }, 500),

  // -----------网络请求-----------
  _getNewMusic() {
    getNewMusic().then(res => {
      const data = res.data.data;
      for (let i = 0; i < 50; i++) {
        let newMusicItem = {};
        newMusicItem.songId = data[i].id;
        newMusicItem.img = data[i].album.picUrl;
        newMusicItem.songName = data[i].name;
        newMusicItem.singerId = data[i].artists[0].id;
        newMusicItem.singer = data[i].artists[0].name;
        this.data.newMusic.push(newMusicItem)
        this.setData({
          newMusic: this.data.newMusic
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      this.data.newMusic.find(item => item.songId === data[0].id).url = data[0].url;
      this.setData({
        newMusic: this.data.newMusic
      })
    }).catch(err => {
      console.error(err)
    })
  }
})