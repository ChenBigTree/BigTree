// miniprogram/pages/list/slideshow/slideshow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: "",
    news: [{
      url: "../../../images/slide/timg (1).jpg",
      name: "图1"
    }, {
      url: "../../../images/slide/timg (2).jpg",
      name: "图2"
    }, {
      url: "../../../images/slide/timg (3).jpg",
      name: "图3"
    }, {
      url: "../../../images/slide/1.jpg",
      name: "图4"
    }, ]
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
    console.log(this.data.cardCur)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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