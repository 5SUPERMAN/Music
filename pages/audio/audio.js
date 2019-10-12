// pages/audio/audio.js
import {
  getLyric
} from "../../service/music.js"

let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();

Page({
  data: {
    audioSong: {},
    isOpacity: true,
    lyric: []
  },
  onLoad: function() {
    this.setData({
      audioSong: app.globalData.audioSong
    })

    this._getLyric(app.globalData.audioSong.songId);
  },
  onShow: function () {
    backgroundAudioManager.onEnded(() => {
      setTimeout(() => {
        app.globalData.time = 0;
      }, 250)
      this.setData({
        scrollTop: 0
      })

      wx.getStorage({
        key: 'cacheMusic',
        success: res => {
          let newIndex = 0
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].songId === app.globalData.audioSong.songId) {
              newIndex = i;
              break;
            }
          }
          if ((res.data.length - 1) !== newIndex) {
            this.orderPlay(res, newIndex + 1)
          } else {
            this.orderPlay(res);
          }
        },
        fail: function (err) {
          console.error(err)
        }
      })
    })
  },

  // -------------事件处理函数-------------
  handleCoverOrLyric() {
    this.setData({
      isOpacity: !this.data.isOpacity
    })
  },

  // 顺序播放
  orderPlay(res, index) {
    index = index || 0;
    const page = getCurrentPages();
    if (page.length > 0 && page[page.length - 1].route === "pages/audio/audio") {
      page[page.length - 1].setData({
        audioSong: res.data[index]
      })
    }

    app.globalData.audioSong = res.data[index];

    app.globalData.isPlay = !app.globalData.isPlay;
    app.globalData.songId = res.data[index].songId;
    app.globalData.playSong = res.data[index].songId;

    this.setData({
      isPlay: app.globalData.isPlay
    })

    innerAudioContext.src = res.data[index].url;
    backgroundAudioManager.title = res.data[index].songName;
    backgroundAudioManager.coverImgUrl = res.data[index].image;
    backgroundAudioManager.singer = res.data[index].singer;
    backgroundAudioManager.src = res.data[index].url;

    app.globalData.lastSongId = app.globalData.audioSong.songId;
    this._getLyric(app.globalData.audioSong.songId);

    backgroundAudioManager.play();
  },

  // -----------网络请求-----------
  _getLyric(id) {
    getLyric(id).then(res => {
      this.setData({
        lyric: []
      })
      if (res.data.lrc) {
        let lyrices = res.data.lrc.lyric;

        let lyricArr = lyrices.split('\n');
        lyricArr.forEach(item => {
          let playTimeArr = item.match(/\[\d{2}:\d{2}((\.|\:)(\d{2}|\d{3}))\]/g);
          let lineLyric = '';
          if (item.split(playTimeArr).length > 0) {
            lineLyric = item.split(playTimeArr);
          }
          if (playTimeArr !== null) {
            for (let j = 0; j < playTimeArr.length; j++) {
              let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf("]")).split(":");
              this.data.lyric.push({
                time: (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(3),
                content: String(lineLyric).substr(1)
              });
            }
          }
        })
        this.data.lyric.forEach((item, index, arr) => {
          if (item.content === "") arr.splice(index, 1)
        })
        this.data.lyric.push({ time: Number.MAX_VALUE, content: "" })
        this.setData({
          lyric: this.data.lyric
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
})