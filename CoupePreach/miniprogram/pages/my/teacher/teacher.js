// pages/joinUs/joinUs.js
var Utils = require("../../../utils/util")
var app = getApp()
var _this;
let wait = 60
let isWait = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "发送验证码", // 发送验证码按钮的txt
    Verification_Code: "", // 验证码的input
    disabled: false, // 验证码按钮的点击状态
    phoneVal: "", // 手机号码Val
    vcode: "", // 存储随机获取验证码
    name: "", // 存储姓名
    disabledTJ: true,
    userInfo: app.globalData.userInfo
  },
  // 获取输入框值
  getphoneValFun(e) {
    if (e.currentTarget.dataset.name == "input1") {
      this.setData({
        phoneVal: e.detail.value
      })
    } else if (e.currentTarget.dataset.name == "input2") {
      this.setData({
        Verification_Code: e.detail.value
      })
    } else {
      this.setData({
        name: e.detail.value
      })
    }
    if (this.data.phoneVal != "" && this.data.Verification_Code != "" && this.data.name != "") {
      this.setData({
        disabledTJ: false
      })
    } else {
      this.setData({
        disabledTJ: true
      })
    }
  },
  openConfirm() {
    if (this.data.stateText == "申请不通过，请！" || this.data.stateText == "讲师资格已移除，请重新申请") {
      wx.cloud.callFunction({
        name: "teacherData",
        data: {
          fun: "remove"
        },
      }).then(res => {
        console.log("重新申请成功")
        _this.getMi()
      }).catch(err => {
        console.log("重新申请失败", err)
      })
    }
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
    var checkVal = Utils.Verification.phone;
    var doIpone = checkVal.test(_this.data.phoneVal)

    if (this.data.phoneVal == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
      return
    }

    if (!doIpone) {
      Utils.showModal("手机号码不正确");
      return false;
    }
    isWait = true
    _this.Countdown();

    _this.getValidCode()

    // return console.log('验证码为：', _this.data.vcode)
    let code = []
    code[0] = _this.data.vcode
    let phone = _this.data.phoneVal
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
  // 发送通知管理员
  sendSmss(phone) {
    // return console.log("已发送管理员手机号通知", phone)
    let code = []
    code[0] = "“" + _this.data.name + "”"
    wx.cloud.callFunction({
      name: "SMS",
      data: {
        phone: phone,
        code: code,
        templateid: 590951
      },
      success(res) {
        console.log('sndSms--->', res)
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
  },
  tj() {
    if (this.data.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: "none"
      })
      return
    }
    if (this.data.phoneVal == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
      return
    }
    if (this.data.Verification_Code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: "none"
      })
      return
    }
    if (this.data.Verification_Code != this.data.vcode) {
      wx.showToast({
        title: '验证码不正确',
        icon: "none"
      })
      return
    }

    var checkVal = Utils.Verification.phone;
    var doIpone = checkVal.test(_this.data.phoneVal)

    if (!doIpone) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: "none"
      })
      return false;
    }
    this.setData({
      disabledTJ: true,
    })
    wx.showLoading({
      title: "加载中"
    })
    wx.cloud.callFunction({ // 获取所有管理员手机号
      name: "userInfo",
      data: {
        fun: "get",
        get: "allAdministrator"
      }
    }).then(res => {
      console.log("allAdministrator", res.result.data)
      let adm = res.result.data
      for (let i in adm) {
        _this.sendSmss(adm[i].phone)
      }
    }).catch(err => {
      console.log(err)
    })
    // return
    wx.cloud.callFunction({
      name: "teacherData",
      data: {
        fun: "add",
        name: _this.data.name,
        phoneVal: _this.data.phoneVal,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      },
      success: res => {
        console.log(res)
        setTimeout(() => {
          wx.switchTab({
            url: "../my"
          })
          _this.setData({
            name: "",
            phoneVal: "",
            Verification_Code: "",
            disabledTJ: false,
          })
          wx.hideLoading()
        }, 2000)
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },

  Countdown: function (e) { // 发送验证码的倒计时fn
    if (isWait) {
      if (wait == 0) {
        _this.setData({
          time: "发送验证码",
          disabled: false
        })
        wait = 60;
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    console.log("userInfo", app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  getMi() {
    wx.cloud.callFunction({
      name: "teacherData",
      data: {
        fun: "get",
        get: "getMi"
      }
    }).then(res => {
      console.log("本人申请数据", res.result.data)
      _this.setData({
        getMi: res.result.data
      })
    }).catch(err => {
      console.log(err)
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
    this.getMi()
    wx.cloud.callFunction({
      name: "teacherData",
      data: {
        fun: "get",
        get: "getMi"
      }
    }).then((res) => {
      console.log("1", res.result.data)
      let stateText;
      let state;
      let isPassBtn
      if (res.result.data.length == 0) {
        stateText = "前往申请成为讲师",
          isPassBtn = true
      } else {
        state = res.result.data[0].state
        if (state.isDispose == false && state.isPass == false) {
          stateText = "您的申请待处理"
          isPassBtn = false
        } else if (state.isDispose == false && state.isPass == true) {
          stateText = "讲师资格已移除，请重新申请"
          isPassBtn = true
        } else if (state.isDispose == true && state.isPass == false) {
          stateText = "申请不通过，请重试！"
          isPassBtn = true
        } else {
          stateText = "您已成为我们讲师！"
          isPassBtn = false
        }
      }
      _this.setData({
        stateText,
        state,
        isPassBtn
      })
      console.log("提示", stateText)
    }).catch((err) => {
      console.log("1", err)
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
    wait = 60
    isWait = false
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