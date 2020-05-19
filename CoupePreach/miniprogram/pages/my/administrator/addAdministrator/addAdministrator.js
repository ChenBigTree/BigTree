let _this
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    class: '',
    isHad: true,
    isShow: true,
  },

  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 项目分类
  btn1(e) {
    let name = e.currentTarget.dataset.name
    console.log(name)
    return
    if (name == "add2") {
      _this.caozuoFun("add", _this.data.input, "", "添加")
    } else if (name == "textbtn") {
      _this.caozuoFun("update", _this.data.input, _this.data.id, "更新")
    } else if (name == "text") {
      _this.setData({
        input: e.currentTarget.dataset.text,
        id: e.currentTarget.dataset.id,
        isBtn: true
      })
    }
  },
  operationAdm(e) { // 删除/添加管理员
    if (e.currentTarget.dataset.btn == "del") {
      wx.showModal({
        content: "确定删除" + e.currentTarget.dataset.nickname + "管理员?",
        confirmText: "删除",
        success: (res) => {
          if (res.confirm == true) {
            _this.operationFun(e.currentTarget.dataset.openid, false, "删除")
          }
        },
      })
    } else {
      _this.setData({
        class: "top",
        inputValue: "",
        searchUser: "",
        isHad: true
      })
      // this.btn1("添加")

      _this.setData({
        isShow: !_this.data.isShow
      })
      return
      this.operationFun(e.currentTarget.dataset.openid, true, "添加")
    }
  },
  operationFun(openid, boolean, tis) {
    console.log("openid, boolean, tis", openid, boolean, tis)
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "update",
        update: "administrator",
        openid: openid,
        boolean: boolean
      }
    }).then(res => {
      wx.showToast({
        title: tis + '成功',
        icon: "none"
      })

      _this.allAdministrator()

    }).catch(err => {
      wx.showToast({
        title: tis + '失败',
        icon: "none"
      })
      console.log(tis + "失败", err)
    })
  },
  showListPage(e) { // 显示/隐藏搜索框
    if (e.currentTarget.dataset.name != "listPage") {
      this.setData({
        class: "bottom",
      })
    } else {
      this.setData({
        class: "top"
      })
    }
  },
  input(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  searchFun() { // 搜索查询用户列表
    console.log("输入框的值", this.data.inputValue)
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "get",
        get: "searchUser",
        keyWord: _this.data.inputValue
      }
    }).then(res => {
      console.log("查询用户列表", res.result.data)
      let isHad
      if (res.result.data.length == 0) {
        isHad = false
      } else {
        isHad = true
      }
      _this.setData({
        searchUser: res.result.data,
        isHad: isHad
      })

    }).catch(err => {
      console.log("查询用户列表 失败", err)
    })
  },
  allAdministrator() { // 获取全部管理员
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "get",
        get: "allAdministrator"
      }
    }).then((res) => {
      console.log("获取全部管理员", res.result.data)
      _this.setData({
        allAdministrator: res.result.data
      })
    }).catch(err => {
      console.log("获取全部管理员 失败", err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.allAdministrator()
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