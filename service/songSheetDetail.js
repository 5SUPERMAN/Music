import request from "./network.js"

// 歌单详情
export function getSongSheetDetail(id) {
  return request({
    url: '/playlist/detail',
    data: {
      id
    }
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