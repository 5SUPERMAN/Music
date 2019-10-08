// pages/search-detail/search-detail.js
import {
  getSearchDetail
} from '../../service/search.js'

import {
  getSongDetails
} from '../../service/music.js'

import {
  getMusicUrl
} from '../../service/musicUrl.js'

Page({
  data: {
    searchValue: "",
    searchDetail: [],
    page: -1,
    songIds: [],
    loadContainer: [],
    isLoading_1: true,
    isLoading_2: false
  },
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('search', data => {
      this._getSearchDetail(data, 30)
      this.setData({
        searchValue: data
      })
    })
  },
  onReachBottom: function() {
    this.setData({
      isLoading_2: true
    })
    this._getSearchDetail(this.data.searchValue, 30)
  },

  // ----------网络请求----------
  _getSearchDetail(keywords, limit) {
    this.setData({
      page: this.data.page + 1,
      songIds: [],
      loadContainer: []
    })
    getSearchDetail(keywords, limit, this.data.page * limit).then(res => {
      const data = res.data.result.songs;
      data.forEach(song => {
        let songItem = {};
        songItem.songId = song.id;
        songItem.songName = song.name;

        let artist = {
          id: [],
          name: []
        };
        song.artists.forEach(singers => {
          artist.id.push(singers.id)
          artist.name.push(singers.name)
        })
        songItem.singerId = artist.id.join(' / ');
        songItem.singer = artist.name.join(' / ');

        this.data.songIds.push(song.id)
        this.data.loadContainer.push(songItem)
      })
      this.setData({
        loadContainer: this.data.loadContainer,
        songIds: this.data.songIds.join(',')
      })

      return this._getMusicUrl(this.data.songIds)
    }).catch(err => {
      console.error(err)
    })
  },

  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      for (let i = 0; i < this.data.loadContainer.length; i++){
        this.data.loadContainer[i].url = data.find(item => item.id === this.data.loadContainer[i].songId).url;
      }
      this.setData({
        loadContainer: this.data.loadContainer
      })

      return this._getSongDetails(this.data.songIds)
    }).catch(err => {
      console.error(err)
    })
  },

  _getSongDetails(ids) {
    getSongDetails(ids).then(res => {
      const data = res.data.songs;
      for (let i = 0; i < this.data.loadContainer.length; i++) {
        this.data.loadContainer[i].image = data.find(item => item.id === this.data.loadContainer[i].songId).al.picUrl;
      }
      this.setData({
        loadContainer: this.data.loadContainer
      })

      this.data.searchDetail.push(...this.data.loadContainer)
      this.setData({
        searchDetail: this.data.searchDetail,
        isLoading_1: false,
        isLoading_2: false
      })
    }).catch(err => {
      console.error(err)
    })
  }
})