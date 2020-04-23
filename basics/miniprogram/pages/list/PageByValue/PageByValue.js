// miniprogram/pages/list/PageByValue/PageByValue.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    appText:"",
    eventData:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (data) {
    this.setData({
      nbTitle: '新标题',
      nbLoading: true,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
    console.log(data)
    let _this = this
    this.setData({
      text:data.text,
      appText:app.globalData.text
    })
    const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('someEvent', {data: 'test'});
    // 监听someEvent事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('someEvent', function(data) {
      console.log(data)
      _this.setData({
        eventData:data
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