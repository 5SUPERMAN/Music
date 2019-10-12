// components/play-song/play-song-lyric/play-song-lyric.js

let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {
    isOpacity: {
      type: Boolean,
      value: true
    },
    lyric: {
      type: Array,
      value: []
    }
  },
  data: {
    currentIndex: 0,
    scrollTop: '0'
  },
  lifetimes: {
    ready: function() {
      backgroundAudioManager.onTimeUpdate(() => {
        app.globalData.time = backgroundAudioManager.currentTime;

        for (let i = 0; i < this.properties.lyric.length - 1; i++) {
          if (
            this.data.currentIndex !== i &&
            (i < this.properties.lyric.length - 1 &&
                app.globalData.time >= this.properties.lyric[i].time &&
                app.globalData.time < this.properties.lyric[i + 1].time)
          ) {
            this.setData({
              currentIndex: i
            })

            if (this.data.currentIndex >= 3) {
              this.setData({
                scrollTop: (this.data.currentIndex - 3) * 90 + 'rpx'
              })
            }

          }
        }
      })
    }
  },
  methods: {
    
  }
})