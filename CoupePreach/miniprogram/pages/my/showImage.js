// miniprogram/pages/my/showImage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  imageFun(e) { // 查看图片，点击打开新页面展示图片内容
    if (e.currentTarget.dataset.name == "image-text") {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          const src = res.tempFilePaths[0];
          console.log("src==>", src)
          //  获取裁剪图片资源后，给data添加src属性及其值
          wx.navigateTo({
            url: `/components/cropper/cropper?src=${src}`,
          })
        }
      })
    } else if (e.currentTarget.dataset.name == "imagePage") {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url:options.url
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