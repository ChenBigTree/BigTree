Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    name: ''
  },
  // 点击上传图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })

  },
  // 上传文件夹
  chooseMessageFile() {
    wx.chooseMessageFile({
      type: "file",
      success: res => {
        console.log(res)
        this.setData({
          name: res.tempFiles[0]
        })
      },
      fail: err => {
        console.log(err)
      }
    })

  },
  // 打开文件
  open() {
    wx.openDocument({
      filePath: this.data.name.path,
      showMenu: true,
      success: r => {
        console.log("r", r)
      },
      fail: e => {
        console.log("e", e)
      }
    })
  },

  // 下载文件
  down(e) {
    console.log()
    wx.downloadFile({
      url: e.currentTarget.dataset.path,
      success: res => {
        console.log(res)
      }
    })
    // downloadTask.onProgressUpdate((res) => {
    //   console.log('下载进度', res.progress)
    //   console.log('已经下载的数据长度', res.totalBytesWritten)
    //   console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    // })
  },
  // 长按删除图片
  deleteImage: function (e) {
    var that = this;
    console.log("tempIds==>", this.data.tempIds)
    console.log("files==>", this.data.files)
    var tempFilePaths = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    console.log("index==>", index)
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          files: tempFilePaths
        });
      }
    })
  },
  // 点击预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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