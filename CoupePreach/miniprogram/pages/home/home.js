// miniprogram/pages/home/home.js
let _this
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs1: ['全部', '推荐', '最新', '热门'],
    wallData: "",
    current_scroll: '1'
  },

  handleChangeScroll({
    detail
  }) {
    console.log("detail.key", detail.key)
    this.setData({
      current_scroll: detail.key
    });
    if (detail.key == 1) {
      this.getHomeAllData()
    } else if (detail.key == 3) {
      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "homeAll",
        },
        success: res => {
          let s = res.result.data
          for (let i = 0; i < s.length; i++) {
            let date = `${new Date(s[i].time).getFullYear()}-${Number(new Date(s[i].time).getMonth() + 1) >10?Number(new Date(s[i].time).getMonth() + 1):'0'+Number(new Date(s[i].time).getMonth() + 1)}-${new Date(s[i].time).getDate()>10?new Date(s[i].time).getDate():'0'+new Date(s[i].time).getDate()}`
            s[i].date = date
          }
          var arr2 = s.sort(_this.compare('time')).reverse();
          _this.setData({
            wallData: arr2
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    } else if (detail.key == 2) {
      // this.getHomeAllData()
      _this.setData({
        wallData: ""
      })
    } else if (detail.key == 4) {
      _this.setData({
        wallData: ''
      })
      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "homeAll",
        },
        success: res => {
          console.log("热门的前五条数据", res.result)
          var arr2 = res.result.data.sort(_this.compare('views')).reverse();
          arr2 = arr2.slice(0, 2)
          _this.setData({
            wallData: arr2
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    } else if (detail.key > 4) {
      _this.setData({
        wallData: ''
      })
      let tag = _this.data.lists[detail.key - 5].tag
      console.log(tag)
      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "homeAssign",
          tag: tag
        },
        success: res => {
          console.log(res.result.data)
          let s = res.result.data
          for (let i = 0; i < s.length; i++) {
            let date = `${new Date(s[i].time).getFullYear()}-${Number(new Date(s[i].time).getMonth() + 1) >10?Number(new Date(s[i].time).getMonth() + 1):'0'+Number(new Date(s[i].time).getMonth() + 1)}-${new Date(s[i].time).getDate()>10?new Date(s[i].time).getDate():'0'+new Date(s[i].time).getDate()}`
            s[i].date = date
          }
          _this.setData({
            wallData: s
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
  handleChange(e) {
    console.log(e.detail.value);
  },
  // 获取全部动态
  getHomeAllData() {
    _this.setData({
      wallData: ''
    })
    wx.cloud.callFunction({
      name: "stairway",
      data: {
        fun: "get",
        get: "homeAll",
      },
      success: res => {
        console.log("全部", res.result.data)
        let s = res.result.data
        for (let i = 0; i < s.length; i++) {
          let date = `${new Date(s[i].time).getFullYear()}-${Number(new Date(s[i].time).getMonth() + 1) >10?Number(new Date(s[i].time).getMonth() + 1):'0'+Number(new Date(s[i].time).getMonth() + 1)}-${new Date(s[i].time).getDate()>10?new Date(s[i].time).getDate():'0'+new Date(s[i].time).getDate()}`
          s[i].date = date
        }
        _this.setData({
          wallData: s
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  lookDetail(e) { // 点击指定的动态进入详情
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.sid,
    })
  },
  compare(e) {
    return function (a, b) {
      var value1 = a[e];
      var value2 = b[e];
      return parseInt(value1) - parseInt(value2);
    }
  },
  lists() { // 获取分类列表
    _this.setData({
      lists: ''
    })
    wx.cloud.callFunction({
      name: 'projectClassify',
      data: {
        collectionName: 'curriculumClassify',
        fun: "get"
      },
      success: res => {
        console.log('分类列表', res.result.data)
        _this.setData({
          lists: res.result.data,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.getHomeAllData()
    this.lists() 
    console.log("app=>", app.globalData)
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
    this.getHomeAllData()
    this.lists() 
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