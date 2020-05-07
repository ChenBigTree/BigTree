// pages/wenzhen/forumDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starIndex1: 4,
    scrollTop: 0,
    current: 'tab2',
    forumDetail: [],
    chapter:[]
  },
  toPlay(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../speechDetail/speechDetail?id=${e.currentTarget.dataset.id}&free=free`
    })
  },
  addChapter(){
    console.log(this.data.forumDetail._id)
    wx.navigateTo({
      url: '../speechAdd/speechAdd?id='+this.data.forumDetail._id,
    })
  },
  handleChange({
    detail
  }) {
    if(detail.key=='tab3'){
      wx.navigateTo({
        url: '../jiang/speechAdd?id='+this.data.forumDetail._id,
      })
    }else{
      this.setData({
        current: detail.key
      });
    }
  

  },
  //页面滚动执行方式
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    getApp().globalData.forumId="f10018335eaa581d0022b61724061602"
    wx.cloud.callFunction({
      name: "operate_curriculum",
      data: {
        method: 'get',
        id: "f10018335eaa581d0022b61724061602"
      }
    }).then(res => {
      console.log('获取课程=>', res.result.data)
      this.setData({
        forumDetail: res.result.data
      })
      let chapterArr=this.data.forumDetail.chapter
      wx.cloud.callFunction({
        name:"get_chapter",
        data:{
          ids:chapterArr
        }
      }).then(res=>{
        console.log('章节==>',res.result)
        this.setData({
          chapter:res.result.data
        })
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})