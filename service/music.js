import request from './network.js'

export function getNewMusic() {
  return request({
    url: '/top/song'
  })
}

export function getRecommendSong(limit) {
  return request({
    url: '/personalized',
    data: {
      limit: limit || 6
    }
  })
}

export function getTopSong(limit) {
  return request({
    url: '/top/playlist',
    data: {
      limit: limit || 6
    }
  })
}