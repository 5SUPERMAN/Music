App({
  globalData: {
    cacheMusic: [], // 缓存的歌
    playSong: 0, // 存放选中的歌曲 id
    isPlay: false, // 判断歌曲是否为播放状态
    songId: 0, // 播放的歌曲与被点击歌曲的 id是否一致
    recommendPage: 1,
    topPage: 1,
    audioSong: {}, // 存放正在播放的歌曲
    time: 0, // 控制歌词滚动
    lastSongId: 0,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#515151",
      "selectedColor": "#32cd32",
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
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 隐藏默认tabbar
   wx.hideTabBar()
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
