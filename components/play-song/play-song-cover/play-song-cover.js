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
      if (app.globalData.audioSong.songId !== app.globalData.lastSongId) {
        app.globalData.lastSongId = app.globalData.audioSong.songId;
        this.properties.song.songId = app.globalData.audioSong.songId;
        app.globalData.time = 0;
      }

      if (app.globalData.audioSong.songId) {
        app.globalData.isPlay = true;
        this.setData({
          isPlay: app.globalData.isPlay
        })
        backgroundAudioManager.play();
      }
    }
  },
  pageLifetimes: {
    show: function() {
      if(app.globalData.audioSong.songId){
        app.globalData.isPlay = true;
        this.setData({
          isPlay: app.globalData.isPlay
        })
      }
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
    }
  }
})