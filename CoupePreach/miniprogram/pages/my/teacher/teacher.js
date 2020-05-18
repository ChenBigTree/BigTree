// pages/joinUs/joinUs.js
var wait = 10; // 设置全局变量的time
var Utils = require("../../../utils/util")

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "发送验证码", // 发送验证码按钮的txt
    Verification_Code: "", // 验证码的input
    disabled: false, // 验证码按钮的点击状态
    iponeVal: "", // 手机号码Val
    vcode: "", // 存储随机获取验证码
  },
  // 获取手机号
  getiponeValFun(e) {
    this.setData({
      iponeVal: e.detail.value
    })
  },

  // 验证手机号函数
  VerificationIponeFn: function (value) {
    var checkVal = Utils.Verification.phone;
    var _this = this;
    _this.setData({
      iponeVal: value
    })
    return checkVal.test(_this.data.iponeVal)
  },

  // 获取六位验证码
  getValidCode() {
    let codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let codeString = '';
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random() * codes.length);
      codeString += codes[randomIndex];
    }
    return _this.setData({
      vcode: codeString
    });
  },

  // 发送验证码
  sendSms() {
    // 点击发送验证码时 验证一次手机号码
    var doIpone = _this.VerificationIponeFn(_this.data.iponeVal);
    if (!doIpone) {
      Utils.showModal("手机号码不正确");
      return false;
    }
    _this.Countdown();

    _this.getValidCode()
    console.log('验证码为：', _this.data.vcode)
    let code = []
    code[0] = _this.data.vcode
    let phone = _this.data.iponeVal
    wx.cloud.callFunction({
      name: "SMS",
      data: {
        phone: phone,
        code: code,
        templateid: 576112
      },
      success(res) {
        console.log('sndSms--->', res)
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
  },

  // 发送验证码的倒计时fn
  Countdown: function (e) {
    if (wait == 0) {
      _this.setData({
        time: "发送验证码",
        disabled: false
      })
      wait = 10;
    } else {
      if (wait < 10) {
        _this.setData({
          time: "重新发送 0" + wait,
          disabled: true
        })
        wait--;
        setTimeout(function () {
          _this.Countdown()
        }, 1000)
      } else {
        _this.setData({
          time: "重新发送 " + wait,
          disabled: true
        })
        wait--;
        setTimeout(function () {
          _this.Countdown()
        }, 1000)
      }
    }
  },

  // 输入验证码
  verificationCode: function (e) {
    var Code = e.detail.value;

    _this.setData({
      Verification_Code: Code
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this

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