// pages/index/index.js
import {
  getNewMusic,
  getRecommendSong,
  getTopSong
} from '../../service/music.js'

import {
  getMusicUrl
} from '../../service/musicUrl.js'

import {
  debounce
} from "../../utils/debounce.js"

const innerAudioContext = wx.createInnerAudioContext()
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    newTitle: '新歌推荐',
    recommendTitle: '推荐歌单',
    hotTitle: '热门歌单',
    indexNewMusic: [],
    newMusic: [],
    index: -1,
    isPlay: false,
    // playIndex: 0,
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
    
  },
  onReady: function() {
    // for (let i = 0; i < this.data.indexNewMusic.length; i++) {
    //   const id = this.data.indexNewMusic[i].songId;
    //   this._getMusicUrl(id)
    // }

    this.data.indexNewMusic.forEach(item => {
      const id = item.songId;
      this._getMusicUrl(id)
    })
  },

  // -----------事件函数-----------
  handleMore() {
    wx.navigateTo({
      url: '/pages/new-music-more/new-music-more',
      events: {
        someEvent: data => {
          this.setData({
            isPlay: data[0],
            index: data[1]
          })
        }
      },
      success: res => {
        res.eventChannel.emit('newMusicData', [this.data.newMusic,this.data.isPlay,this.data.index])
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

      }
    })
  },
  handleTopMore() {
    wx.navigateTo({
      url: '/pages/song-sheet-more/song-sheet-more',
      success: res => {

      }
    })
  },
  imageLoad: debounce(function() {
    this.data.indexNewMusic.forEach(item => {
      const id = item.songId;
      this._getMusicUrl(id)
    })
  }, 500),
  handlePlay(e) {
    let index = e.detail.index;
    if (this.data.index !== index) {
      this.setData({
        index: index
      })
      innerAudioContext.src = this.data.indexNewMusic[index].url;

      backgroundAudioManager.title = this.data.indexNewMusic[index].songName;
      backgroundAudioManager.coverImgUrl = this.data.indexNewMusic[index].image;
      backgroundAudioManager.singer = this.data.indexNewMusic[index].singer;
      backgroundAudioManager.src = this.data.indexNewMusic[index].url

      this.data.isPlay = false;
    }
    if (!backgroundAudioManager.src) {
      innerAudioContext.src = this.data.indexNewMusic[index].url;
      backgroundAudioManager.src = this.data.indexNewMusic[index].url;

      this.data.isPlay = false;
    }

    if (!this.data.isPlay) {
      this.setData({
        isPlay: !this.data.isPlay
      })
      // innerAudioContext.play();
      backgroundAudioManager.play();
    } else {
      this.setData({
        isPlay: !this.data.isPlay
      })
      // innerAudioContext.pause();
      backgroundAudioManager.pause();
      this.setData({
        index: -1
      })
    }
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
        this.setData({
          indexNewMusic: this.data.indexNewMusic
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  _getNewMusicMore() {
    getNewMusic().then(res => {
      const data = res.data.data;
      for (let i = 0; i < 50; i++) {
        let newMusicItem = {};
        newMusicItem.songId = data[i].id;
        newMusicItem.img = data[i].album.picUrl;
        newMusicItem.songName = data[i].name;
        newMusicItem.singerId = data[i].artists[0].id;
        newMusicItem.singer = data[i].artists[0].name;
        this.data.newMusic.push(newMusicItem)
        this.setData({
          newMusic: this.data.newMusic
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  _getRecommendSong(id) {
    if(!id){
      getRecommendSong(id).then(res => {
        const result = res.data.result;
        result.forEach(item => {
          let songSheet = {};
          songSheet.songSheetId = item.id;
          songSheet.songSheetName = item.name;
          songSheet.image = item.picUrl;
          this.data.recommendSong.push(songSheet)
          this.setData({
            recommendSong: this.data.recommendSong
          })
        })
      }).catch(err => {
        console.error(err)
      })
    }else{
      getRecommendSong(id).then(res => {
        const result = res.data.result;
        result.forEach(item => {
          let songSheet = {};
          songSheet.songSheetId = item.id;
          songSheet.songSheetName = item.name;
          songSheet.image = item.picUrl;
          this.data.recommendMore.push(songSheet)
          this.setData({
            recommendMore: this.data.recommendMore
          })
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },
  _getTopSong() {
    getTopSong().then(res => {
      const playLists = res.data.playlists;
      playLists.forEach(list => {
        let playList = {};
        playList.songSheetId = list.id;
        playList.songSheetName = list.name;
        playList.image = list.coverImgUrl;
        this.data.topSong.push(playList);
        this.setData({
          topSong: this.data.topSong
        })
      })
    }).catch(err => {
      console.error(err)
    })
  },

  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      this.data.indexNewMusic.find(item => item.songId === data[0].id).url = data[0].url
      this.setData({
        indexNewMusic: this.data.indexNewMusic
      })
    }).catch(err => {
      console.error(err)
    })
  }
})