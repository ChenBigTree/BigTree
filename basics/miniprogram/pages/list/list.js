// miniprogram/pages/list/list.js
Page({
  data: {
    active: 0
  },
  // 首页加载的渲染方法
  url(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
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

  },
  // 页面传值
  PageByValue(){
    wx.navigateTo({
      url: '../list/PageByValue/PageByValue?text=来自首页传来的值',
      events:{
        someEvent: data=> {
          console.log(data)
        }
      },
      success(res){
        res.eventChannel.emit('someEvent', { data: '通过监听器传list页面的参数' })
      }
    })
  },

})