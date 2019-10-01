// pages/index/childComps/new-music/new-music.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    indexNewMusic: {
      type: Array,
      value: []
    },
    playIndex: {
      type: Number,
      value: -1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePlay(e) {
      let index = e.currentTarget.dataset.index;
      this.triggerEvent('handleplay', {
        index
      }, {});
    },
    imageLoad() {
      this.triggerEvent('imageload')
    },

    handleMore() {
      this.triggerEvent('handleMore')
    }
  }
})