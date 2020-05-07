// components/curriculumPage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curriculumArr:Object
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
    toCurriculumDetail(e){
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '../../pages/myHomepage/forumManager/forumManager?id='+e.currentTarget.dataset.id,
      })
    }

  }
})
