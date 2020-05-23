// pages/index.js
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: []
  },
  click: function (e) {
    // console.log('e==>', e)
    that = this

    let p1 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/goodsPoster/xiaoguo.jpg',
        success: function (res) {
          console.log('res==>', res.path),
            resolve(res.path)
        }
      })
    })

    let p2 = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/goodsPoster/beijing.png',
        success: function (res) {
          console.log('res1==>', res.path),
            resolve(res.path)
        }
      })
    })

    Promise.all([p1, p2])
      .then(function (el) {
        var ctx = wx.createCanvasContext('canvas')
        // console.log('el==>', el)
        let beijing = el[1]
        let shoping = el[0]

        // 商品
        ctx.drawImage(shoping, 0, 0, 750, 600)

        // 背景
        ctx.drawImage(beijing, 0, 0, 750, 600)
        ctx.font = "300 76px Impact, Charcoal, sans-serif";
        ctx.setFillStyle("#fff")
        ctx.setTextAlign('center')
        ctx.setFontSize(76)
        ctx.fillText('999', 624, 470)

        ctx.font = "24px 'Trebuchet MS', Helvetica, sans-serif "
        ctx.setTextAlign('center')
        ctx.setFillStyle("#fff")
        ctx.setTextAlign('center')
        ctx.setFontSize(24)
        ctx.fillText("99.99", 655, 516);
        ctx.draw(true, function () {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 600,
            destWidth: 750,
            destHeight: 600,
            canvasId: 'canvas',
            success(res) {
              // console.log('res-===>', res)
              that.setData({
                img: res.tempFilePath
              })
              // 显示海报
              wx.previewImage({
                current: that.data.img, // 当前显示图片的http链接
                urls: [that.data.img], // 需要预览的图片http链接列表
                success(res) {}
              })
            }

          })
        })
      })
      .catch(err => {
        console.log("err==>", err)
      });
  
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
    that = this
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