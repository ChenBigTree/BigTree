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
    userName: "bigtree",
    email: "eee@qq.com",
    password: "aaaaaa",
    ispassword: "aaaaaa",
    vcode: "", // 存储随机获取验证码
  },
  // 获取手机号
  getiponeValFun(e) {
    this.setData({
      iponeVal: e.detail.value
    })
  },
  // 获取邮箱
  getEmailValFun(e) {
    this.setData({
      email: e.detail.value
    })
  },
  // 获取密码
  getpasswordValFun(e) {
    this.setData({
      password: e.detail.value
    })
  }, 
  // 获取确认密码
  getispasswordValFun(e) {
    this.setData({
      ispassword: e.detail.value
    })
  },
  // 点击提交时触发
  formSubmit: function (e) {
    var formVal = e.detail.value; // 获取输入框的值
    if (formVal.userName == '') {
      Utils.showModal("用户名不能为空");
      return false
    }
    if (formVal.phone == '') {
      Utils.showModal("手机号不能为空");
      return false
    }

    var doIpone = this.VerificationIponeFn(formVal.phone); // 点击发送验证码时 验证一次手机号码
    if (!doIpone) {
      Utils.showModal("手机号码不正确");
      return false;
    }
    if (formVal.email == '') {
      Utils.showModal("邮箱不能为空");
      return false
    }
    var doeMail = this.VerificationEmailFn(formVal.email);
    if (!doeMail) {
      Utils.showModal("邮箱不正确");
      return false;
    }
    if (formVal.password == '') {
      Utils.showModal("密码不能为空");
      return false
    }
    var doPassword = this.VerificationPasswordFn(formVal.password); 
    if (!doPassword) {
      Utils.showModal("密码长度为5~17位，必须由字母开头");
      return false;
    }
    if (formVal.ispassword == '') {
      Utils.showModal("确认密码不能为空");
      return false
    }
    if (formVal.ispassword != _this.data.password) {
      Utils.showModal("确认密码与密码不一致");
      return false
    }
    if (formVal.Verification == '') {
      Utils.showModal("验证码不能为空");
      return false
    }
    if (formVal.Verification != this.data.vcode) {
      Utils.showModal("验证码不正确，请重试");
      return false
    }
    console.log(formVal)
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

  VerificationEmailFn(value) {
    var checkVal = Utils.Verification.email;
    var _this = this;
    _this.setData({
      email: value
    })
    return checkVal.test(_this.data.email)
  },
  VerificationPasswordFn(value) {
    var checkVal = Utils.Verification.password;
    var _this = this;
    _this.setData({
      password: value
    })
    return checkVal.test(_this.data.password)
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

  onLoad: function (options) {
    _this = this
  },

})