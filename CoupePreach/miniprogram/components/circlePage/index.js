// components/circlePage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wallData: Object
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
    lookDetail(e) {
      console.log('sdfsadf')
      console.log(e.currentTarget.dataset) ///////////******* */
      wx.navigateTo({
        url: '../../pages/myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.sid,
      })
    }

  }
})