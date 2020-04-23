// miniprogram/pages/list/remdom/remdom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getValidCode() {
    let codes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let codeString = '';
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random() * codes.length);
      codeString += codes[randomIndex];
    }
    this.setData({
      code: codeString
    })
    // return codeString;
  },
  getValidCodes() {
    let codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let codeString = '';
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random() * codes.length);
      codeString += codes[randomIndex];
    }
    this.setData({
      codes: codeString
    })
    // return codeString;
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