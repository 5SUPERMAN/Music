import request from './network.js'

// 新歌推荐
export function getNewMusic() {
  return request({
    url: '/top/song'
  })
}

// 推荐歌单
export function getRecommendSong(limit) {
  return request({
    url: '/personalized',
    data: {
      limit: limit || 6
    }
  })
}

// 热门歌单
export function getTopSong(limit) {
  return request({
    url: '/top/playlist',
    data: {
      limit: limit || 6
    }
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