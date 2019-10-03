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
    playIndex: -1
  },
  attached() {
    this.setData({
      playIndex: app.globalData.playIndex
    })
  },
  methods: {
    handlePlay(e) {
      let index = e.currentTarget.dataset.index;
      if (app.globalData.index !== index) { // 判断点击的 index与原来播放的 index是否一致
        app.globalData.index = index;
        app.globalData.isPlay = false;

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
        app.globalData.playIndex = index;
        this.setData({
          playIndex: app.globalData.playIndex
        })
      })

      backgroundAudioManager.onPause(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.playIndex = -1;
        this.setData({
          playIndex: -1
        })
      })

      backgroundAudioManager.onStop(() => {
        app.globalData.isPlay = !app.globalData.isPlay;
        app.globalData.playIndex = -1;
        this.setData({
          playIndex: -1
        })
      })
    }
  }
})
