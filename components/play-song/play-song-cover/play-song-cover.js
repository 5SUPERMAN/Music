// pages/audio/childComps/song-cover/song-cover.js
let app = getApp();
let backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {
    song: {
      type: Object,
      value: {}
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
      if (this.properties.song.songId) {
        backgroundAudioManager.play();
      }
    }
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        isPlay: app.globalData.isPlay
      })
      // if (this.properties.song.songId) {
      //   backgroundAudioManager.play();
      // }
    }
  },
  methods: {
    handlePlay() {
      if (this.properties.song.songId) {
        if (!app.globalData.isPlay) {
          backgroundAudioManager.play();
        } else {
          backgroundAudioManager.pause();
        }
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
      })

      backgroundAudioManager.onStop(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0
        app.globalData.playSong = 0;

        this.setData({
          isPlay: app.globalData.isPlay
        })
      })

      backgroundAudioManager.onEnded(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0;
        app.globalData.playSong = 0;
        this.setData({
          isPlay: app.globalData.isPlay
        })

        wx.getStorage({
          key: 'cacheMusic',
          success: res => {
            let index = 0
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].songId === this.properties.song.songId) {
                index = i;
                break;
              }
            }
            if ((res.data.length - 1) !== index) {
              this.properties.song = res.data[index + 1];
              const page = getCurrentPages();
              app.globalData.audioSong = res.data[index + 1];
              page[page.length - 1].data.audioSong = res.data[index + 1];
              app.globalData.isPlay = !app.globalData.isPlay;
              app.globalData.songId = this.properties.song.songId;
              app.globalData.playSong = this.properties.song.songId;

              this.setData({
                isPlay: app.globalData.isPlay
              })

              backgroundAudioManager.play();
            }
          },
          fail: function(err) {
            console.error(err)
          }
        })
      })
    }
  }
})