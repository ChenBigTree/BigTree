//app.js
App({
  onLaunch: function () {
    this.globalData = {
      userInfo: null
    }
    let _this = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wx99155eb36a6a05c7-8oeqj',
        traceUser: true,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: "login"
          }).then((e) => {
            wx.getUserInfo({
              complete: (c) => {
                let userInfoData = {
                  openid: e.result.openid,
                  nickName: c.userInfo.nickName,
                  avatarUrl: c.userInfo.avatarUrl,
                  city: c.userInfo.city
                }
                this.globalData.userInfo = userInfoData
                console.log("全局的userInfo", this.globalData.userInfo)
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
            })
          })
        }

      },
    })
  }
})