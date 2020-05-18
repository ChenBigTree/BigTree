// miniprogram/pages/my/administrator/courseShelf/courseShelf.js
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    someData: ''
  },
  handle(e) {
    // if (e.currentTarget.dataset.state == 'yes') {
    //   this.updateFun("update", e.currentTarget.dataset.id,"yes")
    // } else {
    //   this.updateFun("update", e.currentTarget.dataset.id,"no")
    // }
  },
  updateFun(fun, id, update) {
    let _this = this
    // wx.cloud.callFunction({
    //   name: "stairway",
    //   data: {
    //     fun: fun,
    //     id: id,
    //     update: update
    //   },
    //   success: res => {
    //     console.log("处理成功")
    //     _this.someData() 
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },
  // 获取全部动态
  getData() {
    // wx.cloud.callFunction({
    //   name: "stairway",
    //   data: {
    //     fun: "get",
    //     get: "all",
    //     collective: "circle"
    //   },
    //   success: res => {
    //     console.log("全部", res.result.data)
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },

  // 获取待处理动态
  someData() {
    // wx.cloud.callFunction({
    //   name: "stairway",
    //   data: {
    //     fun: "get",
    //     get: "some",
    //     collective: "circle"
    //   },
    //   success: res => {
    //     console.log("待处理", res.result.data)
    //     function compare(e) {
    //       return function (a, b) {
    //         var value1 = a[e];
    //         var value2 = b[e];
    //         return parseInt(value1) - parseInt(value2);
    //       }
    //     }
    //     var arr2 = res.result.data.sort(compare('time')).reverse();
    //     _this.setData({
    //       someData: arr2
    //     })
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    // this.getData()
    this.someData()
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