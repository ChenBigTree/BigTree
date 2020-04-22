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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    _this = this;
    this.timeFun()
    this.hitokotoFun()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    for (let i = 1; i <= 12; i++) {
      (function(i) {
        wx.cloud.database().collection("memo-ArticleList").where({
          "time.month": _.eq(i)
        }).get({
          success: r => {
            arr[i] = res.data
            if (i == 12) {
              // _this.setData({
              //   arr: arr
              // })
              console.log("arr", arr)
              // console.log("_this.data.arr", _this.data.arr)
            }
          },
          fail: e => {
            console.log(e)
          }
        })

      })(i)
    }
    // let arr = []
    // wx.cloud.callFunction({
    //   name: "memo-ArticleList",
    //   data: {
    //     fun: "get"
    //   },
    //   success: r => {
    //     let data = r.result.data
    //     for (let i = 1; i <= 12; i++) {
    //       (function(i) {
    //         for (let j in data) {
    //           if (data[j].time.month == i) {
    //             arr[i] = data[j]
    //             if (i == 12) {
    //               _this.setData({
    //                 arr:arr
    //               })
    //               console.log("arr", arr)
    //               console.log("_this.data.arr",_this.data.arr)
    //             }
    //           }
    //         }
    //       })(i)

    //     }
    //   },
    //   fail: e => {
    //     console.log(e)
    //   }
    // })
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