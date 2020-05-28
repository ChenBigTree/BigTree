// pages/list/weChatMovement/weChatMovement.js
var WXBizDataCrypt = require("../../utils/WXBizDataCrypt")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  weChatMovement() {

    wx.login({
      complete: (res) => {
        console.log("res", res)
        let code = res.code
        wx.request({
          url: 'http://localhost:8080/wxapp/onlogin',
          data: {
            code: res.code
          },
          success: function (resSession) {
            console.log("resSession", resSession)
            wx.getWeRunData({
              success(resRun) {
                const encryptedData = resRun.encryptedData
                let url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + code + "&grant_type=authorizationcode"
                console.log("encryptedData", encryptedData)
                console.log("iv", resRun.iv)
                console.log("code", code)
                console.log("url", url)
                let appid = "wxafa3ec7cc695fda2"
                let secret = "54c91375f96d0e16a041e3687873f5cb"

                var pc = new WXBizDataCrypt(appid, secret)

                console.log("pc", pc)
                var data = pc.decryptData(encryptedData, resRun.iv)

                console.log('解密后 data: ', data)
                return
                wx.request({
                  url: 'http://localhost:8080/wxapp/decrypt',
                  data: {
                    encryptedData: resRun.encryptedData,
                    iv: resRun.iv,
                    code: res.code
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  // header: {}, // 设置请求的 header
                  success: function (resDecrypt) {
                    // var runData = JSON.stringify(resDecrypt.data)
                    // console.info("步数信息1",runData);
                    console.info("步数信息", resDecrypt);
                    // console.info("步数信息2",resDecrypt.data.data);
                    return
                    if (runData.stepInfoList) {
                      runData.stepInfoList = runData.stepInfoList.reverse()
                      for (var i in runData.stepInfoList) {
                        runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp * 1000))
                      }
                      that.setData({
                        runData: runData.stepInfoList
                      });
                    }
                  }
                });
              }
            })
          }
        })
      },
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