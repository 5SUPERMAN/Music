// pages/audio/childComps/song-cover/song-cover.js
let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {
    song: {
      type: Object,
      value: {}
    },
    isOpacity: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isPlay: false
  },
  lifetimes: {
    ready: function() {
      this.setData({
        isPlay: app.globalData.isPlay
      })

      if (app.globalData.audioSong.songId !== app.globalData.lastSongId) {
        app.globalData.lastSongId = app.globalData.audioSong.songId;
        this.properties.song.songId = app.globalData.audioSong.songId;
        app.globalData.time = 0;
      }

      if (app.globalData.time === 0 && app.globalData.audioSong.songId) {
        backgroundAudioManager.play();
      }
      // backgroundAudioManager.onTimeUpdate(() => {
      //   app.globalData.time += 0.25;
      // })
    }
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        isPlay: app.globalData.isPlay
      })
    }
  },
  methods: {
    handlePlay() {
      if (!app.globalData.isPlay) {
        backgroundAudioManager.play();
      } else {
        backgroundAudioManager.pause();
      }

      backgroundAudioManager.onPlay(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = this.properties.song.songId;
        app.globalData.playSong = this.properties.song.songId;

        this.setData({
          isPlay: app.globalData.isPlay
        })
      })

      backgroundAudioManager.onPause(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.playSong = 0;

        this.setData({
          isPlay: app.globalData.isPlay
        })

        // 因为 onTimeUpdate会多执行一次，导致事件前进，歌词会快一点
        // 加个定时器解决
        setTimeout(() => {
          app.globalData.time -= 0.25;
        }, 250)
      })

      backgroundAudioManager.onStop(() => {
        setTimeout(() => {
          app.globalData.time = 0;
        },250)

        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0
        app.globalData.playSong = 0;

        this.setData({
          isPlay: app.globalData.isPlay
        })
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
      //         this.orderPlay(res, newIndex + 1)
      //       } else {
      //         this.orderPlay(res);
      //       }
      //     },
      //     fail: function(err) {
      //       console.error(err)
      //     }
      //   })
      // })
    },

    // 顺序播放
    // orderPlay(res, index) {
    //   index = index || 0;
    //   this.properties.song = res.data[index];
    //   const page = getCurrentPages();
    //   page[page.length - 1].setData({
    //     audioSong: res.data[index]
    //   })
    //   app.globalData.audioSong = res.data[index];

    //   app.globalData.isPlay = !app.globalData.isPlay;
    //   app.globalData.songId = res.data[index].songId;
    //   app.globalData.playSong = res.data[index].songId;

    //   this.setData({
    //     isPlay: app.globalData.isPlay
    //   })

    //   innerAudioContext.src = res.data[index].url;
    //   backgroundAudioManager.title = res.data[index].songName;
    //   backgroundAudioManager.coverImgUrl = res.data[index].image;
    //   backgroundAudioManager.singer = res.data[index].singer;
    //   backgroundAudioManager.src = res.data[index].url;

    //   page[page.length - 1].onLoad();

    //   backgroundAudioManager.play();
    // }
  }
})