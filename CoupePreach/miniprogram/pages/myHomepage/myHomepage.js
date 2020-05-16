// pages/community/speech.js
const app = getApp()
let _this
var that
Page({
  data: {
    curriculumArr: [],
    //导航栏
    current: 'tab1',
    tabIndex: 3,
    route: "speech",
    icons: require("../../utils/icons.js"),
    showMore: false,
    showFooter: true,
    ifManage: false,
    statusBarHeight: app.globalData.statusBarHeight,
    showZan: -1, //显示点赞按钮
    showPinLun: false,
    nmAvator: '/images/pyq/ng.jpg',
    commentValue: '',
    placeholderPL: '评论',
    userInfo: undefined,
    batchTimes: undefined, //分页
    btoText: "正在加载...",
    adminOpenid: "oZAiB4gjiLUa4eeDZ8HWsxtPdH-g",
    shareObg: {
      title: '雅维智慧',
      desc: '',
      path: '/pages/pyq/circle/index',
      imageUrl: "cloud://ywzh-quvhk.7977-ywzh-quvhk-1301465733/pgy.png",
    } //转发样式
  },
  handleChange({
    detail
  }) {
    console.log(detail)
    this.setData({
      current: detail.key
    });
  },
  openConfirm: function (e) {
    if (!_this.data.userInfo) {
      _this.setData({
        dialogShow: true
      })
    } else {
      wx.navigateTo({
        url: './speechAdd/speechAdd',
      })
    }
  },
  getUserInfo: function (e) { // 存储未登录信息
    console.log("进来了")
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
            isTeacher: true, // 是否讲师
            isDistributionMember: false, // 是否分销员
            fans: [], // 粉丝
            partner: [], // 伙伴
            PriceOfCourse: 50,
            openid: res.result.openid,
            distributionMember: [] // 购买的课程
          }
          app.globalData.userInfo = userInfoData
          _this.setData({
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
  login() { // 获取登录的信息
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 查看是否授权
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                that.setData({
                  userInfo: res.userInfo
                })
              }
            })
          }
        }
      })
    }
  },
  onLoad: function (options) {
    _this = this;
    that = this

    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log("that.data.openid", res.result.openid)
      that.setData({
        openid: res.result.openid
      })
      that.getWallData(0, 10, false)
      wx.cloud.callFunction({
        name: "operate_curriculum",
        data: {
          method: "get",
          openid: res.result.openid
        },
        success: res => {
          console.log('我的课程 成功==>', res.result.data)
          that.setData({
            curriculumArr: res.result.data
          })
        },
        fail: err => {
          console.log("我的课程 失败==>", err)
        }
      })
    })
  },
  onShow: function () {
    this.login()
    const db = wx.cloud.database()
    db.collection('circle').count().then(res => {
      console.log(res.total)
      const total = res.total
      // 计算需分几次取
      const batchTimes = Math.ceil(total / 10)
      console.log(batchTimes)
      this.setData({
        batchTimes: batchTimes - 1
      })
    })

    if (app.globalData.userInfo != undefined) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      console.log("获取全局的用户信息 =>", app.globalData.userInfo)
    }
  },

  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      console.log('down')
      _this.setData({
        showFooter: false
      })
    } else {
      //向上滚动
      console.log('up')
      _this.setData({
        showFooter: true
      })
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  },

  getWallData(skip = 0, limit = 10, concat = true, tab = undefined) {
    wx.showNavigationBarLoading()
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    const db = wx.cloud.database()
    if (tab === "全部") {
      tab = undefined
    }

    let myopenid = this.data.openid
    db.collection("circle").skip(skip).limit(limit).orderBy('time', 'desc').where({
      // type: 'speech',
      _openid: this.data.openid,
      isTop: false
    }).get().then(res => {
      console.log('getwallData ==>', res)
      //return
      var zanText
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].time = this.parseTime(res.data[i].createTime.getTime())
        res.data[i].zanText = res.data[i].zans.map(a => {
          return a.name
        }).join(", ")
        //if (res.data[i].content.length > 100) {
        //res.data[i].isOver = true
        //res.data[i].content = res.data[i].content.slice(0, 96) + "..."
        //}
        res.data[i].comments = res.data[i].comments.sort(function (a, b) {
          return a.createTime.getTime() - b.createTime.getTime()
        })
      }
      console.log("res.data ==>", res.data)
      var data = res.data.sort(function (a, b) {
        return b.createTime.getTime() - a.createTime.getTime()
      })
      if (concat) {
        data = this.data.wallData.concat(data)
      }
      if (data.length === 0) {
        this.setData({
          btoText: '暂无更多~'
        })
      }
      this.setData({
        wallData: data
      })
      wx.hideToast()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },

  turnToMore: function (event) { // 2,发帖
    let showMore = this.data.showMore;
    this.setData({
      showMore: !showMore
    })
  },

  // getUserInfo: function (e) {
  //   console.log(e) ///////******** */
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //   })
  // },

  lookDetail(e) {
    console.log(e.currentTarget.dataset) ///////////******* */
    wx.navigateTo({
      url: './speechDetail?id=' + e.currentTarget.dataset.sid,
    })
  },

  getcomment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },

  bindChangeTab(e) {
    console.log(e.currentTarget.dataset.index)
    var tab = this.data.tabList
    for (var i = 0; i < tab.length; i++) {
      tab[i].isSelect = false
    }
    tab[e.currentTarget.dataset.index].isSelect = true
    this.setData({
      tabList: tab,
      tabIndex: e.currentTarget.dataset.index
    })
    this.getWallData(0, 10, false, tab[e.currentTarget.dataset.index].name)
  },

  bindComment(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      placeholderPL: "回复: " + e.currentTarget.dataset.name,
      showZan: e.currentTarget.dataset.indexn,
      showPinLun: true,
    })
  },

  lookArticle(e) {
    wx.navigateTo({
      url: '/pages/code/article/index?url=' + e.currentTarget.dataset.url,
    })
  },

  showPinLun() {
    var main = this.data.wallData[this.data.showZan].userInfo.nickName
    this.setData({
      placeholderPL: "留言: " + main,
      showPinLun: !this.data.showPinLun,
    })
  },

  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  },

  dianzan(e) {
    console.log(e.currentTarget.dataset)
    console.log(e.currentTarget.dataset.indexn)
    if (!this.data.userInfo) {
      wx.pageScrollTo({
        scrollTop: 200,
      })
      this.setData({
        dialogShow: true
      })
      return
    }

    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res.result.openid)
      var isZan = this.data.wallData[e.currentTarget.dataset.indexn].zans.some(a => {
        return a.openid === res.result.openid
      })
      console.log(isZan)
      //未点赞
      if (!isZan) {
        var data = this.data.wallData
        data[e.currentTarget.dataset.indexn].zans.push({
          name: this.data.userInfo.nickName
        })
        data[e.currentTarget.dataset.indexn].zanText = data[e.currentTarget.dataset.indexn].zans.map(a => {
          return a.name
        }).join(", ")
        this.setData({
          wallData: data
        })
        wx.cloud.callFunction({
          name: 'chat',
          data: {
            type: 'zan',
            collectionname: 'circle',
            data: {
              username: this.data.userInfo.nickName,
              _id: e.currentTarget.dataset._id
            }
          }
        }).then(res => {})
      }
      this.setData({
        showZan: -1,
        placeholderPL: "留言"
      })
    })
  },

  submitComment(e) {
    if (!this.data.userInfo) {
      wx.pageScrollTo({
        scrollTop: 200,
      })
      wx.showToast({
        title: '需要授权才能点赞评论,见第一条消息.',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (this.data.commentValue.length <= 0) {
      wx.showToast({
        title: '内容为空',
        icon: 'none'
      })
      return
    } else {
      console.log('this.data.commentValue--->', this.data.commentValue)
      return
      wx.cloud.callFunction({
        name: 'msgCheck',
        data: {
          type: 'text',
          content: this.data.commentValue
        },
      }).then(res => {
        console.log(res)
        if (res.result.errcode !== 0) {
          wx.showToast({
            title: '内容违规!发布违法违规内容将被永久封禁',
            icon: 'none',
            duration: 5000
          })
          return
        }
      })
    }
    var _id = this.data.wallData[this.data.showZan]._id
    var formId = e.detail.formId
    var toName = ""
    if (this.data.placeholderPL.includes("回复")) {
      toName = this.data.placeholderPL.replace("回复:", "")
      console.log(toName)
    }
    wx.cloud.callFunction({
      name: 'chat',
      data: {
        type: 'comment',
        collectionname: 'circle',
        data: {
          username: this.data.userInfo.nickName,
          userInfo: this.data.userInfo,
          formId: formId,
          _id: _id,
          comment: this.data.commentValue,
          toName: toName
        }
      }
    }).then(res => {
      console.log(res)
      //更新这条数据
      const db = wx.cloud.database()
      db.collection("circle").doc(_id).get().then(
        res => {
          console.log(res.data)
          var data = this.data.wallData
          console.log(data)
          console.log(e.currentTarget.dataset.indexn)
          data[this.data.showZan] = res.data

          for (let i = 0; i < data.length; i++) {
            data[i].time = this.parseTime(data[i].createTime.getTime())
            data[i].zanText = data[i].zans.map(a => {
              return a.name
            }).join(", ")
          }
          this.setData({
            wallData: data,
            showZan: -1,
            placeholderPL: "留言",
            showPinLun: false,
            commentValue: ""
          })
        }
      )
    })
  },

  toEdit() {
    console.log('toEdit')
    this.openConfirm()

    return
    wx.showActionSheet({
      itemList: ['发布动态', '发布课程'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: './speechAdd',
          })
        } else {
          wx.navigateTo({
            url: './issueClass',
          })
        }
      },
    })

  },

  getMyWallData() {
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const db = wx.cloud.database()
      db.collection("circle").where({
        _openid: res.result.openid
      }).get().then(res => {
        var zanText
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].time = this.parseTime(res.data[i].createTime.getTime())
          res.data[i].zanText = res.data[i].zans.map(a => {
            return a.name
          }).join(", ")
        }
        var data = res.data.sort(function (a, b) {
          return b.createTime.getTime() - a.createTime.getTime()
        })
        this.setData({
          wallData: data
        })
        wx.hideNavigationBarLoading()
      })
    })
  },

  deletePyq(e) {
    console.log(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.index)
    var item = e.currentTarget.dataset.item
    const db = wx.cloud.database()
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      cancelText: '取消',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var data = that.data.wallData
          data.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            wallData: data
          })

          db.collection('circle').doc(item._id).remove()
            .then(console.log)
            .catch(console.error)

          db.collection('circleback').add({
            data: {
              userInfo: item.userInfo,
              createTime: item.createTime,
              content: item.content,
              zans: item.zans,
              images: item.images,
              comments: item.comments,
            },
          })
        } else if (res.cancel) {}
      }
    })
  },

  toShowZan(e) {
    if (e.currentTarget.dataset.index === this.data.showZan) {
      this.setData({
        showZan: -1,
        placeholderPL: "留言"
      })
    } else {
      this.setData({
        showZan: e.currentTarget.dataset.index
      })
    }
  },

  onPullDownRefresh: function () {
    this.getWallData(0, 10, false, this.data.tabList[this.data.tabIndex].name)
    if (this.data.tabIndex === 3) {
      this.getTopWallData()
    }

  },

  getWallDataOfSkip() {
    var batchTimes = this.data.batchTimes
    var skip = this.data.wallData.length
    if (batchTimes > 0) {

      this.getWallData(skip, 10, true, this.data.tabList[this.data.tabIndex].name)

      this.setData({
        batchTimes: this.data.batchTimes - 1
      })
    } else {
      this.setData({
        btoText: '已经到底了~'
      })
    }
  },

  onReachBottom: function () {
    console.log("Bottom")
    this.getWallDataOfSkip()
  },

  bindShare(e) {
    var item = e.currentTarget.dataset.item
    console.log(item)
    var imageUrl = "cloud://apppgy-72vrx.6170-apppgy-72vrx-1301199205/pgy.jpg"
    if (item.images.length > 0) {
      imageUrl = item.images[0]
    }
    var shareObg = {
      title: '蒲公莹',
      desc: item.content,
      path: '/pages/pyq/circle/index',
      imageUrl: imageUrl,
    } //转发
    this.setData({
      shareObg: shareObg
    })
  },

  onShareAppMessage: function (e) {
    var item = e.target.dataset.item
    var desc = item.content.slice(0, 10)
    var imageUrl = "cloud://apppgy-72vrx.6170-apppgy-72vrx-1301199205/pgy.jpg"
    console.log(item)
    if (item.content.length < 2 || !item.content) {
      desc = item.userInfo.nickName + "给你发来一条消息"
      console.log("12324")
    }
    var shareObg = {
      desc: desc,
      path: '/pages/pyq/circle/detail?id=' + item._id,
      imageUrl: imageUrl,
    } //转发
    return shareObg
  },

  onPageScroll: function (e) {
    this.setData({
      showZan: -1,
      placeholderPL: "留言",
      showPinLun: false,
    })
  },

  parseTime(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    var result = ''
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
    return result;
  },


})