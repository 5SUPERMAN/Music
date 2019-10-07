import request from './network.js'

// 新歌推荐
export function getNewMusic() {
  return request({
    url: '/top/song'
  })
}

// 歌曲详情
export function getSongDetails(ids) {
  return request({
    url: '/song/detail',
    data: {
      ids
    }
  })
}

// 歌词
export function getLyric(id) {
  return request({
    url: '/lyric',
    data: {
      id
    }
  })
}