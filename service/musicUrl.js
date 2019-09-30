import request from './network.js'

export function getMusicUrl(id) {
  return request({
    url: '/song/url',
    data: {
      id
    }
  })
}