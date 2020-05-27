// pages/list/clipboard/clipboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clipboard: [],
    isShow: false,
    text:""
  },
  fzfun(e) {
    let _this = this
    let data = _this.data.clipboard.concat()
    wx.setClipboardData({
      data: e.currentTarget.dataset.name,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制内容", res.data) // data
            data.push(res.data)
            _this.setData({
              clipboard: data
            })
          }
        })
      }
    })
  },
  clipboardfun() {
    let _this = this
    console.log("粘贴板内容", _this.data.clipboard)
    this.setData({
      isShow: !this.data.isShow,
      text:"空"
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

  }
})