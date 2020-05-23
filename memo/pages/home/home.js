// pages/home/home.js
var _this;
let db = wx.cloud.database()
let memo = db.collection("memo-ArticleList")
let _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hides: true
  },
  remove() {
    wx.cloud.callFunction({
      name: "memo-ArticleList",
      data: {
        fun: "remove",
        name: "memo-ArticleList",
      }, success: r => {
        console.log(r)
      }, fail: e => {
        console.log(e)
      }
    })
  },
  // 展示一言展示框
  touse() {
    this.setData({
      hides: false
    })
  },
  // 隐藏一言展示框
  top() {
    this.setData({
      hides: true
    })
  },
  // 获取时间
  timeFun() {
    var time = new Date;
    var day = time.getDay();
    var date = time.getDate();
    day = day == 0 ? "天" : day == 1 ? "一" : day == 2 ? "二" : day == 3 ? "三" : day == 4 ? "四" : day == 5 ? "五" : "六"
    date = date < 10 ? "0" + date : date
    _this.setData({
      date,
      day
    })
  },

  // 获取一言
  hitokotoFun() {
    wx.request({
      url: "https://v1.hitokoto.cn",

      method: "get",
      dataType: "json",
      success(res) {
        console.log("一言", res.data)
        _this.setData({
          hitokoto: {
            hitokoto: res.data.hitokoto,
            name: res.data.from_who == null ? res.data.from : res.data.from_who
          }
        })
        // 停止下拉刷新
        wx.stopPullDownRefresh()
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  // 获取美文
  getBeautifulEssay() {
    wx.showLoading({
      title: '加载中',
    })
    let arr = []
    for (let i = 0; i < 12; i++) {
      (function(i) {
        wx.cloud.callFunction({
          name: "memo-ArticleList",
          data: {
            fun: "get",
            i: i
          },
          success: res => {
            // console.log(res.result.data)
            arr[i] = res.result.data
            let index = 0
            arr.forEach(function() {
              index++
            })
            if (index == 12) {
              _this.setData({
                ArticleList: arr
              })
              wx.hideLoading()
              console.log("this.data.ArticleList==>", _this.data.ArticleList)
            }
          },
          fail: err => {
            console.log(err)
          }
        })
      })(i)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    this.timeFun()
    this.hitokotoFun()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getBeautifulEssay()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.hitokotoFun()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})