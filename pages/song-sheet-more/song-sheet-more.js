// pages/song-sheet-more/song-sheet-more.js
import {
  getRecommendSong,
  getTopSong
} from '../../service/music.js'

Page({
  data: {
    recommendMore: [],
    topMore: [],
    page: 1
  },
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();

    // 推荐歌单
    eventChannel.on('RecommendMoreData', data => {
      this.setData({
        recommendMore: data
      })
    })

    // 热门歌单
    eventChannel.on('topMoreData', data => {
      this.setData({
        topMore: data
      })
    })
  },
  onReachBottom: function() {
    if(this.data.recommendMore.length !== 0){
      this._getRecommendSong(30);
    }else{
      this._getTopSong(30);
    }
  },

  // -----------事件处理函数-----------

  // -----------网络请求-----------
  _getRecommendSong(limit) {
    this.setData({
      page: this.data.page + 1
    })
    // 方法一：清空原来的数据就不会下面请求完成数据录入就不会有重复
    // this.data.recommendMore = this.data.recommendMore.splice(this.data.recommendMore.length, this.data.recommendMore.length)

    // 方法二：推荐使用此方法
    const length = this.data.recommendMore.length

    getRecommendSong((this.data.page * limit)).then(res => {
      const result = res.data.result;
      let nullRecommendMore = [];
      result.forEach(item => {
        let songSheet = {};
        songSheet.songSheetId = item.id;
        songSheet.songSheetName = item.name;
        songSheet.image = item.picUrl;
        // this.data.recommendMore.push(songSheet)
        nullRecommendMore.push(songSheet)
      })
      this.data.recommendMore.push(...nullRecommendMore.slice(length))
      this.setData({
        recommendMore: this.data.recommendMore
      })
    }).catch(err => {
      console.error(err)
    })
  },

  _getTopSong(limit) {
    this.setData({
      page: this.data.page + 1
    })
    // 方法一：清空原来的数据就不会下面请求完成数据录入就不会有重复
    // this.data.topMore = this.data.topMore.splice(this.data.topMore.length, this.data.topMore.length)

    // 方法二：推荐使用此方法
    const length = this.data.topMore.length

    getTopSong(this.data.page * limit).then(res => {
      const playLists = res.data.playlists;
      let nullTopMore = [];
      playLists.forEach(list => {
        let playList = {};
        playList.songSheetId = list.id;
        playList.songSheetName = list.name;
        playList.image = list.coverImgUrl;
        // this.data.topMore.push(playList);
        nullTopMore.push(playList);
      })
      this.data.topMore.push(...nullTopMore.slice(length))
      this.setData({
        topMore: this.data.topMore
      })
    }).catch(err => {
      console.error(err)
    })
  },
})