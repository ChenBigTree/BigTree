// miniprogram/pages/list/dataManipulation/dataManipulation.js
const db = wx.cloud.database()
const tesk = db.collection("my-task")
let _this
const _ = db.command
Page({

  data: {
    value1: ''
  },

  onChange1(e) {
    this.setData({
      value1: e.detail.value
    });
  },

  onChange2(e) {
    this.setData({
      add: e.detail.value
    });
  },

  onClick1() {
    tesk.where(_.or(
      [{
        value: db.RegExp({
          regexp: '.*' + _this.data.value1,
          options: 'i'
        })
      }]
    )).get({
      success: (res) => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  onClick2() {
    console.log(_this.data.add)
    if (_this.data.add != "") {
      tesk.add({
        data: {
          value: _this.data.add
        },
        success: res => {
          console.log("添加成功", res)
          _this.get()
        },
        fail: err => {
          console.log("添加失败", err)
        }
      })
    }
  },

  del(e) {
    console.log(e.currentTarget.dataset.id)
    tesk.doc(e.currentTarget.dataset.id).remove({
      success: res => {
        console.log("删除数据成功", res)
        _this.get()
      }
    })
  },
  
  get() {
    tesk.get({
      success: res => {
        console.log("获取数据成功", res)
        _this.setData({
          getData: res.data
        })
        console.log(_this.data.getData)
      },
      fail: err => {
        console.log("获取数据失败", err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this,
      _this.get()
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