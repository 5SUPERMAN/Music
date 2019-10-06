// pages/audio/childComps/song-cover/song-cover.js
let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
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
            }else{
              this.orderPlay(res);
            }
          },
          fail: function(err) {
            console.error(err)
          }
        })
      })
    },

    // 顺序播放
    orderPlay(res, index) {
      index = index || 0;
      this.properties.song = res.data[index];
      const page = getCurrentPages();
      page[page.length - 1].setData({
        audioSong: res.data[index]
      })
      app.globalData.audioSong = res.data[index];

      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.songId = this.properties.song.songId;
      app.globalData.playSong = this.properties.song.songId;

      this.setData({
        isPlay: app.globalData.isPlay
      })

      innerAudioContext.src = this.properties.song.url;
      backgroundAudioManager.title = this.properties.song.songName;
      backgroundAudioManager.coverImgUrl = this.properties.song.image;
      backgroundAudioManager.singer = this.properties.song.singer;
      backgroundAudioManager.src = this.properties.song.url;

      page[page.length - 1].onLoad();

      backgroundAudioManager.play();
    }
  }
})