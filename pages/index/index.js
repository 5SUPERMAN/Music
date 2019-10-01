// pages/index/index.js
import {
  getNewMusic,
  getRecommendSong,
  getTopSong
} from '../../service/index.js'

import {
  getMusicUrl
} from '../../service/musicUrl.js'

const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    newTitle: '新歌推荐',
    recommendTitle: '推荐歌单',
    hotTitle: '热门歌单',
    indexNewMusic: [],
    index: 0,
    isPlay: false,
    recommendSong: [],
    topSong: []
  },
  onLoad: function(options) {
    this._getNewMusic();
    this._getRecommendSong();
    this._getTopSong();
  },
  onReady: function() {
    for (let i = 0; i < this.data.indexNewMusic.length; i++) {
      const id = this.data.indexNewMusic[i].songId;
      this._getMusicUrl(id)
    }
  },
  onShow: function() {

  },

  // -----------事件函数-----------
  imageLoad() {
    for (let i = 0; i < this.data.indexNewMusic.length; i++) {
      const id = this.data.indexNewMusic[i].songId;
      this._getMusicUrl(id)
    }
  },
  handlePlay(e) {
    // if (this.data.indexNewMusic[0].length !== 6) {
    //   for (let i = 0; i < this.data.indexNewMusic.length; i++) {
    //     const id = this.data.indexNewMusic[i].songId;
    //     this._getMusicUrl(id)
    //   }
    // }

    let index = e.detail.index;
    if (this.data.index !== index) {
      this.data.index = index;
      innerAudioContext.src = this.data.indexNewMusic[index].url;
      this.data.isPlay = false;
    }
    if (!innerAudioContext.src) {
      innerAudioContext.src = this.data.indexNewMusic[index].url;
      this.data.isPlay = false;
    }

    if (!this.data.isPlay) {
      this.data.isPlay = !this.data.isPlay;
      innerAudioContext.play();
    } else {
      this.data.isPlay = !this.data.isPlay;
      innerAudioContext.pause();
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
      console.err(err)
    })
  },
  _getRecommendSong(){
    getRecommendSong().then(res => {
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
      console.err(err)
    })
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
      console.err(err)
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
      console.log(err)
    })
  }
})