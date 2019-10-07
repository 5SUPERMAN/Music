// components/search-bar/search-bar.js
Component({
  properties: {

  },
  data: {
    searchText: ""
  },
  methods: {
    // ----------事件处理函数----------
    handleSearch(e) {
      this.setData({
        searchText: e.detail.value
      })
      
      wx.navigateTo({
        url: '/pages/search-detail/search-detail',
        success: res => {
          res.eventChannel.emit('search', e.detail.value)
        },
        fail: err => {
          console.error(err)
        }
      })
    }
  }
})
