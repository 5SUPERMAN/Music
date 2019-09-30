import {baseUrl} from './config.js'

export default function request(options) {
 return new Promise((resolve, reject) => {
   wx.request({
     url: baseUrl + options.url,
     method: options.method || 'get',
     data: options.data || {},
     success: resolve,
     fail: reject
   })
 })
}