// pages/song-sheet-detail/song-sheet-detail.js
import {
  getSongSheetDetail
} from '../../service/songSheetDetail.js'

import {
  getSongDetails
} from '../../service/music.js'

import {
  getMusicUrl
} from '../../service/musicUrl.js'

Page({
  data: {
    songSheetId: 0,
    songSheetHeader: {},
    songId: [],
    songSeetSong: [],
    isLoading: true
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('songSheetId', data => {
      this.setData({
        songSheetId: data
      })
    })

    // 获取歌单详情
    this._getSongSheetDetail(this.data.songSheetId)
  },

  // -----------网络请求-----------
  _getSongSheetDetail(id) {
    getSongSheetDetail(id).then(res => {
      const data = res.data;
      // 获取里面的歌曲 id
      data.privileges.forEach(list => {
        this.data.songId.push(list.id)
      })
      // 获取头部图片和歌单名及id
      this.setData({
        songSheetHeader: {
          sheetName: data.playlist.name,
          songSheetId: data.playlist.id,
          sheetImage: data.playlist.coverImgUrl
        },
        songId: this.data.songId
      })

      const songId = this.data.songId.join(',');

      return this._getSongDetails(songId)
    }).catch(err => {
      console.error(err)
    })
  },

  _getSongDetails(ids) {
    getSongDetails(ids).then(res => {
      const data = res.data.songs;
      data.forEach(song => {
        let musicItem = {};
        musicItem.songId = song.id;
        musicItem.image = song.al.picUrl;
        musicItem.songName = song.name;

        let artist = {
          id: [],
          name: []
        };
        song.ar.forEach(singers => {
          artist.id.push(singers.id)
          artist.name.push(singers.name)
        })
        musicItem.singerId = artist.id.join(' / ');
        musicItem.singer = artist.name.join(' / ');

        this.data.songSeetSong.push(musicItem)
      })
      this.setData({
        songSeetSong: this.data.songSeetSong
      })

      const songId = this.data.songId.join(',');

      return this._getMusicUrl(songId)
    }).catch(err => {
      console.error(err)
    })
  },

  _getMusicUrl(id) {
    getMusicUrl(id).then(res => {
      const data = res.data.data;
      for (let i = 0; i < this.data.songSeetSong.length; i++) {
        this.data.songSeetSong[i].url = data.find(item => item.id === this.data.songSeetSong[i].songId).url;
      }
      this.setData({
        songSeetSong: this.data.songSeetSong
      })

      this.setData({
        isLoading: false
      })
    }).catch(err => {
      console.error(err)
    })
  }
})