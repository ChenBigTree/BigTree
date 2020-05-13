// pages/wenzhen/newNurse.js
let _this
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    recomList: [],
    selIndex: 0,
    nurse: null,
    scrollTop: 0,
    isSet: true,
    useInfo: "",
    price: 1,
    isBuy: false
  },
  handleChange1({ // 用户修改自己课程的价格
    detail
  }) {
    this.setData({
      price: detail.value
    })
  },
  setStatus() {
    this.setData({
      hidden: !this.data.hidden
    })
  },

  toDetail(e) { // 跳转课程详情页
    console.log(e.currentTarget.dataset.id)
    if (!this.data.myUserInfo) {
      this.setData({
        dialogShow: true
      })
    } else {
      if (this.data.isBuy) {
        wx.navigateTo({
          url: '../../myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.id,
        })
      } else {
        wx.showToast({
          title: "先购买再听课",
          icon: "none"
        })
      }
    }
  },
  set() {
    this.setData({
      isSet: !this.data.isSet
    })
  },
  // onqg_5cHwV816egQzqPel1rDZRtA openid createTime
  // 购买功能
  toPay: function () {
    let that = this;
    if (!that.data.myUserInfo) {
      that.setData({
        dialogShow: true
      })
    } else {
      console.log('toPay--->', that.data.useInfo)

      let money = that.data.price
      let gname = that.data.useInfo.nickName + "的全部课程"
      wx.cloud.callFunction({
        name: "yunPay",
        data: {
          orderid: "XJT" + new Date().getTime(),
          money: money,
          // money: 0.01,
          gname: gname,
        },
        success(res) {
          console.log("提交成功", res.result)
          that.pay(res.result.result)
        },
        fail(res) {
          console.log("提交失败", res)
        }
      })
    }
  },

  //实现小程序支付
  pay(payData) {
    let that = this
    //官方标准的支付方法
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
        console.log("支付成功", res)
        wx.cloud.callFunction({
          name: "userInfo",
          data: {
            fun: "update",
            update: "distributionMember",
            id: that.data.useInfo._id,
            useInfo: that.data.useInfo
          },
          success: res => {
            console.log("支付成功 修改个人资料", res)
            that.getMy()
            that.getOne(that.data.useInfo.openid)
          },
          fail: err => {
            console.log("支付失败 修改个人资料", err)
          }
        })
      },
      fail(res) {
        console.log("支付失败", res)
      },
      complete(res) {
        console.log("支付完成", res)
      }
    })
  },
  getMy() { //获取全局个人资料
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "get_personal",
      },
      success: res => {
        app.globalData.userInfo = res.result.data[0]
        this.setData({
          myUserInfo: res.result.data[0]
        })
        console.log("获取全局个人资料", app.globalData.userInfo)
      },
      fail: err => {
        console.log("获取个人资料 失败", err)
      }
    })
  },

  getOne(openid) { // 课程者信息
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "get_othersInformation",
        openid: openid
      },
      success: res => {
        console.log("课程者信息==>", res.result.data[0])
        for (let i in _this.data.myUserInfo.distributionMember) {
          if (openid == _this.data.myUserInfo.distributionMember[i].openid) {
            console.log("本人已购买全部课程")
            _this.setData({
              isShowPay: false,
              useInfo: res.result.data[0],
              isBuy: true
            })
            return
          }
        }
        _this.setData({
          isShowPay: true,
          useInfo: res.result.data[0],
          isBuy: false
        })
        console.log("this.data.isShowPay", this.data.isShowPay)
      }
    })
  },
  getRecomList(openid){ // 相关课程
    wx.cloud.callFunction({
      name: 'stairway',
      data: {
        fun: "get",
        get: "individual",
        openid: openid
      }
    }).then(res => {
      console.log('相关课程==>', res.result)
      let arr = res.result.data.data
      arr.forEach(item => {
        item.time = `${new Date(item.time).getFullYear()}-${Number(new Date(item.time).getMonth()+1) >=10?Number(new Date(item.time).getMonth()+1):"0"+Number(new Date(item.time).getMonth()+1)}-${Number(new Date(item.time).getDate())>=10?new Date(item.time).getDate():"0"+new Date(item.time).getDate()}`
      });
      this.setData({
        recomList: arr,
        isShow: res.result.isF
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    wx.showLoading({
      title: '正在加载',
    })
    this.getOne(options.openid)
    this.getRecomList(options.openid)
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },

  getUserInfo: function (e) {
    wx.getUserInfo({
      success: e => {
        wx.cloud.callFunction({
          name: "login"
        }).then((res) => {
          let userInfoData = {
            nickName: e.userInfo.nickName,
            avatarUrl: e.userInfo.avatarUrl,
            individualResume: '',
            city: e.userInfo.city,
            isAdministrator: false, // 是否管理员
            isTeacher: true, // 是否讲师
            isDistributionMember: false, // 是否分销员
            fans: [], // 粉丝
            partner: [], // 伙伴
            PriceOfCourse: 50,
            openid: res.result.openid,
            distributionMember: [] // 购买的课程
          }
          app.globalData.userInfo = userInfoData
          _this.setData({
            showLogin: !_this.data.showLogin,
            userInfo: userInfoData
          });
          console.log("app=>", app.globalData)

          wx.cloud.callFunction({
            name: "userInfo",
            data: {
              userInfoData: userInfoData,
              fun: "add"
            },
            success(res) {
              console.log("存储成功 ==>", res)
            },
            fail: err => {
              console.log("存储失败 ==>", err)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("获取全局的用户信息 =>", app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        myUserInfo: app.globalData.userInfo
      })
      console.log("存储全局的用户信息 =>", this.data.myUserInfo)
    }
    this.getMy()
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

})