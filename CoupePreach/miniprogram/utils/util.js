function t(t) {
  return (t = t.toString())[1] ? t : "0" + t;
}
var Verification = (function () {
  var reg = {
    phone: /^1(3|4|5|7|8)\d{9}$/, // 手机号
    email: /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/, // 邮箱
    special: /^[\u4e00-\u9fa5]+$/g, // 只匹中文字符
    money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/ // 钱
  }
  return reg;
}());

var requestFn = function (josn) {
  wx.request({
    url: url + josn.url,
    data: josn.data,
    method: josn.method || 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: josn.success || null,
    fail: josn.fail || null,
    complete: josn.complete || null
  })
}
var showModal = function (title, text) {
  if (arguments.length == 1) {
    text = arguments[0];
    title = null;
  }
  wx.showModal({
    title: title || "提示",
    showCancel: false,
    content: text
  });
}
// 弹出层，关于全部的页面，跳转
var reLaunch = function (test, url) {
  wx.showModal({
    title: '提示',
    content: test,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        wx.reLaunch({
          url: url
        })
      }
    }
  })
}
module.exports = {
  requestFn: requestFn, // 公共的接口
  Verification: Verification, // 验证手机号码
  reLaunch: reLaunch,
  showModal: showModal,
  // sendSms:sendSms // 发送短信验证
  formatTime: function (e) {
    var n = e.getFullYear(),
      o = e.getMonth() + 1,
      r = e.getDate(),
      u = e.getHours(),
      i = e.getMinutes(),
      g = e.getSeconds();
    return [n, o, r].map(t).join("/") + " " + [u, i, g].map(t).join(":");
  },
  buttonClicked: function (self) {
    self.setData({
      buttonClicked: true
    })
    setTimeout(function () {
      self.setData({
        buttonClicked: false
      })
    }, 500)
  }
};