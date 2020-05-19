// pages/my/my.js
let _this
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowImage: false
  },
  openConfirm: function (e) {
    if (_this.data.userInfo == null) {
      this.setData({
        dialogShow: true
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  imageFun(e) { // 查看图片，点击打开新页面展示图片内容
    wx.navigateTo({
      url: './showImage?url=' + e.currentTarget.dataset.url,
    })
    return
    wx.hideTabBar()

    this.setData({
      showImage: e.currentTarget.dataset.url,
      isShowImage: true
    })

    if (e.currentTarget.dataset.name == "image-text") {
      this.data.isShowImage == false ? wx.showTabBar() : wx.hideTabBar()
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          const src = res.tempFilePaths[0];
          console.log("src==>", src)
          //  获取裁剪图片资源后，给data添加src属性及其值
          wx.navigateTo({
            url: `/components/cropper/cropper?src=${src}`,
          })
        }
      })
    } else if (e.currentTarget.dataset.name == "imagePage") {
      this.data.isShowImage == false ? wx.hideTabBar() : wx.showTabBar()
      this.setData({
        isShowImage: false
      })
    }
  },

  getUserInfo: function (e) {
    wx.getUserInfo({
      success: e => {
        wx.cloud.callFunction({
          name: "login"
        }).then((res) => {
          let userInfoData = {
            nickName: e.userInfo.nickName,
            avatarUrl: e.userInfo.avatarUrl,
            individualResume: '',
            city: e.userInfo.city,
            isAdministrator: false, // 是否管理员
            isTeacher: false, // 是否讲师
            isDistributionMember: false, // 是否分销员
            fans: [], // 粉丝
            partner: [], // 伙伴
            PriceOfCourse: 50,
            openid: res.result.openid,
            distributionMember: [] // 购买的课程
          }
          app.globalData.userInfo = userInfoData
          this.setData({
            showLogin: !_this.data.showLogin,
            userInfo: userInfoData
          });
          console.log("app=>", app.globalData)

          wx.cloud.callFunction({
            name: "userInfo",
            data: {
              userInfoData: userInfoData,
              fun: "add"
            },
            success(res) {
              console.log("存储成功 ==>", res)
            },
            fail: err => {
              console.log("存储失败 ==>", err)
            }
          })
          console.log("userInfoData==>", userInfoData)
        })
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(res)
        }
      }
    })
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
    console.log("app.globalData.userInfo", app.globalData.userInfo)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: "userInfo",
            data: {
              fun: "get_personal"
            }
          }).then(res => {
            app.globalData.userInfo = res.result.data[0]
            _this.setData({
              userInfo: app.globalData.userInfo
            })
          })
        }
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