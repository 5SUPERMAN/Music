import request from './network.js'

// 搜索
export function getSearchDetail(keywords) {
  return request({
    url: '/search',
    data: {
      keywords
    }
  })
}