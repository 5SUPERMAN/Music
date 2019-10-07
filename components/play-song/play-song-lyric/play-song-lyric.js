// components/play-song/play-song-lyric/play-song-lyric.js
import {
  getLyric
} from "../../../service/music.js"

let app = getApp();
let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {
    songId: {
      type: Number,
      value: 0
    },
    isOpacity: {
      type: Boolean,
      value: true
    }
  },
  data: {
    lyric: [],
    currentIndex: 0,
    scrollTop: '0'
  },
  lifetimes: {
    ready: function() {
      this._getLyric(this.properties.songId);

      backgroundAudioManager.onTimeUpdate(() => {
        app.globalData.time += 0.25;

        for (let i = 0; i < this.data.lyric.length; i++) {
          if (
            this.data.currentIndex !== i &&
            (i < this.data.lyric.length - 1 &&
                app.globalData.time >= this.data.lyric[i].time &&
                app.globalData.time < this.data.lyric[i + 1].time)
          ) {
            this.setData({
              currentIndex: i
            })

            if (this.data.currentIndex >= 3) {
              this.setData({
                scrollTop: (this.data.currentIndex - 3) * 90 + 'rpx'
              })
            }

          }else{
            this.setData({
              currentIndex: this.data.lyric.length - 1
            })
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        app.globalData.time = 0;
        this.setData({
          scrollTop: 0
        })

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
            } else {
              this.orderPlay(res);
            }
          },
          fail: function (err) {
            console.error(err)
          }
        })
      })
    }
  },
  methods: {
    // 顺序播放
    orderPlay(res, index) {
      index = index || 0;
      const page = getCurrentPages();
      page[page.length - 1].setData({
        audioSong: res.data[index]
      })
      app.globalData.audioSong = res.data[index];

      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.songId = res.data[index].songId;
      app.globalData.playSong = res.data[index].songId;

      this.setData({
        isPlay: app.globalData.isPlay
      })

      innerAudioContext.src = res.data[index].url;
      backgroundAudioManager.title = res.data[index].songName;
      backgroundAudioManager.coverImgUrl = res.data[index].image;
      backgroundAudioManager.singer = res.data[index].singer;
      backgroundAudioManager.src = res.data[index].url;

      page[page.length - 1].onLoad();

      this._getLyric(this.properties.songId);

      backgroundAudioManager.play();
    },

    // -----------网络请求-----------
    _getLyric(id) {
      getLyric(id).then(res => {
        this.setData({
          lyric: []
        })
        if (res.data.lrc) {
          let lyrices = res.data.lrc.lyric;

          let lyricArr = lyrices.split('\n');
          lyricArr.forEach(item => {
            let playTimeArr = item.match(/\[\d{2}:\d{2}((\.|\:)(\d{2}|\d{3}))\]/g);
            let lineLyric = '';
            if (item.split(playTimeArr).length > 0) {
              lineLyric = item.split(playTimeArr);
            }
            if (playTimeArr !== null) {
              for (let j = 0; j < playTimeArr.length; j++) {
                let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf("]")).split(":");
                this.data.lyric.push({
                  time: (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(3),
                  content: String(lineLyric).substr(1)
                });
              }
            }
          })
          this.data.lyric.forEach((item, index, arr) => {
            if (item.content === "") arr.splice(index, 1)
          })
          this.setData({
            lyric: this.data.lyric
          })
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
})