// components/play-song/play-song-lyric/play-song-lyric.js
import { getLyric } from "../../../service/music.js"

Component({
  properties: {
    songId: {
      type: Number,
      value: 0
    }
  },
  data: {
    lyric: ""
  },
  lifetimes: {
    ready: function () {
      this._getLyric(this.properties.songId)
    }
  },
  pageLifetimes: {
    show: function () {
      
    }
  },
  methods: {



    // -----------网络请求-----------
    _getLyric(id) {
      getLyric(id).then(res => {
        console.log(res)
        this.data.lyric = res.data.lrc.lyric
        this.setData({
          lyric: res.data.lrc.lyric
        })
        console.log(this.data.lyric)

        let aaa = this.data.lyric.split('\n');
        console.log(aaa)
      }).catch(err => {
        console.error(err)
      })
    }
  }
})
