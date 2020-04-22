var _this;
var image_index = 0;
var imageId_arr = [] // 用于存储图片生成的id

Page({

  /**
   * 页面的初始数据
   */
  data: {
    I: 1,
    B: 1,
    U: 1,
  },
  // 斜体
  I() {
    this.setData({
      I: this.data.I == 1 ? 2 : 1
    })
    // 创建选择器对象
    var query = wx.createSelectorQuery()
    // 通过css选择器获取节点
    var editor = query.select("#editor")

    // 通过节点获取富文本编辑器的内容对象
    editor.context(function(res) {
      // 修改富文本编辑器的内容样式 —— 加粗
      res.context.format("italic")
    }).exec() // .exec() ：执行所有的请求。请求结果按请求次序构成数组
  },
  // 添加图片
  img() {
    var query = wx.createSelectorQuery()
    var editor = query.select("#editor")
    wx.chooseImage({
      success: function(e) {
        editor.context(function(res) {
          for (let i = 0; i < e.tempFilePaths.length; i++) {
            res.context.insertImage({
              src: e.tempFilePaths[i]
            })
          }
        }).exec()
        // console.log(e)
      },
    })
  },
  // 加粗
  B() {
    this.setData({
      B: this.data.B == 1 ? 2 : 1
    })
    var query = wx.createSelectorQuery()
    var editor = query.select("#editor")
    editor.context(function(res) {
      res.context.format("bold")
    }).exec() // .exec() ：执行所有的请求。请求结果按请求次序构成数组

  },
  // 下划线
  U() {
    this.setData({
      U: this.data.U == 1 ? 2 : 1
    })

    // 创建选择器对象
    var query = wx.createSelectorQuery()
    // 通过css选择器获取节点
    var editor = query.select("#editor")

    // 通过节点获取富文本编辑器的内容对象
    editor.context(function(res) {
      // 修改富文本编辑器的内容样式 —— 加粗
      res.context.format("ins")
    }).exec() // .exec() ：执行所有的请求。请求结果按请求次序构成数组

  },
  // 字体大小
  fontSize() {
    console.log('1', fontSize)

    fontSize += 2;

    console.log('2', fontSize)
    // 创建选择器对象
    var query = wx.createSelectorQuery()
    // 通过css选择器获取节点
    var editor = query.select("#editor")

    // 通过节点获取富文本编辑器的内容对象
    editor.context(function(res) {
      // 修改富文本编辑器的内容样式 —— 加粗
      res.context.format("fontSize", "16px")
    }).exec() // .exec() ：执行所有的请求。请求结果按请求次序构成数组
  },

  //提交
  good() {
    var query = wx.createSelectorQuery()
    var editor = query.select("#editor")
    editor.context(function(e) {
      e.context.getContents({
        success: res => { // 提交时获取页面所有内容
          console.log(res)
          if (res.delta.ops[0].insert == "\n") {
            console.log('为空')
          } else {
            wx.showLoading({
              title: "上传中",
              mask: true
            })
            let flag = true
            for (var i in res.delta.ops) {
              if (res.delta.ops[i].insert.image) { // 判断页面内容中是否存在图片
                flag = false
                image_index++;
                // 一个个的传值
                _this.upImageFun(res.delta.ops[i].insert.image, res.delta)
                // console.log('图片成功上传',res.delta.ops[i].insert.image)
              }
            };
            if (flag) {
              _this.setDataBase(res.delta)
            }
            /*4-14：方法一：将富文本编辑器的内容渲染到页面上*/
            /**
             * let h5 = res.html.replace(/img src/g, "img class='rich_pages' src") // 字符串替换 添加图片自适应页面，添加类名
            wx.navigateTo({
              url: '../html/html',
              success(e) {
                e.eventChannel.emit('pushHtmlData', {
                  data: h5
                })
              }
            })
             * **/
          }
        }
      })
    }).exec()

  },

  // 上传图片
  upImageFun(path, delta) {
    // console.log("delta==>", delta)
    // 上传到云存储 一个个的上传
    wx.cloud.uploadFile({
      cloudPath: "my_img/" + (new Date().getTime() + ".png"), // "my_img/"：云存储的文件夹
      filePath: path, // 小程序临时文件路径
      success: e => {
        // console.log("上传图片到云存储，获取存储路径成功", e.fileID)
        imageId_arr.push(e.fileID)

        if (imageId_arr.length == image_index) {

          // 将云存储的临时图片路径转为真实图片路径
          wx.cloud.getTempFileURL({
            fileList: imageId_arr, // []:string
            success(res) {
              console.log("路径转真实路径", res)
              let i = 0;
              for (var key in delta.ops) {
                if (delta.ops[key].insert.image) {
                  delta.ops[key].insert.image = res.fileList[i]
                  i++
                }
              }
              _this.setDataBase(delta)
              /**
               * res.fileList[0]{
               *  fileID ：文件ID
               * tempFileURL: '', 临时文件网络链接
               * maxAge: 120 * 60 * 1000, 有效期
               * }
               * * */

            },
          })
        }
      },
      fail(err) {
        console.log("上传图片失败", err)
      }
    })
  },

  setDataBase(delta) {
    console.log("执行")
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var ri = date.getDate()
    var hours = date.getHours()
    var min = date.getMinutes()
    var day = date.getDay()
    day = day == 0 ? "日" : day == 1 ? "一" : day == 2 ? "二" : day == 3 ? "三" : day == 4 ? "四" : day == 5 ? "五" : "六"
    wx.cloud.callFunction({
      name: "memo-ArticleList",
      data: {
        test: delta,
        fun: "add",
        time: {
          year: year,
          month: month,
          ri: ri,
          hours: hours,
          min: min,
          day: day,
        }
      },
      success: (res) => {
        wx.hideLoading()
        console.log("存储数据成功==>", res)
      },
      fail(err) {
        wx.hideLoading()
        console.log("存储数据失败==>", err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(new Date().getTime())
    _this = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})