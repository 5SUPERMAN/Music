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
    attached: function () {
      this.setData({
        isPlay: app.globalData.isPlay
      })
      backgroundAudioManager.play();
    }
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        isPlay: app.globalData.isPlay
      })
      backgroundAudioManager.play();
    }
  },
  methods: {
    handlePlay() {
      if(this.properties.song){
        if (!app.globalData.isPlay){
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
    }
  }
})
