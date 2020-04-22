var Utils = require("../../../utils/utils")
var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    imageURL: "../../icon/2.png",
  },
  // 获取商家提交列表
  getApply() {
    wx.cloud.callFunction({
      name: "addFormVal",
      data: {
        fun:"get",
        collectionName: "sub-companyData"
      }
    }).then(res => {
      console.log("后台获取", res.result.data)
      _this.setData({
        applyData: res.result.data
      })
    })
  },
  // 管理员拒绝商家申请
  delFun(e) {
    _this.handleFun(e.currentTarget.dataset.id, "process")
  },
  // 管理员通过商家申请
  passFun(e) {
    _this.handleFun(e.currentTarget.dataset.id, "isPass")
  },

  handleFun(id, name) {
    for (var i = 0; i < _this.data.applyData.length; i++) {
      if (_this.data.applyData[i]._id == id) {
        wx.cloud.callFunction({
          name: "addFormVal",
          data: {
            id: id,
            obj: name,
            fun:"updata"
          }
        }).then((res) => {
          console.log("修改成功==>", res)
          _this.getApply()
          setTimeout(() => {
            _this.applyDataFun()
          }, 1000)
        })
        return false
      }
    }
  },
  // 判断页面是否为空
  onChange(e) {
    if (e.detail.index == 0) {
      this.applyDataFun()
    }
  },
  //判断是否有商家申请
  applyDataFun() {
    if (_this.data.applyData == '') {
      wx.showToast({
        title: '无商家提交',
        icon: "none"
      })
      wx.stopPullDownRefresh()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this

    this.getApply()

    setTimeout(() => {
      this.applyDataFun()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    this.applyDataFun()
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