Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay: "0.01",
    nickName: '大树'
  },
  // 购买功能
  toPay: function () {
    let that = this;
    let money = that.data.pay
    let gname = that.data.nickName + "的全部课程"
    wx.cloud.callFunction({
      name: "yunPay",
      data: {
        orderid: "XJT" + new Date().getTime(),
        money: money,
        gname: gname,
      },
      success(res) {
        console.log("提交成功", res.result)
        that.pay(res.result.result)
      },
      fail(res) {
        console.log("提交失败", res)
      }
    })

  },

  //实现小程序支付
  pay(payData) {
    let that = this
    //官方标准的支付方法
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
        console.log("支付成功", res)
        wx.cloud.callFunction({
          name: "userInfo",
          data: {
            fun: "update",
            update: "distributionMember",
            id: that.data.useInfo._id,
            useInfo: that.data.useInfo
          },
          success: res => {
            console.log("支付成功 修改个人资料", res)
            that.getMy()
            that.getOne(that.data.useInfo.openid)
          },
          fail: err => {
            console.log("支付失败 修改个人资料", err)
          }
        })
      },
      fail(res) {
        console.log("支付失败", res)
      },
      complete(res) {
        console.log("支付完成", res)
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