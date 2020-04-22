// pages/joinUs/joinUs.js
var wait = 10; // 设置全局变量的time
let app = getApp()
var Utils = require("../../utils/utils")

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "发送验证码", // 发送验证码按钮的txt
    Verification_Code: "", // 验证码的input
    disabled: false, // 验证码按钮的点击状态
    iponeVal: "15089600646", // 手机号码Val
    companyName: "",
    linkman: "",
    vcode: "", // 存储随机获取验证码
    useInfo: {},
  },
  // 获取手机号
  getiponeValFun(e) {
    this.setData({
      iponeVal: e.detail.value
    })
  },
  // 点击提交时触发
  formSubmit: function (e) {
    var formVal = e.detail.value; // 获取输入框的值
    if (formVal.companyName == '') {
      Utils.showModal("公司名称不能为空");
      return false
    }
    if (formVal.linkman == '') {
      Utils.showModal("联系人不能为空");
      return false
    }

    var doIpone = this.VerificationIponeFn(formVal.phone); // 点击发送验证码时 验证一次手机号码
    if (!doIpone) {
      Utils.showModal("手机号码不正确");
      return false;
    }
    if (formVal.Verification == '') {
      Utils.showModal("验证码不能为空");
      return false
    }
    if (formVal.Verification != this.data.vcode) {
      Utils.showModal("验证码不正确，请重试");
      return false
    }

    setTimeout(function () {
      wx.showToast("提交成功！");
    }, 1000)

    // setTimeout(() => {
    //   wx.navigateTo({
    //     url: '../joinUs/joinUs-Ok/joinUs-OK',
    //   })
    // }, 1500)
    
    delete formVal.Verification

    wx.getUserInfo({
      complete: (res) => {
        wx.cloud.callFunction({
          name: "login",
        }).then(openid => {
          console.log("提交的内容", formVal)
          // 获取云函数内部函数
          wx.cloud.callFunction({
            name: "addFormVal",
            data: {
              fun:"add",
              name: res.userInfo.nickName,
              useImg: res.userInfo.avatarUrl,
              openid: openid.result.openid,
              companyName:formVal.companyName,
              linkman:formVal.linkman,
              iponeVal:_this.data.iponeVal,
              process:false,
              isPass:false
            }
          })
        }).then((res) => {
          console.log("添加成功", res)

          _this.setData({
            companyName: "",
            linkman: "",
            iponeVal: "",
            Verification_Code: "",
          })
        })
      },
    })
  },

  openConfirm: function () {
    this.setData({
      dialogShow: true
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
    // let code = []
    // code[0] = _this.data.vcode
    // let phone = _this.data.iponeVal
    // wx.cloud.callFunction({
    //   name: "SMS",
    //   data: {
    //     phone: phone,
    //     code: code,
    //     templateid: 576112
    //   },
    //   success(res) {
    //     console.log('sndSms--->', res)
    //   },
    //   fail(res) {
    //     console.log("读取失败", res)
    //   }
    // })
  },

  // 发送验证码的倒计时fn
  Countdown: function (e) {
    if (wait == 0) {
      _this.setData({
        time: "发送验证码",
        disabled: false
      })
      // wait = 12;
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
    console.log("全局有用户信息", app.globalData.userInfo)
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