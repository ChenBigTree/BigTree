// miniprogram/pages/wenzhen/projectClassification.js
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classData: "",
    isShow: true,
    id: ""
  },
  input(e) {
    this.setData({
      input: e.detail.value
    })
  },
  // 项目分类
  btn1(e) {
    _this.setData({
      isShow: !_this.data.isShow
    })
    let name = e.currentTarget.dataset.name
    if (name == "add2") {
      _this.caozuoFun("add", _this.data.input, "", "添加")
    } else if (name == "textbtn") {
      _this.caozuoFun("update", _this.data.input, _this.data.id, "更新")
    } else if (name == "add1") {
      this.setData({
        isBtn: false
      })
    } else if (name == "text") {
      _this.setData({
        input: e.currentTarget.dataset.text,
        id: e.currentTarget.dataset.id
      })
      this.setData({
        isBtn: true
      })
    }
  },
  caozuoFun(fun, tag, id, text) {
    if (tag == undefined || tag == "") {
      return wx.showToast({
        title: "内容不能为空",
        icon: "none"
      })
    }
    wx.cloud.callFunction({
      name: "projectClassify",
      data: {
        fun: fun,
        tag: tag,
        _id: id,
        collectionName: "curriculumClassify"
      },
      success: res => {
        wx.showToast({
          title: text + "成功",
          icon: "none"
        })
        if (res.result == "项目名已存在") {
          wx.showToast({
            title: "项目名已存在",
            icon: "none"
          })
        }
        _this.setData({
          input: ""
        })
        _this.getData()
      },
      fail: err => {
        wx.showToast({
          title: text + "失败",
          icon: "none"
        })
      }
    })
  },
  // 获取项目名称
  getData() {
    wx.cloud.callFunction({
      name: 'projectClassify',
      data: {
        fun: "get",
        collectionName: "curriculumClassify"
      },
      success: res => {
        _this.setData({
          classData: res.result.data
        })
      },
      fail: err => {wx.showToast({
        title: "数据获取不到",
        icon: "none"
      })
      }
    })
  },
  //删除项目名称
  delData(e) {
    wx.showModal({
      title: '是否删除以下项目类型',
      content: e.currentTarget.dataset.text,
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "projectClassify",
            data: {
              fun: "del",
              _id: e.currentTarget.dataset.id,
              collectionName: "curriculumClassify"
            },
            success: res => {
              wx.showToast({
                title: "删除成功",
                icon: "none"
              })
              _this.getData()
            },
            fail() {
              wx.showToast({
                title: "删除失败",
                icon: "none"
              })
            }
          })
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
    this.getData()
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