// pages/index/childComps/new-music/new-music.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    indexNewMusic: {
      type: Array,
      value: []
    },
    songId: {
      type: Number,
      value: -1
    }
  },
  data: {
    
  },
  methods: {
    handlePlay(e) {
      let index = e.currentTarget.dataset.index;
      this.triggerEvent('handleplay', {
        index
      }, {});
    },
    handleMore() {
      this.triggerEvent('handleMore')
    }
  }
})