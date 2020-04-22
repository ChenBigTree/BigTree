let app = getApp()
let _this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    showLogin: false,
  },
  getUserInfo: function (e) {
    wx.getUserInfo({
      success: e => {
        wx.cloud.callFunction({
          name: "login"
        }).then((res) => {
          let userInfoData = {
            openid: res.result.openid,
            nickName: e.userInfo.nickName,
            avatarUrl: e.userInfo.avatarUrl,
            city: e.userInfo.city
          }
          app.globalData.userInfo = userInfoData
          this.setData({
            showLogin: !_this.data.showLogin,
            userInfo: userInfoData
          });

          wx.cloud.callFunction({
            name: "userInfoData",
            data: {
              openid: res.result.openid,
              nickName: e.userInfo.nickName,
              avatarUrl: e.userInfo.avatarUrl,
              city: e.userInfo.city,
              isAdministrator:false,
              fun:"add"
            },
            success(r) {
              console.log("存储成功", r.result)
            }
          })
          console.log("userInfoData==>", userInfoData)
        })
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(res)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    if (app.globalData.userInfo) {
      console.log("全局有用户信息", app.globalData.userInfo)
      _this.setData({
        userInfo: app.globalData.userInfo
      })
      console.log("data",_this.data.userInfo)
    } else {
      console.log("全局没有用户信息")
      wx.getSetting({
        success: e => {
          if (e.authSetting['scope.userInfo']) {
            console.log("已授权")
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            _this.getUserInfo()
          }
        },
      })
      console.log("全局app==>", app.globalData.userInfo)
    }
  },

  openConfirm: function () {
    this.setData({
      dialogShow: true
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