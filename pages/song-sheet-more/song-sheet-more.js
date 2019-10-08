// pages/song-sheet-more/song-sheet-more.js
import {
  getRecommendSong,
  getTopSong
} from '../../service/songSheetDetail.js'

let app = getApp();

Page({
  data: {
    recommendMore: [],
    topMore: [],
    isLoading_2: false
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
    this.setData({
      isLoading_2: true
    })
    if(this.data.recommendMore.length !== 0){
      this._getRecommendSong(30);
    }else{
      this._getTopSong(30);
    }
  },

  // -----------事件处理函数-----------
  handleSheetDetail(e) {
    let index = e.currentTarget.dataset.index
    let songSheetId = 0;
    if(this.data.recommendMore.length !== 0){
      songSheetId = this.data.recommendMore[index].songSheetId
    }else{
      songSheetId = this.data.topMore[index].songSheetId
    }
    wx.navigateTo({
      url: '/pages/song-sheet-detail/song-sheet-detail',
      success: function (res) {
        res.eventChannel.emit('songSheetId', songSheetId);
      },
      fail: function (err) {
        console.error(err);
      }
    })
  },

  // -----------网络请求-----------
  _getRecommendSong(limit) {
    app.globalData.recommendPage += 1;

    // 方法一：清空原来的数据就不会下面请求完成数据录入就不会有重复
    // this.data.recommendMore = this.data.recommendMore.splice(this.data.recommendMore.length, this.data.recommendMore.length)

    // 方法二：推荐使用此方法
    // 保存上拉加载前的元素个数
    const length = this.data.recommendMore.length

    getRecommendSong(app.globalData.recommendPage * limit).then(res => {
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
        recommendMore: this.data.recommendMore,
        isLoading_2: false
      })

    }).catch(err => {
      console.error(err)
    })
  },

  _getTopSong(limit) {
    app.globalData.topPage += 1;

    // 方法一：清空原来的数据就不会下面请求完成数据录入就不会有重复
    // this.data.topMore = this.data.topMore.splice(this.data.topMore.length, this.data.topMore.length)

    // 方法二：推荐使用此方法
    const length = this.data.topMore.length

    getTopSong(app.globalData.topPage * limit).then(res => {
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
        topMore: this.data.topMore,
        isLoading_2: false
      })
    }).catch(err => {
      console.error(err)
    })
  },
})