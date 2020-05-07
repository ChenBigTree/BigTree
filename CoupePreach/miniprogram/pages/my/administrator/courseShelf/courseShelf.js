// miniprogram/pages/my/administrator/courseShelf/courseShelf.js
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    someData: ''
  },
  getData() {
    wx.cloud.callFunction({
      name: "stairway",
      data: {
        fun: "get",
        get: "all",
        collective: "circle"
      },
      success: res => {
        console.log("全部", res.result.data)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  someData() {
    wx.cloud.callFunction({
      name: "stairway",
      data: {
        fun: "get",
        get: "some",
        collective: "circle"
      },
      success: res => {
        console.log("待处理", res.result.data)
        _this.setData({
          someData:res.result.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.getData()
    this.someData()
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