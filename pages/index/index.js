// pages/index/index.js
import {
  getNewMusic
} from '../../service/music.js'

import {
  getRecommendSong,
  getTopSong
} from '../../service/songSheetDetail.js'

import {
  getMusicUrl
} from '../../service/musicUrl.js'

let innerAudioContext = wx.createInnerAudioContext();
let backgroundAudioManager = wx.getBackgroundAudioManager();
let app = getApp();

Page({
  data: {
    newTitle: '新歌推荐',
    recommendTitle: '推荐歌单',
    hotTitle: '热门歌单',
    indexNewMusic: [],
    newMusic: [],
    songId: 0,
    recommendSong: [],
    recommendMore: [],
    topSong: [],
    topMore: []
  },
  onLoad: function(options) {
    this._getNewMusic();
    this._getRecommendSong();
    this._getTopSong();

    this._getNewMusicMore();
    this._getRecommendSong(30);
    this._getTopSong(30);
  },
  onShow: function() {
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
  },

  // -----------事件处理函数-----------
  handleMore() {
    wx.navigateTo({
      url: '/pages/new-music-more/new-music-more',
      success: res => {
        res.eventChannel.emit('newMusicData', this.data.newMusic)
      },
      fail: function(err) {
        console.error(err)
      }
    })
  },
  handleRecommendMore() {
    wx.navigateTo({
      url: '/pages/song-sheet-more/song-sheet-more',
      success: res => {
        res.eventChannel.emit('RecommendMoreData', this.data.recommendMore)
      }
    })
  },
  handleTopMore() {
    wx.navigateTo({
      url: '/pages/song-sheet-more/song-sheet-more',
      success: res => {
        res.eventChannel.emit('topMoreData', this.data.topMore)
      }
    })
  },
  handlePlay(e) {
    let index = e.detail.index;
    if (app.globalData.songId !== this.data.indexNewMusic[index].songId) { // 判断点击的 index与原来播放的 index是否一致
      app.globalData.isPlay = false;
      app.globalData.songId = this.data.indexNewMusic[index].songId;

      innerAudioContext.src = this.data.indexNewMusic[index].url;

      backgroundAudioManager.title = this.data.indexNewMusic[index].songName;
      backgroundAudioManager.coverImgUrl = this.data.indexNewMusic[index].image;
      backgroundAudioManager.singer = this.data.indexNewMusic[index].singer;
      backgroundAudioManager.src = this.data.indexNewMusic[index].url;

      // 缓存歌曲
      let flag = null;
      if (app.globalData.cacheMusic.length !== 0){
        flag = app.globalData.cacheMusic.find(song => song.songId === this.data.indexNewMusic[index].songId);
      }

      if(!flag){
        app.globalData.cacheMusic.push(this.data.indexNewMusic[index])
        wx.setStorage({
          key: 'cacheMusic',
          data: app.globalData.cacheMusic
        })
      }
    }

    // 播放/跳转
    if (app.globalData.songId && !app.globalData.isPlay) {
      app.globalData.audioSong = this.data.indexNewMusic[index];

      app.globalData.isPlay = !app.globalData.isPlay;
      app.globalData.songId = this.data.indexNewMusic[index].songId;
      app.globalData.playSong = this.data.indexNewMusic[index].songId;
      this.setData({
        songId: app.globalData.songId
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
      // app.globalData.songId = this.data.indexNewMusic[index].songId;
      // app.globalData.playSong = this.data.indexNewMusic[index].songId;
      // this.setData({
      //   songId: app.globalData.songId
      // })

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
    })

    backgroundAudioManager.onEnded(() => {
      app.globalData.time = 0;

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
            this.orderPlay(res, newIndex + 1);
          } else {
            this.orderPlay(res);
          }
        },
        fail: function (err) {
          console.error(err)
        }
      })
    })
  },
  // 顺序播放
  orderPlay(res, index) {
    index = index || 0;
    app.globalData.audioSong = res.data[index];

    app.globalData.isPlay = !app.globalData.isPlay;
    app.globalData.songId = res.data[index].songId;
    app.globalData.playSong = res.data[index].songId;
    this.setData({
      songId: app.globalData.playSong
    })

    innerAudioContext.src = res.data[index].url;
    backgroundAudioManager.title = res.data[index].songName;
    backgroundAudioManager.coverImgUrl = res.data[index].image;
    backgroundAudioManager.singer = res.data[index].singer;
    backgroundAudioManager.src = res.data[index].url;

    const page = getCurrentPages();
    page[page.length - 1].onShow();

    backgroundAudioManager.play();
  },

  // -----------网络请求-----------
  _getNewMusic() {
    getNewMusic().then(res => {
      const data = res.data.data;
      for (let i = 0; i < 5; i++) {
        let newMusicItem = {};
        newMusicItem.songId = data[i].id;
        newMusicItem.image = data[i].album.picUrl;
        newMusicItem.songName = data[i].name;

        let artist = {
          id: [],
          name: []
        };
        data[i].artists.forEach(singers => {
          artist.id.push(singers.id)
          artist.name.push(singers.name)
        })
        newMusicItem.singerId = artist.id.join(' / ');
        newMusicItem.singer = artist.name.join(' / ');

        this.data.indexNewMusic.push(newMusicItem)
      }
      this.setData({
        indexNewMusic: this.data.indexNewMusic
      })

      // 上面请求完成后，根据 id发起获取 url的请求
      let songIds = []
      this.data.indexNewMusic.forEach(list => {
        let id = list.songId;
        songIds.push(id)
      })
      let songId = songIds.join(',')
      // 防止上面获取未完成获取 id，就执行下面请求，所以 return
      return this._getMusicUrl(songId)
    }).catch(err => {
      console.error(err)
    })
  },

  _getNewMusicMore() {
    getNewMusic().then(res => {
      const data = res.data.data;
      data.forEach(item => {
        let newMusicItem = {};
        newMusicItem.songId = item.id;
        newMusicItem.image = item.album.picUrl;
        newMusicItem.songName = item.name;

        let artist = {
          id: [],
          name: []
        };
        item.artists.forEach(singers => {
          artist.id.push(singers.id)
          artist.name.push(singers.name)
        })
        newMusicItem.singerId = artist.id.join(' / ');
        newMusicItem.singer = artist.name.join(' / ');

        this.data.newMusic.push(newMusicItem)
      })
      this.setData({
        newMusic: this.data.newMusic
      })
    }).catch(err => {
      console.error(err)
    })
  },

  _getRecommendSong(limit) {
    // 判断有没有传参
    if (!limit) {
      getRecommendSong(limit).then(res => {
        const result = res.data.result;
        result.forEach(item => {
          let songSheet = {};
          songSheet.songSheetId = item.id;
          songSheet.songSheetName = item.name;
          songSheet.image = item.picUrl;
          this.data.recommendSong.push(songSheet)
        })
        this.setData({
          recommendSong: this.data.recommendSong
        })
      }).catch(err => {
        console.error(err)
      })
    } else {
      getRecommendSong(limit).then(res => {
        const result = res.data.result;
        result.forEach(item => {
          let songSheet = {};
          songSheet.songSheetId = item.id;
          songSheet.songSheetName = item.name;
          songSheet.image = item.picUrl;
          this.data.recommendMore.push(songSheet)
        })
        this.setData({
          recommendMore: this.data.recommendMore
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },

  _getTopSong(limit) {
    // 判断有没有传参
    if (!limit) {
      getTopSong(limit).then(res => {
        const playLists = res.data.playlists;
        playLists.forEach(list => {
          let playList = {};
          playList.songSheetId = list.id;
          playList.songSheetName = list.name;
          playList.image = list.coverImgUrl;
          this.data.topSong.push(playList);
        })
        this.setData({
          topSong: this.data.topSong
        })
      }).catch(err => {
        console.error(err)
      })
    } else {
      getTopSong(limit).then(res => {
        const playLists = res.data.playlists;
        playLists.forEach(list => {
          let playList = {};
          playList.songSheetId = list.id;
          playList.songSheetName = list.name;
          playList.image = list.coverImgUrl;
          this.data.topMore.push(playList);
        })
        this.setData({
          topMore: this.data.topMore
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },

  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      for (let i = 0; i < this.data.indexNewMusic.length; i++) {
        this.data.indexNewMusic[i].url = data.find(item => item.id === this.data.indexNewMusic[i].songId).url;
      }
      this.setData({
        indexNewMusic: this.data.indexNewMusic
      })
    }).catch(err => {
      console.error(err)
    })
  }
})