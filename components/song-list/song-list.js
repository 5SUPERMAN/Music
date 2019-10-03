// components/song-list/song-list.js

let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();
let app = getApp();

Component({
  properties: {
    music: {
      type: Array,
      value: []
    }
  },
  data: {
    songId: 0
  },
  ready: function() {
    this.setData({
      songId: app.globalData.songId
    })
  },
  methods: {
    handlePlay(e) {
      let index = e.currentTarget.dataset.index;
      if (app.globalData.songId !== this.properties.music[index].songId) { // 判断点击的 index与原来播放的 index是否一致
        app.globalData.index = index;
        app.globalData.isPlay = false;
        app.globalData.songId = this.properties.music[index].songId;

        innerAudioContext.src = this.properties.music[index].url;

        backgroundAudioManager.title = this.properties.music[index].songName;
        backgroundAudioManager.coverImgUrl = this.properties.music[index].image;
        backgroundAudioManager.singer = this.properties.music[index].singer;
        backgroundAudioManager.src = this.properties.music[index].url;
      }

      if (!app.globalData.isPlay) { // 判断点击播放暂停
        backgroundAudioManager.play();
      } else {
        backgroundAudioManager.pause();
      }

      backgroundAudioManager.onPlay(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = this.properties.music[index].songId;
        this.setData({
          songId: app.globalData.songId
        })
      })

      backgroundAudioManager.onPause(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0;
        this.setData({
          songId: 0
        })
      })

      backgroundAudioManager.onStop(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.songId = 0;
        this.setData({
          songId: 0
        })
      })
    }
  }
})