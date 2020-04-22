// const chooseLocation = requirePlugin('chooseLocation');
let _this;
let Utils = require("../../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formVal: {
      companyBrief: "",
      companyName: "",
      companyaddress: "",
      iponeVal: "",
      linkman: "",
      logoSrc: ""
    }
  },
  // 点击地标按钮选定位
  address() {
    wx.chooseLocation({
      success(res) {
        _this.inputFun(res.address, "companyaddress")
      }
    })
  },
  // 点击提交获取数据
  formSubmit(e) {
    var formVal = e.detail.value; // 获取输入框的值
    console.log("formVal获取",formVal)
    if (formVal.companyName == '') {
      Utils.showModal("公司名称不能为空");
      return false
    }

    if (this.data.logoSrc == '') {
      Utils.showModal("公司logo不能为空");
      return false
    }

    if (formVal.companyaddress == '') {
      Utils.showModal("公司地址不能为空");
      return false
    }

    if (formVal.linkman == '') {
      Utils.showModal("联系人不能为空");
      return false
    }

    if (formVal.iponeVal == '') {
      Utils.showModal("联系电话不能为空");
      return false
    }

    var doIpone = this.VerificationIponeFn(formVal.iponeVal); // 点击发送验证码时 验证一次手机号码
    if (!doIpone) {
      Utils.showModal("手机号码不正确");
      return false;
    }
    if (formVal.companyBrief == '') {
      Utils.showModal("公司简介不能为空");
      return false
    }

    console.log("处理logo前", _this.data.formVal)
    wx.cloud.uploadFile({
      cloudPath: "companyLogo/" + (new Date().getTime() + ".png"),
      filePath: _this.data.formVal.logoSrc,
      success: res => {
        // 返回文件 ID
        console.log("图片ID", res.fileID)
        // 将图片ID转成临时链接用于存储
        wx.cloud.getTempFileURL({
          fileList: [res.fileID],
          success: e => {
            wx.showLoading({
              name: "正在提交中"
            })
            console.log("临时链接", e.fileList[0].tempFileURL)

            _this.inputFun(e.fileList[0].tempFileURL, 'logoSrc')
            console.log("处理logo后", _this.data.formVal)

            // 将数据存储到数据库中
            wx.cloud.callFunction({
              name: "CompanyProfile",
              data: {
                formVal: _this.data.formVal
              },
              success(res) {
                Utils.showModal("提交成功")
                wx.hideLoading()
                _this.setData({
                  formVal:""
                })
                console.log("上传商家基本信息成功", res)
              },
              fail(err) {
                Utils.showModal("提交失败")
                wx.hideLoading()
                console.log("上传商家基本信息失败", err)
              }
            })

          },
          fail: console.error
        })
      },
      fail: console.error
    })
  },

  // 验证手机号函数
  VerificationIponeFn: function (value) {
    var checkVal = Utils.Verification.phone;
    var _this = this;
    this.setData({
      iponeVal: value
    })
    return checkVal.test(_this.data.iponeVal)
  },

  // 商家上传logo
  upIogo() {
    wx.chooseImage({
      count: 1,
      success: function (e) {
        console.log("图片临时路径", e.tempFiles[0].path)
        _this.inputFun(e.tempFiles[0].path, "logoSrc")
        console.log("图片临时路径时",_this.data.formVal)
      }
    })
  },

  companyName(e) {
    this.inputFun(e.detail, 'companyName')
  },
  linkman(e) {
    this.inputFun(e.detail, 'linkman')
  },
  iponeVal(e) {
    this.inputFun(e.detail, 'iponeVal')
  },
  companyBrief(e) {
    this.inputFun(e.detail, 'companyBrief')
  },
  companyaddress(e) {
    this.inputFun(e.detail, 'companyaddress')
  },
  inputFun(data, name) {
    let formVal = this.data.formVal
    if (name == "companyBrief") {
      formVal.companyBrief = data
    } else if (name == "iponeVal") {
      formVal.iponeVal = data
    } else if (name == "companyName") {
      formVal.companyName = data
    } else if (name == "linkman") {
      formVal.linkman = data
    } else if (name == "logoSrc") {
      formVal.logoSrc = data
    } else if (name == "companyaddress") {
      formVal.companyaddress = data
    }
    this.setData({
      formVal: formVal
    })
    console.log("修改后", _this.data.formVal)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this,
    wx.cloud.callFunction({
      name:"addFormVal",
      data:{
        fun:"business"
      },
      success:res =>{
        console.log('res==>',res)
      },fail:err=>{
        console.log("err==>",err)
      }
    })
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