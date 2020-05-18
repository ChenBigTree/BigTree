// miniprogram/pages/home/home.js
let _this
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate1Info: [{
      tag: '全部'
    }, {
      tag: '推荐'
    }, {
      tag: '最新'
    }, {
      tag: '热门'
    }],
    wallData: "",
    activeIndex: 0,
    current_scroll: '1',
    isShowListPage: false,
    class: 'bottom',
    li1: [],
    li2: [],
  },
  cc() {
    this.setData({
      class: "bottom"
    })
  },
  chooseCatalog: function (event) {
    this.setData({
      activeIndex: event.currentTarget.dataset.index,
      activeArr: event.currentTarget.dataset
    })
    _this.listFun()
    // console.log("activeArr", this.data.activeArr)
  },
  calAllScrollItem() {
    let query = wx.createSelectorQuery();
    let nodeRef = query.selectAll(".scroll-view-item");

    this.currentWidth = 0;
    nodeRef.boundingClientRect().exec(ret => {
      if (!ret || !ret.length) return;
      this.setData({
        calScrollItems: ret[0]
      });
    });
  },

  swiperChange: function (e) {
    console.log(e.detail.current)
    this.setData({
      activeIndex: e.detail.current,
    })
    this.calcScrollLeft();
  },
  // 横滑同步距离计算
  calcScrollLeft: function () {
    if (this.data.activeIndex < 2) this.setData({
      scrollLeft: 0
    });
    this.calcTextLength(this.data.activeIndex)
  },

  // 计算文本长度
  calcTextLength: function (index = 0) {
    if (!index || !this.data.cate1Info || !this.data.cate1Info.length) return 0
    let length = 0;
    const cate1Info = this.data.cate1Info;
    console.log("cate1Info", cate1Info)
    const currentWidth = this.data.calScrollItems[index].width;
    for (let i = 0; i < index; i += 1) {
      length += this.data.calScrollItems[i].width;
    }
    this.setData({
      scrollLeft: length - ((wx.getSystemInfoSync().windowWidth - currentWidth) / 2)
    });
    return length;
  },
  showListPage(e) { // 点击头部导航栏获取数据
    if (e.currentTarget.dataset.name != "listPage") {
      this.setData({
        class: "bottom",
        activeIndex: e.currentTarget.dataset.index,
        activeArr: e.currentTarget.dataset
      })
      // console.log("activeArr", this.data.activeArr)
      _this.listFun()
    } else {
      this.setData({
        class: "top"
      })
    }
  },

  listFun() {
    console.log("activeArr", this.data.activeArr)
    let index = this.data.activeArr.index
    if (index == undefined) {
      return
    }
    if (index == 0) {
      this.getHomeAllData()
    } else if (index == 1) {
      console.log("推荐")
    } else if (index == 2) {
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

          _this.liFun(arr2)
        },
        fail: err => {
          wx.hideLoading()
          console.log(err)
        }
      })
    } else if (index == 3) {
      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "homeAll",
        },
        success: res => {
          console.log("热门的前五条数据", res.result)
          var arr2 = res.result.data.sort(_this.compare('views')).reverse();
          arr2 = arr2.slice(0, 5)

          _this.liFun(arr2)
        },
        fail: err => {
          console.log(err)
        }
      })
    } else {

      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "homeAssign",
          tag: _this.data.activeArr.name
        },
        success: res => {
          console.log(_this.data.activeArr.name + "的数据", res.result.data)
          let s = res.result.data
          for (let i = 0; i < s.length; i++) {
            let date = `${new Date(s[i].time).getFullYear()}-${Number(new Date(s[i].time).getMonth() + 1) >10?Number(new Date(s[i].time).getMonth() + 1):'0'+Number(new Date(s[i].time).getMonth() + 1)}-${new Date(s[i].time).getDate()>10?new Date(s[i].time).getDate():'0'+new Date(s[i].time).getDate()}`
            s[i].date = date
          }
          _this.liFun(s)
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }
      })
    }
  },
  // 获取全部动态
  getHomeAllData() {
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
        _this.liFun(s)
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  liFun(data) {
    console.log(data)
    let li1 = []
    let li2 = []
    if (data.length == 0) {
      _this.setData({
        li1: [],
        li2: [],
      })
      return
    }
    for (let key in data) {
      if (key % 2 == 0) {
        li1.push(data[key])
        _this.setData({
          li1: li1
        })
      } else {
        li2.push(data[key])
        _this.setData({
          li2: li2
        })
      }
      wx.hideLoading()
      // if (li1.length + li2.length == data.length) {
      //   console.log("li1", li1)
      //   console.log("li2", li2)
      // }
    }
  },
  // height(s) { // 通过判断li1与li2的高度进行添加数据
  //   const promise1 = new Promise((resolve) => {
  //     let query = wx.createSelectorQuery();
  //     query.select(`.li-1`).boundingClientRect().exec(ret => {
  //       resolve(ret[0].height);
  //     })
  //   });
  //   const promise2 = new Promise((resolve) => {
  //     let query = wx.createSelectorQuery();
  //     query.select(`.li-2`).boundingClientRect().exec(ret => {
  //       _this.setData({
  //         height2: ret[0].height
  //       })
  //       resolve(ret[0].height);
  //     })
  //   });
  //   promise1.then((value1) => {
  //     promise2.then((value2) => {
  //       let li1 = []
  //       let li2 = []
  //       console.log("s==>", s)
  //       for (let key in _this.data.wallData) {
  //         if (key % 2 == 0) {
  //           li1.push(_this.data.wallData[key])
  //           _this.setData({
  //             li1: li1
  //           })
  //         } else {
  //           li2.push(_this.data.wallData[key])
  //           _this.setData({
  //             li2: li2
  //           })
  //         }
  //         wx.hideLoading()
  //         // if (li1.length + li2.length == _this.data.wallData.length) {
  //         //   console.log("li1", li1)
  //         //   console.log("li2", li2)
  //         // }
  //       }
  //     })
  //   });

  // },
  lookDetail(e) { // 点击指定的动态进入详情
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.sid,
    })
  },
  compare(e) { // 数据排序
    return function (a, b) {
      var value1 = a[e];
      var value2 = b[e];
      return parseInt(value1) - parseInt(value2);
    }
  },
  lists() { // 获取分类列表
    let _this = this
    wx.cloud.callFunction({
      name: 'projectClassify',
      data: {
        collectionName: 'curriculumClassify',
        fun: "get"
      },
      success: res => {
        console.log('分类列表', res.result.data)
        wx.hideLoading()
        _this.setData({
          lists: _this.data.cate1Info.concat(res.result.data)
        })
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.calAllScrollItem()
    console.log("app=>", app.globalData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHomeAllData()
    this.lists()
    wx.showLoading({
      title: '正在加载中',
    })
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