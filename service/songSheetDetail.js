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