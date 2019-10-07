// pages/search-detail/search-detail.js
import { getSearchDetail } from '../../service/search.js'

Page({
  data: {
    searchDetail: []
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('search', data => {
      this._getSearchDetail(data)
    })
  },


  // ----------网络请求----------
  _getSearchDetail(keywords) {
    getSearchDetail(keywords).then(res => {
      console.log(res)
      const data = res.data.result.songs;
      data.forEach(item => {
        let songItem = {};
        songItem.songId = item.id;
        songItem.songName= item.name;

        let artist = {
          id: [],
          name: []
        };
        item.artists.forEach(singers => {
          artist.id.push(singers.id)
          artist.name.push(singers.name)
        })
        songItem.singerId = artist.id.join(' / ');
        songItem.singer = artist.name.join(' / ');

        this.data.searchDetail.push(songItem)
      })
      this.setData({
        searchDetail: this.data.searchDetail
      })
      // 获取 url和 image
    }).catch(err => {
      console.error(err)
    })
  }
})