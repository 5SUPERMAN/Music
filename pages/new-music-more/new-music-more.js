// pages/new-music-more/new-music-more.js
// import {
//   getNewMusic
// } from "../../service/music.js"

import {
  getMusicUrl
} from '../../service/musicUrl.js'

import {
  debounce
} from "../../utils/debounce.js"

const innerAudioContext = wx.createInnerAudioContext();
const backgroundAudioManager = wx.getBackgroundAudioManager();
let flag = true;

Page({
  data: {
    newMusic: [],
    isPlay: false,
    // 控制播放按钮
    playIndex: -1
  },
  onLoad: function(options) {
    // this._getNewMusic();
    
    
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on('newMusicData', data => {
      this.setData({
        newMusic: data[0],
        isPlay: data[1],
        playIndex: data[2]
      })
      flag = true;
    })
  },
  onShow: function() {
    setTimeout(() => {
      this.data.newMusic.forEach(list => {
        let id = list.songId;
        this._getMusicUrl(id)
      })
    },500)
  },

  // -----------事件函数-----------
  handlePlay(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.playIndex !== index) {
      this.setData({
        playIndex: index
      })
      innerAudioContext.src = this.data.newMusic[index].url;
      
      backgroundAudioManager.title = this.data.newMusic[index].songName;
      backgroundAudioManager.coverImgUrl = this.data.newMusic[index].image;
      backgroundAudioManager.singer = this.data.newMusic[index].singer;
      backgroundAudioManager.src = this.data.newMusic[index].url;

      this.data.isPlay = false;
    }
    if (!backgroundAudioManager.src) {
      innerAudioContext.src = this.data.newMusic[index].url;
      backgroundAudioManager.src = this.data.newMusic[index].url;

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
        playIndex: -1
      })
    }

    if (flag) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('someEvent', [this.data.isPlay, this.data.playIndex]);
    }
  },
  // imageLoad: debounce(function() {
  //   this.data.newMusic.forEach(list => {
  //     let id = list.songId;
  //     this._getMusicUrl(id)
  //   })
  // }, 500),

  // -----------网络请求-----------
  // _getNewMusic() {
  //   getNewMusic().then(res => {
  //     const data = res.data.data;
  //     for (let i = 0; i < 50; i++) {
  //       let newMusicItem = {};
  //       newMusicItem.songId = data[i].id;
  //       newMusicItem.img = data[i].album.picUrl;
  //       newMusicItem.songName = data[i].name;
  //       newMusicItem.singerId = data[i].artists[0].id;
  //       newMusicItem.singer = data[i].artists[0].name;
  //       this.data.newMusic.push(newMusicItem)
  //       this.setData({
  //         newMusic: this.data.newMusic
  //       })
  //     }
  //   }).catch(err => {
  //     console.error(err)
  //   })
  // },
  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      this.data.newMusic.find(item => item.songId === data[0].id).url = data[0].url;
      this.setData({
        newMusic: this.data.newMusic
      })
    }).catch(err => {
      console.error(err)
    })
  }
})