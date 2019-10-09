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
        fail: function () {
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
          url: '/pages/audio-02/audio-02'
        })
      } else {
        wx.navigateTo({
          url: '/pages/audio-02/audio-02'
        })
      }

      backgroundAudioManager.onPlay(() => {
        // app.globalData.isPlay = !app.globalData.isPlay;
        // app.globalData.songId = this.properties.music[index].songId;
        // app.globalData.playSong = this.properties.music[index].songId;
        this.setData({
          songId: app.globalData.playSong
        })

        // wx.navigateTo({
        //   url: '/pages/audio-02/audio-02'
        // })
      })

      backgroundAudioManager.onPause(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.playSong = 0;
        this.setData({
          songId: 0
        })
      })

      backgroundAudioManager.onStop(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0;
        app.globalData.playSong = 0;
        this.setData({
          songId: 0
        })

        const pages = getCurrentPages();
        pages[0].onShow();
      })

      // backgroundAudioManager.onEnded(() => {
      //   app.globalData.time = 0;
        
      //   wx.getStorage({
      //     key: 'cacheMusic',
      //     success: res => {
      //       let newIndex = 0
      //       for (let i = 0; i < res.data.length; i++) {
      //         if (res.data[i].songId === app.globalData.audioSong.songId) {
      //           newIndex = i;
      //           break;
      //         }
      //       }
      //       if ((res.data.length - 1) !== newIndex) {
      //         this.orderPlay(res, newIndex + 1);
      //       }else{
      //         this.orderPlay(res);
      //       }
      //     },
      //     fail: function (err) {
      //       console.error(err)
      //     }
      //   })
      // })
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
    },

    // 顺序播放
    // orderPlay(res,index) {
    //   index = index || 0;
    //   app.globalData.audioSong = res.data[index];

    //   app.globalData.isPlay = !app.globalData.isPlay;
    //   app.globalData.songId = res.data[index].songId;
    //   app.globalData.playSong = res.data[index].songId;
    //   this.setData({
    //     songId: app.globalData.playSong
    //   })

    //   innerAudioContext.src = res.data[index].url;
    //   backgroundAudioManager.title = res.data[index].songName;
    //   backgroundAudioManager.coverImgUrl = res.data[index].image;
    //   backgroundAudioManager.singer = res.data[index].singer;
    //   backgroundAudioManager.src = res.data[index].url;

    //   // const page = getCurrentPages();
    //   // page[page.length - 1].onShow();

    //   backgroundAudioManager.play();
    // }
  }
})