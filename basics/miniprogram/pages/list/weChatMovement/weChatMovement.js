// pages/list/weChatMovement/weChatMovement.js
var WXBizDataCrypt = require("../../utils/RdWXBizDataCrypt")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  compare(e) {
    return function (a, b) {
      var value1 = a[e];
      var value2 = b[e];
      return parseInt(value1) - parseInt(value2);
    }
  },
  weChatMovement() {
    let _this = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        console.log("res.code", res.code)
        if (res.code) {
          var APPID = 'wxafa3ec7cc695fda2'
          var SECRET = 'da06ad3de832ff0f461e3fe232421822'
          var JSCODE = res.code
          var session_key
          console.log("JSCODE " + JSCODE)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + JSCODE + '&grant_type=authorization_code',
            data: {
              //code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log("res.data " + res.data)
              session_key = res.data.session_key
              console.log("session_key: " + session_key)
              wx.getWeRunData({
                success(res) {
                  const encryptedRunData = res.encryptedData
                  const runiv = res.iv
                  console.log("加密的数据: " + encryptedRunData)
                  var pc = new WXBizDataCrypt(APPID, session_key)
                  var tmpdata = pc.decryptData(encryptedRunData, runiv).stepInfoList
                  for (let i in tmpdata) {

                    let year = new Date(tmpdata[i].timestamp * 1000).getFullYear()
                    let month = new Date(tmpdata[i].timestamp * 1000).getMonth() + 1
                    month = month > 9 ? month : "0" + month
                    let date = new Date(tmpdata[i].timestamp * 1000).getDate()
                    date = date > 9 ? date : "0" + date
                    let time = year + "年" + month + "月" + date + "日"
                    tmpdata[i].time = time
                  } 

                  var arr2 = tmpdata.sort(_this.compare('time')).reverse();
                  console.log("解密后data：", arr2)
                  _this.setData({
                    wxwalk:arr2
                  })
                }
              })
            }
          })
        } else {
          console.log('失败' + res.errMsg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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