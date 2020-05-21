// miniprogram/pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false
  },
  getPhoneNumber(e) {
    console.log(e)
    // console.log("敏感数据对应的云 ID",e.detail.errMsg)
    // console.log("加密算法的初始向量",e.detail.iv)
    // console.log("完整用户信息的加密数据",e.detail.encryptedData)

    wx.cloud.callFunction({
      name:"getPhone",
      data:{
        cloudID:e.detail.cloudID
      },
      success:res=>{
        console.log("获取手机号",res.result.list[0].data.phoneNumber)
      },fail:err=>{
        console.log(err)
      }
    })
  },
  // 获取用户信息
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },
  getUserInfo: function (e) {
    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo'])
        wx.cloud.callFunction({
          name: 'login',
        }).then((apenid) => {
          console.log(apenid)
        })
        this.setData({
          userInfo: e.detail.userInfo
        })
        console.log('getUserInfo--->', e.detail.userInfo)
      }
    })
  },
  // 获取收货地址
  address() {
    wx.chooseAddress({
      success(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: "login"
          }).then((e) => {
            wx.getUserInfo({
              complete: (c) => {
                let userInfoDatas = {
                  openid: e.result.openid,
                  nickName: c.userInfo.nickName,
                  avatarUrl: c.userInfo.avatarUrl,
                  city: c.userInfo.city
                }
                console.log(userInfoDatas)
              },
            })
          })
        }
      }
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