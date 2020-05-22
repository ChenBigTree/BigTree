let _this
let app = getApp()
var Utils = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    class: '',
    isHad: true,
    isShow: true,
    phone: "",
    isBtn: true,
    adminName: ""
  },

  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 项目分类
  btn1(e) {
    let name = e.currentTarget.dataset.name
    var checkVal = Utils.Verification.phone;
    console.log(name)
    if (name == "add2") {
      var doIpone = checkVal.test(_this.data.phone)
      if (this.data.phone == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: "none"
        })
        return
      }
      if (doIpone) {
        this.operationFun(_this.data.openid, true, "添加")
       
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: "none"
        })
        return
      }
    } else if (name == "qx") {
      _this.setData({
        inputValue: "",
        searchUser: "",
        openid: '',
        adminName: "",
        isShow: true,
        phone: "",
        isBtn: true,
      })
    } else if (name == "updataPhone") {
      console.log("更新管理员手机号")
      var doIpone = checkVal.test(_this.data.phone)
      if (this.data.phone == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: "none"
        })
        return
      }
      if (doIpone) {
        this.operationFun(_this.data.openid, true, "更改")
       
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: "none"
        })
        return
      }
    }
  },
  operationAdm(e) { // 删除管理员 / 更改管理员号
    console.log("e.currentTarget.dataset.btn", e.currentTarget.dataset.btn)
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
    } else if (e.currentTarget.dataset.btn == "updataPhone") {
      this.setData({
        isBtn: false,
        isShow: false,
        openid:e.currentTarget.dataset.openid,
        adminName: "更改管理员" + "“" + e.currentTarget.dataset.nickname + "”" + "的手机号",
      })
    }
  },
  operationFun(openid, boolean, tis) {
    wx.cloud.callFunction({
      name: "userInfo",
      data: {
        fun: "update",
        update: "administrator",
        openid: openid,
        boolean: boolean,
        phone: _this.data.phone
      }
    }).then(res => {
      wx.showToast({
        title: tis + '成功',
        icon: "none"
      })
      _this.setData({
        inputValue: "",
        searchUser: "",
        openid: "",
        adminName: "",
        isShow: true,
        phone: ""
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
      console.log(e.currentTarget.dataset)
      if (e.currentTarget.dataset.btn == "add") {
        this.setData({
          class: "bottom",
          inputValue: "",
          searchUser: "",
          isHad: true,
          openid: e.currentTarget.dataset.openid,
          adminName: "请输入管理员" + "“" + e.currentTarget.dataset.nickname + "”" + "的手机号",
          isShow: !_this.data.isShow,
        })
      } else {
        this.setData({
          class: "bottom",
        })
      }
    } else {
      this.setData({
        class: "top"
      })
    }
  },
  input(e) { // 输入用户名
    this.setData({
      inputValue: e.detail.value
    })
  },
 
  touchmove() {  // 滑动的内容时触发
    this.setData({
      class: "bottom"
    })
  },
  searchFun() { // 搜索查询用户列表
    console.log("输入框的值", this.data.inputValue)
    if(this.data.inputValue == ""){
      wx.showToast({
        title: '用户微信名不能为空',
        icon:"none"
      })
      return
    }
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