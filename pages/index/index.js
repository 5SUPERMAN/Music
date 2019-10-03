// pages/index/index.js
import {
  getNewMusic,
  getRecommendSong,
  getTopSong
} from '../../service/music.js'

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
    playIndex: -1,
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
      playIndex: app.globalData.playIndex
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
        res.eventChannel.emit('RecommendMoreData',this.data.recommendMore)
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
    if (app.globalData.index !== index) {

      app.globalData.index = index;
      app.globalData.isPlay = false;

      innerAudioContext.src = this.data.indexNewMusic[index].url;

      backgroundAudioManager.title = this.data.indexNewMusic[index].songName;
      backgroundAudioManager.coverImgUrl = this.data.indexNewMusic[index].image;
      backgroundAudioManager.singer = this.data.indexNewMusic[index].singer;
      backgroundAudioManager.src = this.data.indexNewMusic[index].url;
    }

    if (!app.globalData.isPlay) {
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
  },

  // -----------网络请求-----------
  _getNewMusic() {
    getNewMusic().then(res => {
      const data = res.data.data;
      for (let i = 0; i < 5; i++) {
        let newMusicItem = {};
        newMusicItem.songId = data[i].id;
        newMusicItem.img = data[i].album.picUrl;
        newMusicItem.songName = data[i].name;
        newMusicItem.singerId = data[i].artists[0].id;
        newMusicItem.singer = data[i].artists[0].name;

        this.data.indexNewMusic.push(newMusicItem)
      }
      this.setData({
        indexNewMusic: this.data.indexNewMusic
      })
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
        newMusicItem.img = item.album.picUrl;
        newMusicItem.songName = item.name;
        newMusicItem.singerId = item.artists[0].id;
        newMusicItem.singer = item.artists[0].name;
        this.data.newMusic.push(newMusicItem)
      })
      this.setData({
        newMusic: this.data.newMusic
      })

      // 上面请求完成后，根据 id发起获取 url的请求
      setTimeout(() => {
        let songIds = []
        this.data.indexNewMusic.forEach(list => {
          let id = list.songId;
          songIds.push(id)
        })
        let songId = songIds.join(',')
        this._getMusicUrl(songId)
      },200)
    }).catch(err => {
      console.error(err)
    })
  },

  _getRecommendSong(limit) {
    if(!limit){
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
    }else{
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
    if(!limit){
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
    }else{
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