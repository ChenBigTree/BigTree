// pages/list/OpenUploadFile/OpenUploadFile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload: "1.pdf",
    path: ""
  },
  uploadFun() {
    let _this = this
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        console.log(tempFilePaths[0].name)
        console.log(tempFilePaths[0].path)
        _this.setData({
          upload: tempFilePaths[0].name,
          path: tempFilePaths[0].path
        })
      }
    })
  },
  openloadFun() {
    let _this = this
    wx.openDocument({
      filePath: _this.data.path,
      showMenu: false,
      success: res => {
        console.log("打开成功", res)
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