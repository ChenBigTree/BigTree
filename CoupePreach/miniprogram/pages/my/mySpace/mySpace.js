// pages/wenzhen/newNurse.js
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
    isSet:true,
    btnSel: [{
        selected: true,
        item: '图文咨询',
        price: 50,
        times: 10,
        long: 48,
        tip: '通过文字、图片、语音进行咨询',
        content: '可以通过文字、图片、语音的形式和专家沟通;\n一次咨询的时效为48小时，在48小时内随时和医生沟通（对话上限为10次）;\n专家未回复问题可退款;'
      },
      {
        selected: false,
        item: '在线咨询',
        price: 100,
        times: 50,
        long: 48,
        tip: '与医生进行选定时长的电话咨询',
        content: '以电话的形式和医生沟通，时间和时长可自主选择;\n电话未接通可退款；'
      },
      {
        selected: false,
        item: '视频咨询',
        price: 200,
        times: 5,
        long: 48,
        tip: '与医生进行选定时长的视频咨询',
        content: '以视频的形式和医生沟通，时间和时长可自主选择;\n视频未接通可退款；'
      }
    ],

    useInfo: "",
    price: 1,
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

  toDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  set(){
    this.setData({
      isSet:!this.data.isSet
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.showLoading({
      title: '正在加载',
    })
    console.log(options.openid)
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "get_othersInformation",
        openid: options.openid
      },
      success: res => {
        console.log("个人信息==>", res.result.data)
        _this.setData({
          useInfo: res.result.data[0],
          price:res.result.data[0].PriceOfCourse
        })
      }
    })

    wx.cloud.callFunction({
      name: 'stairway',
      data: {
        fun: "get",
        get: "individual",
        openid: options.openid
      }
    }).then(res => {
      console.log('相关课程==>', res.result)
      let arr = res.result.data.data
      arr.forEach(item => {
        item.time = `${new Date(item.time).getFullYear()}-${Number(new Date(item.time).getMonth()+1) >=10?Number(new Date(item.time).getMonth()+1):"0"+Number(new Date(item.time).getMonth()+1)}-${Number(new Date(item.time).getDate())>=10?new Date(item.time).getDate():"0"+new Date(item.time).getDate()}`
      });
      this.setData({
        recomList: arr,
        isShow: res.result.data.isF
      })
      wx.hideLoading()
    })

    return
    this.setData({
      openid: options.openid
    })
    wx.cloud.callFunction({
      name: 'xj_getNurse',
      data: {
        type: 'byOpenid',
        openid: options.openid
      }
    }).then(res => {
      console.log('专家首页==>', res.result.data)
      let btnSel = this.data.btnSel
      btnSel[0].price = res.result.data[0].textPrice
      btnSel[1].price = res.result.data[0].onlinePrice
      btnSel[2].price = res.result.data[0].videoPrice
      this.setData({
        nurse: res.result.data[0],
        btnSel: btnSel
      })
      if (this.data.recomList) {
        wx.hideLoading({
          complete: (res) => {},
        })
      }

    })

  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
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