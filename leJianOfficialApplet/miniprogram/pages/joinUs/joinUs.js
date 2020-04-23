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
    iponeVal: "", // 手机号码Val
    companyName: "",
    linkman: "",
    vcode: "", // 存储随机获取验证码
    useInfo: null,
    dialogShow: false,
    isShowBut: false,
    isShow: false,
    text:""
  },
  // 获取手机号
  getiponeValFun(e) {
    this.setData({
      iponeVal: e.detail.value
    })
  },
  // 点击提交时触发
  formSubmit: function (e) {
    if (!app.globalData.userInfo) {
      _this.openConfirm()
      console.log("_this.data.useInfo", _this.data.useInfo)
    } else {
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

      setTimeout(() => {
        wx.navigateTo({
          url: '../joinUs/joinUs-Ok/joinUs-OK',
        })
      }, 1500)

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
                fun: "add",
                name: res.userInfo.nickName,
                useImg: res.userInfo.avatarUrl,
                openid: openid.result.openid,
                companyName: formVal.companyName,
                linkman: formVal.linkman,
                iponeVal: _this.data.iponeVal,
                process: false,
                isPass: false
              }
            })
          }).then((res) => {
            console.log("添加成功")

            _this.setData({
              companyName: "",
              linkman: "",
              iponeVal: "",
              Verification_Code: "",
            })
          })
        },
      })
    }
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

  But() {
    wx.cloud.callFunction({
      name: "isShowPage",
      data: {
        page: "del"
      }
    }).then(res => {
      console.log("重新提交成功", res)

      _this.setData({
        isShow: false,
      })
    }).catch(err => {
      console.log("重新提交失败")
    })
  },

  getUserInfo: function (e) {
    wx.cloud.callFunction({
      name: "login"
    }).then((res) => {
      let userInfoData = {
        openid: res.result.openid,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        city: e.detail.userInfo.city
      }
      app.globalData.userInfo = userInfoData
      this.setData({
        showLogin: !_this.data.showLogin,
        userInfo: userInfoData
      });

      wx.cloud.callFunction({
        name: "userInfoData",
        data: {
          openid: res.result.openid,
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          city: e.detail.userInfo.city,
          isAdministrator: true,
          fun: "add"
        },
        success(r) {
          console.log("存储成功", r.result)
        }
      })
      console.log("userInfoData==>", userInfoData)
    })
    if (_this.userInfoReadyCallback) {
      _this.userInfoReadyCallback(res)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    if (app.globalData.userInfo) {
      _this.setData({
        userInfo: app.globalData.userInfo
      })
      console.log("当前页面 data", _this.data.userInfo)
    }

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
    _this.setData({
      isShowBut: false
    })
    wx.cloud.callFunction({
      name: "isShowPage",
      data: {
        page: "joinUs"
      }
    }).then((res) => {
      console.log(res.result)
      _this.setData({
        isShow: res.result.isB,
        text: res.result.isText
      })
      console.log(res.result.isText)
      if (res.result.isText == "你提交的申请未能通过审核") {
        console.log(res.result.isText)
        _this.setData({
          isShowBut: true
        })
      }
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