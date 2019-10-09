// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar: {
      "backgroundColor": "#ffffff",
      "color": "#515151",
      "selectedColor": "#32cd32",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "/assets/icon/musiclibrary.png",
          "selectedIconPath": "/assets/icon/musiclibrary_active.png",
          "text": "音乐库"
        },
        {
          "pagePath": "/pages/audio/audio",
          "iconPath": "/assets/icon/music.png",
          "selectedIconPath": "/assets/icon/music_active.png",
          "text": "播放页"
        },
        {
          "pagePath": "/pages/porfile/profile",
          "iconPath": "/assets/icon/people.png",
          "selectedIconPath": "/assets/icon/people_active.png",
          "text": "我的"
        }
      ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
