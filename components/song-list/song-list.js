// components/song-list/song-list.js

let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();
let app = getApp();

Component({
  properties: {
    music: {
      type: Array,
      value: []
    },
    isArrow: {
      type: Boolean,
      value: true
    }
  },
  data: {
    songId: 0
  },
  lifetimes: {
    attached: function() {
      this.setData({
        songId: app.globalData.playSong
      })
    }
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        songId: app.globalData.playSong
      })

      wx.getStorage({
        key: 'cacheMusic',
        success: res => {
          app.globalData.cacheMusic = res.data;
        },
        fail: function() {
          return
        }
      })
    }
  },
  methods: {
    handlePlay(e) {
      let index = e.currentTarget.dataset.index;
      if (app.globalData.songId !== this.properties.music[index].songId) { // 判断点击的 index与原来播放的 index是否一致
        app.globalData.isPlay = false;
        app.globalData.songId = this.properties.music[index].songId;

        innerAudioContext.src = this.properties.music[index].url;

        backgroundAudioManager.title = this.properties.music[index].songName;
        backgroundAudioManager.coverImgUrl = this.properties.music[index].image;
        backgroundAudioManager.singer = this.properties.music[index].singer;
        backgroundAudioManager.src = this.properties.music[index].url;

        // 缓存歌曲
        let flag = null;
        if (app.globalData.cacheMusic.length !== 0) {
          flag = app.globalData.cacheMusic.find(song => song.songId === this.properties.music[index].songId);
        }

        if (!flag) {
          app.globalData.cacheMusic.push(this.properties.music[index])
          wx.setStorage({
            key: 'cacheMusic',
            data: app.globalData.cacheMusic
          })
        }
      }

      // 播放/跳转
      if (app.globalData.songId && !app.globalData.isPlay) {
        app.globalData.audioSong = this.properties.music[index];

        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = this.properties.music[index].songId;
        app.globalData.playSong = this.properties.music[index].songId;
        this.setData({
          songId: app.globalData.playSong
        })

        wx.navigateTo({
          url: '/pages/audio/audio'
        })
      } else {
        wx.navigateTo({
          url: '/pages/audio/audio'
        })
      }

      backgroundAudioManager.onPlay(() => {
        this.setData({
          songId: app.globalData.playSong
        })
      })

      backgroundAudioManager.onPause(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.playSong = 0;
        this.setData({
          songId: 0
        })
      })

      backgroundAudioManager.onStop(() => {
        console.log("song-list")
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0;
        app.globalData.playSong = 0;
        this.setData({
          songId: 0
        })

        const pages = getCurrentPages();
        pages[pages.length - 1].onShow();
      })
    },
    handleDel(e) {
      const index = e.currentTarget.dataset.index;
      app.globalData.cacheMusic.splice(index, 1);
      wx.setStorage({
        key: 'cacheMusic',
        data: app.globalData.cacheMusic
      })

      const page = getCurrentPages();
      page[0].onShow();
    }
  }
})