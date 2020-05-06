//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'kpxjt-pjo8d',
        traceUser: true,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: "userInfo",
            data: {
              fun: "get_personal"
            },
            success: res => {
              console.log(res.result.data[0])
              this.globalData.userInfo = res.result.data[0]
              console.log("全局的userInfo==>", this.globalData)
              
              //  由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: err => {
              console.log(err)
            }
          })
        }

      },
    })
    this.globalData = {}
  }
})