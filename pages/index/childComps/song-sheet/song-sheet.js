// pages/index/childComps/recommend-song/recommend-song.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    songSheet: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSheetMore() {
      this.triggerEvent('handleSheetMore')
    },
    handleSheetDetail(e) {
      let index = e.currentTarget.dataset.index
      let songSheetId = this.properties.songSheet[index].songSheetId

      wx.navigateTo({
        url: '/pages/song-sheet-detail/song-sheet-detail',
        success: function(res) {
          res.eventChannel.emit('songSheetId', songSheetId);
        },
        fail: function(err) {
          console.error(err);
        }
      })
    }
  }
})
