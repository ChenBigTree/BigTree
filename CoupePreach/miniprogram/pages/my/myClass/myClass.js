// pages//my/myClass/myClass.js
let app = getApp()
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    console.log("全局私人信息", app.globalData.userInfo)
    let dis = app.globalData.userInfo.distributionMember
    for (let i in dis) {
      dis[i].time = `${new Date(dis[i].createTime).getFullYear()}-${(new Date(dis[i].createTime).getMonth()+1)>9?(new Date(dis[i].createTime).getMonth()+1):"0"+(new Date(dis[i].createTime).getMonth()+1)}-${new Date(dis[i].createTime).getDate()>9?new Date(dis[i].createTime).getDate():"0"+new Date(dis[i].createTime).getDate()}`
    }
    console.log("dis", dis)
    this.setData({
      myUserInfo: app.globalData.userInfo
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