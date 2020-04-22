// miniprogram/pages/login/login.js
let _this;
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false
  },
  func(){

  },
  userInfo(e) {
    console.log("获取用户头像", e.detail)
  },
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },
  getUserInfo: function (e) {
    wx.cloud.callFunction({
      name: "login"
    }).then((res) => {
      let userInfoData = {
        openid: res.result.openid,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        city: e.detail.userInfo.city
      }
      _this.setData({
        userInfo: userInfoData
      })
      wx.cloud.callFunction({
        name: "userInfoData",
        data: {
          userInfoData: userInfoData
        },
        success(r) {
          console.log("存储成功", r.result)
        }
      })
      console.log("userInfoData==>", userInfoData)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    // wx.getSetting({
    //   complete: (res) => {
    //     console.log("res", res.authSetting["scope.userInfo"])
    //     if (res.authSetting["scope.userInfo"]) {
    //       wx.cloud.callFunction({
    //         name: "login"
    //       }).then((res) => {
    //         let userInfoData = {
    //           openid: res.result.openid,
    //           nickName: e.detail.userInfo.nickName,
    //           avatarUrl: e.detail.userInfo.avatarUrl,
    //           city: e.detail.userInfo.city
    //         }
    //         _this.setData({
    //           userInfo: userInfoData
    //         })
    //         wx.cloud.callFunction({
    //           name: "userInfoData",
    //           data: {
    //             userInfoData: userInfoData
    //           },
    //           success(r) {
    //             console.log("存储成功", r)
    //           },
    //           fail(e) {
    //             console.log("存储失败,用户已存在", e)
    //           }
    //         })
    //       })
    //     }
    //   }
    // })
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