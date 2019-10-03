import request from './network.js'

// 歌曲 url
export function getMusicUrl(id) {
  return request({
    url: '/song/url',
    data: {
      id
    }
  })
}