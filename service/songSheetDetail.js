import request from "./network.js"

export function getSongSheetDetail(id) {
  return request({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export function getSongDetail(ids) {
  return request({
    url: '/song/detail',
    data: {
      ids
    }
  })
}