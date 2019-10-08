import request from './network.js'

// 搜索
export function getSearchDetail(keywords, limit, offset) {
  return request({
    url: '/search',
    data: {
      keywords,
      limit,
      offset
    }
  })
}