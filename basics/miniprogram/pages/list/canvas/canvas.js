// pages/home/home.js
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
  },
  click: function () {
    that = this
    console.log('点击事件')
    // 商家头像
    let p1 = new Promise((resolve, reject) => {
      return resolve("../../../images/logo.jpg")
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/orderPoster/logo.jpg',
        success(res) {
          console.log('res1==>', res)
          resolve(res.path)
        }
      })
    })
    // // 商品图
    let p2 = new Promise((resolve, reject) => {
      return resolve("../../../images/swiper.jpg")
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/orderPoster/swiper.jpg',
        success(res) {
          console.log('res2==>', res)
          resolve(res.path)
        }
      })
    })
    // // 活动头像
    let p3 = new Promise((resolve, reject) => {
      return resolve("../../../images/huodongjia.png")
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/orderPoster/active.png',
        success(res) {
          console.log('res3==>', res)
          resolve(res.path)
        }
      })
    })
    // // 二维码
    let p4 = new Promise((resolve, reject) => {
      
      return resolve("../../../images/erweima.png")
      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/orderPoster/ma.jpg',
        success(res) {
          console.log('res4==>', res)
          resolve(res.path)
        }
      })
    })
    // // 背景图
    let p5 = new Promise((resolve, reject) => {
      return resolve("../../../images/haibao.png")

      wx.getImageInfo({
        src: 'https://dc.xiansg.cn/attachment/images/global/canvas/orderPoster/haibaoB.png',
        success(res) {
          console.log('res5==>', res)
          resolve(res.path)
        }
      })
    })

    Promise.all([p1, p2, p3, p4, p5]).then(function (el) {
      console.log('数据===》', el)
      // 商家头像
      let Logo = el[0]
      // 商品图
      let Swiper = el[1]
      // 活动头像
      let Active = el[2]
      // 二维码
      let Code = el[3]
      console.log("二维码",Code)
      // 背景图
      let BG = el[4]
      var ctx = wx.createCanvasContext('canvas')
      console.log('ctx==>', ctx)

      //  商家头像
      ctx.drawImage('../../../images/shuiyin.png', 100, 300, 400, 300)

      // 商品图
      ctx.drawImage(Swiper, 55, 167, 800, 800)
      //  商家头像
      ctx.drawImage("../../../images/logo.jpg", 53, 86, 60, 60)
      // 背景图
      ctx.drawImage(BG, 0, 0, 750, 1334)



      // ctx.draw()

      // 二维码
      ctx.drawImage("../../../images/erweima.jpg", 467, 930, 220, 220)
      /*
       * maxWidth  画布的宽度 
       * dlght   行高
       * dR       换行限制
       * rHeight      距离画布顶部的距离 
       * xWidth       距离画布左边的距离
       */
      // function create(ctx, opt) {
      //   console.log('opt===>', opt)
      //   // 字体样式
      //   let font = opt.font || '',
      //     // 字体颜色  
      //     fillStyle = opt.setFillStyle || '',
      //     // 文本内容  
      //     txt = opt.txt || '',
      //     lineWidth = opt.lineWidth || 0,
      //     maxWidth = opt.maxWidth || '',
      //     dlght = opdteight,
      //     dyt = doeight || '',
      //     row = rpt.Row || 0,
      //     xWidth = opt.xWidth || 0,
      //     lastIndex = opt.lastIndex || 0;

      //   ctx.font = font;
      //   ctx.fillStyle = fillStyle;

      //   for (let j = 0; j < txt.length + 1; j++) {
      //     lineWidth += ctx.measureText(txt[j]).width
      //     if (lineWidth > maxWidth) {
      //       if (lineHde{
      //         if (Rowd  {
      //           ctx.frllText(txt.substring(lastIndex, j) + '....', xWidth, yHeight); //绘制截取部分

      //           // // 结束循环
      //           break
      //         } else {
      //           ctx.fillText(txt.substring(lastIndex, j), xWidth, yHeight);

      //         }
      //       } else {
      //         if (Row >= 0) {
      //           ctx.fillText(txt.substring(lastIndex, j) + '...', xWidth, yHeight)
      //           break
      //         }
      //       }

      //       lineHeight && (yHeight += lineHeight);
      //       lineWidth = xWidth;
      //       lastIndex = j;
      //       Row++
      //     } else {

      //       ctx.fillText(txt.substring(lastIndex, j), xWidth, yHeight);

      //     }

      //   }

      // }

      function create(ctx, opt) {
        if (!ctx) {
          console.log('请填写文本')
          return false
        }

        let {
          txt,
          dx,
          dy,
          lineHeight,
          maxWidth,
          row
        } = opt

        console.log(opt)

        txt = txt || ''
        dx = dx || 0
        dy = dy || 0
        row = row || 1
        lineHeight = lineHeight || 0

        let lastIndex = 0

        if (!maxWidth) {
          ctx.fillText(txt, dx, dy)
        } else {
          for (let rowIndex = 0; rowIndex < row; rowIndex++) {
            _hand(lastIndex, rowIndex)
          }
        }

        function _hand(startIndex, rowIndex) {
          let endIndex = startIndex
          let curWidth = 0

          while (true) {
            endIndex += 1
            curWidth += ctx.measureText(txt[endIndex]).width
            if (endIndex >= txt.length) {
              ctx.fillText(txt.substring(startIndex, endIndex), dx, dy + lineHeight * rowIndex)
              break
            }
            if (curWidth >= maxWidth) {
              endIndex -= 1
              if (rowIndex + 1 == row) {
                ctx.fillText(txt.substring(startIndex, endIndex - 1) + '....', dx, dy + lineHeight * rowIndex)
              } else {
                ctx.fillText(txt.substring(startIndex, endIndex), dx, dy + lineHeight * rowIndex)
              }
              lastIndex = endIndex
              break
            }
          }
        }
      }
      ctx.font = "500 30px Arial, Helvetica, sans-serif"
      ctx.setFillStyle('#000000')
      // 商家店名
      create(ctx, {
        txt: 'team',
        maxWidth: 400,
        dy: 100, 
        dx: 128,
      });
      // 商品名称
      ctx.font = "500 30px Arial, Helvetica, sans-serif"
      ctx.setFillStyle('#000000')
      create(ctx, {
        txt: '原切牛排 150g*3包（配黑椒酱）【活动价】',
        maxWidth: 415,
        dy: 660,
        dx: 55,
      });
      // 商品名称
      ctx.font = "24px Arial"
      ctx.setFillStyle('#929292')
      create(ctx, {
        txt: '兵戈不见老莱衣，叹息人间万事非。我已无家寻弟妹，君今何处访庭闱。',
        maxWidth: 640,
        dy: 700,
        dx: 55,
        lineHeight: 30,
        row: 2
      });



      var price = '9.99'
      // var price = '99.99'
      // var price = '9999.99'
      var num = price.split('.')
      console.log('num==>', num)
      ctx.setFillStyle("#FE0006")
      ctx.setFontSize(80)
      ctx.fillText(num[0], 100, 845)
      let l = num[0].length
      console.log('l===\>', l)
      let lw = l * 39
      console.log('lw==>', lw)

      function _func(lw) {
        // that=this
        ctx.setFillStyle("#FE0006")
        ctx.setFontSize(40)
        ctx.fillText("." + num[1], 120 + lw, 845)

        // 单位
        ctx.font = "18px 'Trebuchet MS', Helvetica, sans-serif"
        // ctx.setTextAlign('center')
        ctx.setFillStyle("#929292")
        ctx.setFontSize(18)
        ctx.fillText("/份", 200 + lw, 845)

        // 原价格
        ctx.font = "20px Arial, Helvetica, sans-serif"
        // ctx.setTextAlign('center')
        ctx.setFillStyle("#929292")
        ctx.setFontSize(20)
        ctx.fillText("￥54.00", 260 + lw, 847)

        ctx.moveTo(225 + lw, 839); //设置起点状态
        ctx.lineTo(302 + lw, 839); //设置末端状态
        ctx.lineWidth = 2; //设置线宽状态
        ctx.strokeStyle = "#BDBDBD"; //设置线的颜色状态

        // 活动价
        ctx.drawImage(Active, 120 + lw, 780, 79, 26)

        ctx.stroke();
        ctx.draw(true, function () {
          wx.canvasToTempFilePath({
            x: 10,
            y: 20,
            width: 750,
            height: 1334,
            destWidth: 750,
            destHeight: 1334,
            canvasId: 'canvas',
            success(res) {
              console.log('res ==>', res)

              that.setData({
                img: res.tempFilePath,
              })
              // 显示海报
              wx.previewImage({
                current: that.data.img, // 当前显示图片的http链接
                urls: [that.data.img], // 需要预览的图片http链接列表
                success(res) {

                  console.log('res====1>', res)
                  that.setData({})
                }
              })
            }

          })
        })
      }
      _func(lw)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.click()
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