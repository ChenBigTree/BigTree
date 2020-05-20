// miniprogram/pages/my/administrator/courseShelf/courseShelf.js
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    someData: '',
    pendingDataNum: '00'
  },
  handle(e) {
    if (e.currentTarget.dataset.state == 'del') {
      wx.showModal({
        content: "确定删除讲师" + e.currentTarget.dataset.name + "吗？",
        confirmText: "删除",
        success: res => {
          if (res.confirm == true) {
            console.log("删除")
            this.updateFun("update", e.currentTarget.dataset.id, e.currentTarget.dataset.openid, "del")
            wx.showToast({
              title: '删除讲师成功',
            })
          }
        }
      })

    }
  },
  updateFun(fun, id, openid, update) {
    let _this = this
    wx.cloud.callFunction({
      name: "teacherData",
      data: {
        fun: fun,
        id: id,
        openid: openid,
        update: update,
      },
      success: res => {
        console.log("处理成功")
        _this.getData("allData")
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // 获取全部提交审核讲师数据
  getData(get) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: "teacherData",
      data: {
        fun: "get",
        get: get
      },
      success: res => {
        let data = res.result.data
        if (get == "pending") {
          console.log("全部待处理的讲师申请", data)

          _this.setData({
            pendingDataNum: data
          })
        } else {
          for (let i in data) {
            let passTimeDate = `${new Date(data[i].passTime).getFullYear()}-${Number(new Date(data[i].passTime).getMonth()+1) > 9 ? Number(new Date(data[i].passTime).getMonth()+1) : "0" + Number(new Date(data[i].passTime).getMonth()+1)}-${new Date(data[i].passTime).getDate() > 9 ? new Date(data[i].passTime).getDate() : "0" + new Date(data[i].passTime).getDate()}`
            data[i].passTimeDate = passTimeDate
            let timeDate = `${new Date(data[i].time).getFullYear()}-${Number(new Date(data[i].time).getMonth() + 1) > 9 ? Number(new Date(data[i].time).getMonth() + 1) : "0" + Number(new Date(data[i].time).getMonth() + 1) }-${new Date(data[i].time).getDate() > 9 ? new Date(data[i].time).getDate() : "0" + new Date(data[i].time).getDate()}`
            data[i].timeDate = timeDate
          }
          console.log("所有的讲师列表", data)
          _this.setData({
            allData: data
          })
        }
        wx.hideLoading()

      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.getData("pending")
    this.getData("allData")
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