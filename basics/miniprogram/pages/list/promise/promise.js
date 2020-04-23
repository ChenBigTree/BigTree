// miniprogram/pages/list/promise/promise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      console.log("执行2秒的第一计数器")
    }, 2000);
    setTimeout(() => {
      console.log("执行1秒的第二计数器")
    }, 1000);

    new Promise((resolve,) => {
      setTimeout(() => {
        console.log("Promise 执行2秒的第一计数器")
        resolve("Promise 第一计数器 完成")
      }, 2000);
    }).then((resolve) => {
      console.log(resolve, "Promise 第二计数器开始")
      setTimeout(() => {
        console.log("Promise 执行1秒的第二计数器")
      }, 1000);
    }).catch((err) => {
      console.log("Promise 捕获错误 err", err)
    }).finally((fin)=>{
      // 不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。
      console.log('Promise finally 已全部完成')
    })
   
    console.log("现有对象转为 Promise 对象（方法1）", Promise.resolve('foo'))
    console.log("现有对象转为 Promise 对象（方法2）",Promise.resolve(resolve=>{
      resolve("resolve")
    }))
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