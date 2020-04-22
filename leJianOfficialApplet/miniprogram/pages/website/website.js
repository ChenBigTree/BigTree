/**
 *  require合法域名:apis.map.qq.com
 * * */
let QQMapWX = require("../../utils/qqmap-wx-jssdk");
let qqmapsdk;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: true,
    style: 'header-brief-text textOverflows',

    corporateInformation: {
      corporateName: '',
      corporatePhone: '',
      corporateIcon: '',
      corporateaddress: '',
      corporateBrief: '',
      corporateDetails: [{
        detailsName: 'sadasasdasdsadaddasd',
        detailsPrice: '389.00',
        detailsImg: '../icon/1.png',
        detailsurl: '../ccc/ccc'
      }, ]
    }
  },
  // 公司简介的下拉标签
  exhibition() {
    if (this.data.list == true) {
      this.setData({
        list: false,
        style: "header-brief-text textOverflows"
      })
    } else {
      this.setData({
        list: true,
        style: "header-brief-text"
      })
    }
  },
  // 点击拨号按钮进行拨号
  callUpFun() {
    wx.makePhoneCall({
      phoneNumber: this.data.corporateInformation.corporatePhone,
    })
  },

  // 点击地址信息跳转地图查看路线规划
  mapFun() {
    qqmapsdk.geocoder({
      address: _this.data.corporateInformation.corporateaddress,
      success: function (res) {
        const key = 'H6CBZ-XYH3F-RW6JJ-J7ELC-77SE2-YEFZI'; //使用在腾讯位置服务申请的key
        const referer = 'wx99155eb36a6a05c7'; //调用插件的app的名称
        const endPoint = JSON.stringify({
          'name': _this.data.corporateInformation.corporateaddress,
          'latitude': res.result.location.lat,
          'longitude': res.result.location.lng
        });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("id==>", e.id)
    _this = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'QFSBZ-52NRP-J2OD4-LYWNA-PY5XV-JCFSV'
    });
    wx.cloud.callFunction({
      name: "addFormVal",
      data: {
        fun:"get",
        collectionName: "CompanyProfileList",
        where: e.id
      }
    }).then(res => {
      let cor = _this.data.corporateInformation
      let form = res.result.data[0].formVal
      cor.corporateName = form.companyName
      cor.corporateBrief = form.companyBrief
      cor.corporateaddress = form.companyaddress
      cor.corporateIcon = form.logoSrc
      cor.linkman = form.linkman
      cor.corporatePhone = form.iponeVal
      _this.setData({
        corporateInformation: cor
      })
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