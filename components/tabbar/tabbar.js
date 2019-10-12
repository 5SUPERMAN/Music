// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "icon/erji.png",
            "selectedIconPath": "icon/erji_active.png",
            "text": "音乐库"
          },
          {
            "pagePath": "/pages/audio/audio",
            "iconPath": "icon/music_active.png",
            "isSpecial": true,
            "text": ""
          },
          {
            "pagePath": "/pages/profile/profile",
            "iconPath": "icon/xiaolian.png",
            "selectedIconPath": "icon/xiaolian_active.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
