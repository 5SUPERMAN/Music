// pages/song-sheet-detail/song-sheet-detail.js
import {
  getSongSheetDetail,
  getSongDetail
} from '../../service/songSheetDetail.js'

Page({
  data: {
    songSheetId: 0,
    songSheetHeader: {}
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('songSheetId', data => {
      this.setData({
        songSheetId: data
      })
    })

    this._getSongSheetDetail(this.data.songSheetId)
  },

  // -----------事件处理函数-----------

  // -----------网络请求-----------
  _getSongSheetDetail(id) {
    getSongSheetDetail(id).then(res => {
      const data = res.data.playlist;
      this.setData({
        songSheetHeader: {
          sheetName: data.name,
          songSheetId: data.id,
          sheetImage: data.coverImgUrl
        }
      })
    }).catch(err => {
      console.error(err)
    })
  },

  _getSongDetail(ids) {
    getSongDetail(ids).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  }
})