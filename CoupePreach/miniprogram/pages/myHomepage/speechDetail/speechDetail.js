const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  data: {
    dialogShow: false,
    isZan: true,
    showDelete: false,
    collection: 'circle',
    AudioProgress: 0,
    PreviewHidden: !0,
    ThumbAnimation: !1,
    onEnded: !1,
    AudioPlayHidden: !1,
    AudioStarttime: "00:00",
    AudioDuration: "00:00",
    AudioLong: "",
    Msg: '',
    wallData: [],
    playImg: '/images/pyq/play.png',
    showPlay: true,
    percent: 0,
    showZan: 0, //显示点赞按钮
    showPinLun: false,
    nmAvator: '/image/pyq/ng.jpg',
    audioSrc: '',
    commentValue: '',
    placeholderPL: '评论',
    userInfo: undefined,
    batchTimes: undefined, //分页
    btoText: "正在加载...",
    title: '',
    adminOpenid: "o0L8g0WabpVHRvjgVVGAUjMlCnsA",
    isFa: true
  },
  getUserInfo(e) {
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    })
    getApp().globalData.userInfo = e.detail.userInfo

  },
  showform(e) {
    if (e.currentTarget.dataset.name == "isform") {
      this.setData({
        showPinLun: false
      })
    } else {
      this.setData({
        showPinLun: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: 'pages/myHomepage/speechDetail/speechDetail?userInfo=' + JSON.stringify(this.data.wallData[0].userInfo) + "&&id=" + this.data.wallData[0]._id,
    }
  },

  onLoad: function (options) {
    var that = this
    console.log('onload--options--->', options)

    // return 
    if (options.free) {
      that.setData({
        collection: 'chapters',
        showDelete: true
      })
      wx.cloud.callFunction({
        name: "get_chapters",
        data: {
          id: options.id
        }
      }).then(res => {
        console.log('获取章节==>', res.result.data)
        wx.cloud.callFunction({
          name: 'dakaGet',
          data: {
            id: options.id
          },
          success: res1 => {
            let redata = res1.result.data
            console.log("dakaGet-->", redata)
            if (redata.length > 0) {
              console.log('dd')
              for (let i = 0; i < redata.length; i++) {
                console.log('getTime-->', redata[i].createTime)
                redata[i].time = redata[i].createTime.getTime
              }
              this.setData({
                dakas: redata
              })
            }
          },
          fail: err => {
            console.log("dakaGet-->", err)
          }
        })
        var zanText

        for (let i = 0; i < res.result.data.length; i++) {
          res.result.data[i].time = this.parseTime(new Date(res.result.data[i].createTime).getTime())
          res.result.data[i].zanText = res.result.data[i].zans.map(a => {
            return a.name
          }).join(", ")
          for (let j = 0; j < res.result.data[i].dakas.length; j++) {

            res.result.data[i].dakas[j].time = this.parseTime(res.result.data[i].dakas[j].createTime.getTime())
            res.result.data[i].dakas[j].volume = "/images/volumeg.png"
          }
        }
        this.setData({
          wallData: res.result.data
        })
        console.log('wallData', this.data.wallData)
        let title = this.data.wallData[0].title
        if (title == '') {
          this.setData({
            title: this.data.wallData[0].userInfo.nickName + '的精彩分享'
          })
        } else {
          this.setData({
            title: this.data.wallData[0].title
          })
        }
        wx.cloud.callFunction({
          name: "login"
        }).then(res => {
          console.log(res.result.openid)
          that.setData({
            isZan: that.data.wallData[0].zans.some(a => {
              return a.openid === res.result.openid
            })
          })
        })
        wx.setNavigationBarTitle({
          title: this.data.title
        })

        wx.hideNavigationBarLoading()
      })

    } else {
      that.getMyWallData(options.id, that.data.collection)
    }

    that.setData({
      id: options.id,
      openGid: options.openGid
    })

    that.addView(options.id)
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

  onHide: function () { //离开页面
    backgroundAudioManager.stop()
    wx.hideLoading()
    console.log('onHide---------')
  },

  onUnload: function () { //离开页面
    backgroundAudioManager.stop()
    console.log('onUnload---------')
  },

  getcomment(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },

  bindComment(e) {
    console.log("bindComment", e.currentTarget.dataset)
    this.setData({
      placeholderPL: "回复: " + e.currentTarget.dataset.name,
      showZan: 0,
      showPinLun: true,
    })
  },

  showPinLun() {
    console.log("showPinLun", this.data.showZan)
    var main = this.data.wallData[0].userInfo.nickName
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
    let that = this

    if (!this.data.userInfo) {
      wx.pageScrollTo({
        scrollTop: 200,
      })
      this.setData({
        dialogShow: true
      })
      return
    }
    console.log("isZan ", this.data.isZan)

    console.log("_id", e.currentTarget.dataset._id)
    let id = e.currentTarget.dataset._id
    console.log("点赞总数 ", this.data.wallData[0])
    let zansArr = this.data.wallData[0].zans
    if (this.data.isZan) {
      this.setData({
        isFa: false
      })
      console.log("用户已点赞")
      for (let i = 0; i < zansArr.length; i++) {
        if (this.data.openid == zansArr[i].openid) {

          console.log("截取前", zansArr)
          zansArr.splice(i, 1)

          console.log("截取后", zansArr)

          wx.cloud.callFunction({
            name: "stairway",
            data: {
              fun: "update",
              update: "dianzan",
              id: id,
              zansArr: zansArr
            },
            success: (ress) => {
              wx.cloud.callFunction({ // 获取取消点赞后的数据
                name: "stairway",
                data: {
                  fun: "get",
                  get: "one",
                  id: id
                }
              }).then(res => {
                console.log("更新成功", ress.result.stats)
                console.log("获取取消点赞后成功", res.result.data)
                let date = `${new Date(res.result.data[0].time).getFullYear()}-${new Date(res.result.data[0].time).getMonth()+1>=10?new Date(res.result.data[0].time).getMonth()+1:"0"+(new Date(res.result.data[0].time).getMonth()+1)}-${new Date(res.result.data[0].time).getDate()>9?new Date(res.result.data[0].time).getDate():"0"+new Date(res.result.data[0].time).getDate()}`
                res.result.data[0].time = date
                for (let i = 0; i < res.result.data.length; i++) {
                  res.result.data[i].zanText = res.result.data[i].zans.map(a => {
                    return a.name
                  }).join(", ")
                }
                that.setData({
                  wallData: res.result.data,
                  isZan: false,
                  isFa: true
                })
              })

            },
            fail: err => {
              console.log(err)
            }
          })
          return false
        }
      }
    } else {
      console.log("用户未点赞")
      var data = this.data.wallData
      console.log("openid", this.data.openid)
      data[0].zans.push({
        name: this.data.userInfo.nickName,
        time: new Date(),
        openid: this.data.openid
      })
      console.log("cao", data[0].zans)
      data[0].zanText = data[0].zans.map(a => {
        return a.name
      }).join(", ")
      that.setData({
        wallData: data,
        isZan: true,
        isFa: false
      })
      wx.cloud.callFunction({
        name: 'chat',
        data: {
          type: 'zan',
          collectionname: that.data.collection,
          data: {
            username: this.data.userInfo.nickName,
            _id: e.currentTarget.dataset._id
          }
        }
      }).then(res => {
        console.log("点赞成功")
      }).catch(err => {
        console.log(err)
      })
    }

    return
    wx.cloud.callFunction({
      name: "stairway",
      data: {
        fun: "get",
        get: "one",
        id: id
      }
    }).then(res => {
      console.log(res.result.data)
      let datas = res.result.data[0]


      console.log("用户未点赞")
      var data = this.data.wallData
      data[0].zans.push({
        name: this.data.userInfo.nickName
      })
      data[0].zanText = data[0].zans.map(a => {
        return a.name
      }).join(", ")
      this.setData({
        wallData: data
      })
      wx.cloud.callFunction({
        name: 'chat',
        data: {
          type: 'zan',
          collectionname: that.data.collection,
          data: {
            username: this.data.userInfo.nickName,
            _id: e.currentTarget.dataset._id
          }
        }
      }).then(() => {
        this.setData({
          isFa: true
        })
      })

    }).catch(err => {
      console.log(err)
    })

    return

    console.log('isZan==>', that.data.isZan)
    //未点赞
    if (!that.data.isZan) {
      var data = this.data.wallData
      data[0].zans.push({
        name: this.data.userInfo.nickName
      })
      data[0].zanText = data[0].zans.map(a => {
        return a.name
      }).join(", ")
      console.log("data[0].zans", data[0].zans)
      console.log("this.data.userInfo.nickName", this.data.userInfo.nickName)
      this.setData({
        wallData: data
      })
      wx.cloud.callFunction({
        name: 'chat',
        data: {
          type: 'zan',
          collectionname: that.data.collection,
          data: {
            username: this.data.userInfo.nickName,
            _id: e.currentTarget.dataset._id
          }
        }
      }).then(res => {

      })
    } else { // 已经点赞
      console.log("openid", this.data.openid)
    }

    this.setData({
      isZan: !this.data.isZan,
      showZan: 1,
      placeholderPL: "留言"
    })

  },

  submitComment(e) { //提交数据
    let that = this
    if (!this.data.userInfo) {

      this.setData({
        dialogShow: true
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
      wx.showLoading({
        title: '正在发送...',
      })
      console.log('this.data.commentValue--->', this.data.commentValue)
      // return
      wx.cloud.callFunction({
        name: 'msgCheck',
        data: {
          type: 'text',
          content: this.data.commentValue
        },
      }).then(res => {
        console.log('msgCheck--->', res.result)
        console.log('msgCheck--->', res.result.errCode)
        if (res.result.errCode !== 0) {
          wx.showToast({
            title: '内容违规!发布违法违规内容将被永久封禁',
            icon: 'none',
            duration: 5000
          })
          return
        } else {
          var _id = this.data.wallData[0]._id
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
              collectionname: that.data.collection,
              data: {
                username: this.data.userInfo.nickName,
                userInfo: this.data.userInfo.userInfoData,
                formId: formId,
                _id: _id,
                comment: this.data.commentValue,
                toName: toName
              }
            }
          }).then(res => {
            console.log(res)

            // //更新这条数据
            if (that.data.collection == 'chapters') {
              that.setData({
                collection: 'chapters',
                showDelete: true
              })
              wx.cloud.callFunction({
                name: "get_chapters",
                data: {
                  id: options.id
                }
              }).then(res => {
                console.log('获取章节==>', res.result.data)
                wx.hideLoading()
                console.log(res)
                console.log("MY")
                wx.cloud.callFunction({
                  name: 'dakaGet',
                  data: {
                    id: options.id
                  },
                  success: res1 => {
                    let redata = res1.result.data
                    console.log("dakaGet-->", redata)
                    if (redata.length > 0) {
                      console.log('dd')
                      for (let i = 0; i < redata.length; i++) {
                        console.log('getTime-->', redata[i].createTime)
                        redata[i].time = redata[i].createTime.getTime
                      }
                      this.setData({
                        dakas: redata
                      })
                    }
                  },
                  fail: err => {
                    console.log("dakaGet-->", err)
                  }
                })
                var zanText

                for (let i = 0; i < res.result.data.length; i++) {
                  res.result.data[i].time = this.parseTime(new Date(res.result.data[i].createTime).getTime())
                  res.result.data[i].zanText = res.result.data[i].zans.map(a => {
                    return a.name
                  }).join(", ")
                  for (let j = 0; j < res.result.data[i].dakas.length; j++) {

                    res.result.data[i].dakas[j].time = this.parseTime(res.result.data[i].dakas[j].createTime.getTime())
                    res.result.data[i].dakas[j].volume = "/images/volumeg.png"
                  }
                }
                this.setData({
                  wallData: res.result.data
                })
                console.log('wallData', this.data.wallData)
                let title = this.data.wallData[0].title
                if (title == '') {
                  this.setData({
                    title: this.data.wallData[0].userInfo.nickName + '的精彩分享'
                  })
                } else {
                  this.setData({
                    title: this.data.wallData[0].title
                  })
                }
                wx.cloud.callFunction({
                  name: "login"
                }).then(res => {
                  console.log(res.result.openid)
                  that.setData({
                    isZan: that.data.wallData[0].zans.some(a => {
                      return a.openid === res.result.openid
                    })
                  })
                })
                wx.setNavigationBarTitle({
                  title: this.data.title
                })

                wx.hideNavigationBarLoading()
              })

            } else {
              that.getMyWallData(that.data.id, that.data.collection)
              wx.hideLoading()
              this.setData({
                showPinLun: false,
                Msg: ''
              })
            }
            // const db = wx.cloud.database()
            // db.collection(that.data.collection).doc(_id).get().then(
            //   res => {
            //     console.log('评论结束==>', res.data)
            //     console.log(0)
            //     var data = this.data.wallData
            //     console.log(data)
            //     console.log(0)
            //     data[this.data.showZan] = res.data

            //     for (let i = 0; i < data.length; i++) {
            //       data[i].time = this.parseTime(new Date(data[i].createTime).getTime())
            //       data[i].zanText = data[i].zans.map(a => {
            //         return a.name
            //       }).join(", ")
            //     }
            //     this.setData({
            //       wallData: data,
            //       showZan: -1,
            //       placeholderPL: "留言",
            //       showPinLun: false,
            //       commentValue: ""
            //     })
            //     wx.hideLoading()
            //   }
            // )
          })
        }
      })
    }
  },

  copyText(e) {
    console.log(e.currentTarget.dataset.text)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
    })

  },

  adminDeletePyq(e) {
    var that = this
    var item = e.currentTarget.dataset.item
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      cancelText: '取消',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'chat',
            data: {
              type: 'delete',
              collectionname: that.data.collection,
              data: {
                fileIDs: item.images,
                _id: item._id
              }
            }
          }).then(res => {
            wx.reLaunch({
              url: './speech?openGid=' + that.data.openGid,
            })
          })
        }
      }
    })

  },

  deletePyq(e) {
    console.log(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.index)
    var that = this
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

          db.collection(that.data.collection).doc(item._id).remove()
            .then(console.log)
            .catch(console.error)
          wx.reLaunch({
            url: '../forumManager/forumManager?id=' + getApp().globalData.forumId,
          })
          // db.collection('circleback').add({
          //   data: {
          //     userInfo: item.userInfo,
          //     createTime: item.createTime,
          //     content: item.content,
          //     zans: item.zans,
          //     images: item.images,
          //     comments: item.comments,
          //   },
          // })

        } else if (res.cancel) {}
      }
    })
  },

  addView: function (id) {
    wx.cloud.callFunction({
      name: 'chat',
      data: {
        type: 'view',
        collectionname: this.data.collection,
        data: {
          _id: id
        }
      }
    }).then(res => {
      console.log('addView--->', res)
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

  getMyWallData(id, collection) {
    let that = this
    console.log(id)
    wx.showNavigationBarLoading()

    wx.cloud.callFunction({
      name: "stairway",
      data: {
        id: id,
        fun: "get",
        get: "one"
      },
      success: res => {
        console.log(res)
        for (let i = 0; i < res.result.data.length; i++) {
          console.log("res.result.data[i].time", res.result.data[i].time)
          res.result.data[i].time = this.parseTime(new Date(res.result.data[i].createTime).getTime())
          res.result.data[i].zanText = res.result.data[i].zans.map(a => {
            return a.name
          }).join(", ")

        }
        console.log("aa")
        this.setData({
          wallData: res.result.data,
        })
        console.log('wallData', this.data.wallData)
        let title = this.data.wallData[0].title
        if (title == '') {
          this.setData({
            title: this.data.wallData[0].userInfo.nickName + '的精彩分享'
          })
        } else {
          this.setData({
            title: this.data.wallData[0].title
          })
        }
        wx.setNavigationBarTitle({
          title: this.data.title
        })
        wx.cloud.callFunction({
          name: "login"
        }).then(res => {
          console.log(res.result.openid)
          that.setData({
            openid: res.result.openid,
            isZan: that.data.wallData[0].zans.some(a => {
              return a.openid === res.result.openid
            })
          })
        })

        wx.hideNavigationBarLoading()

      },
      fail: err => {
        console.log(err)
      }
    })
  },

  toVoice(e) {
    console.log('e.currentTarget.dataset.id', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: './speechDetail?id=' + e.currentTarget.dataset.id
    })
  },


  audioPlay: function () {
    var a = this;
    "00:00" == a.data.AudioDuration || 1 == a.data.onEnded ? a.onloadAudioManager() : backgroundAudioManager.play(),
      a.backgroundAudioFunction(), a.setData({
        AudioPlayHidden: !0,
        ThumbAnimation: !0,
        showPlay: false
      }), app.globalData.BackgroundAudioPlay = !0;
  },
  audioPause: function () {
    backgroundAudioManager.pause(), wx.setNavigationBarTitle({
      title: this.data.title
    }), this.setData({
      AudioPlayHidden: !1,
      ThumbAnimation: !1,
      showPlay: true
    }), app.globalData.BackgroundAudioPlay = !1;
  },
  backgroundAudioFunction: function () {
    var u = this;
    backgroundAudioManager.onTimeUpdate(function (a) {
      // var t = backgroundAudioManager.currentTime
      // let d = backgroundAudioManager.duration
      // let maxNum = parseInt(d)
      // let nowSecond = parseInt(t) < 9 ? "0" + parseInt(t) : parseInt(t)
      // let nowMinute = 0
      // console.log("maxNum==>", maxNum)
      // console.log("nowMinute==>", nowMinute)
      // // 正在播放时间
      // let beginSecond = nowSecond
      // let beginMinute = nowMinute > 9 ? nowMinute : "0" + nowMinute
      // if (nowSecond > 59) {
      //   nowMinute = nowMinute + 1
      //   // beginSecond = 0
      //   // if (Math.floor(maxNum / 60) == nowMinute) {
      //   //   return
      //   // }
      // }
      // let beginTime = beginMinute + ":" + beginSecond
      // console.log("beginTime==>", beginTime)
      // // 结束时间
      // let endSecond = parseInt(maxNum / 60) > 9 ? parseInt(maxNum / 60) : "0" + parseInt(maxNum / 60)
      // let endMinute = maxNum % 60 > 9 ? maxNum % 60 : "0" + maxNum % 60
      // let endTime = endSecond + ":" + endMinute
      // console.log("endTime==>", endTime)
      // u.setData({
      //   AudioDuration: (d / 60).toFixed(2),
      //   // AudioOffset: e,
      //   AudioStarttime: beginTime,
      //   AudioMax: maxNum,
      //   AudioLong: endTime
      // });
      // return

      var t = backgroundAudioManager.currentTime,
        e = parseInt(backgroundAudioManager.currentTime),
        n = parseInt(e / 60),
        i = parseInt(backgroundAudioManager.duration),
        o = n + ":" + e % 60,
        d = backgroundAudioManager.duration;
      t = parseInt(100 * t / d);
      0 < e && wx.setNavigationBarTitle({
        title: u.data.title
      }), u.setData({
        AudioDuration: (d / 60).toFixed(2),
        AudioOffset: e,
        AudioStarttime: o,
        AudioMax: i,
        AudioLong: parseInt(i / 60) + ":" + i % 60
      });
      return

      var t = backgroundAudioManager.currentTime,
        e = parseInt(t) < 9 ? "0" + parseInt(t) : parseInt(t),
        n = parseInt(e / 60),
        i = parseInt(backgroundAudioManager.duration),
        o = parseInt(t) < 9 ? "0" + parseInt(t) : parseInt(t),
        n = parseInt(t)
      d = backgroundAudioManager.duration;
      t = parseInt(100 * t / d);
      console.log("e", e)
      console.log("n", n)
      console.log("o", o)
      console.log("d", d)
      if (e > 59) {
        n = n + 1
        if (Math.floor(i / 60) == n) {
          return
        }
      }
      let being = Number(n) > 9 ? Number(n) : "0" + Number(n) + ":" + e
      console.log("being", being)
      0 < e && wx.setNavigationBarTitle({
        title: u.data.title
      })
      console.log("t==>", t)
      console.log("i==>", i)
      let I = parseInt(i / 60) > 9 ? parseInt(i / 60) : "0" + parseInt(i / 60)
      let end = i % 60 > 9 ? i % 60 : "0" + i % 60
      u.setData({
        AudioDuration: (d / 60).toFixed(2),
        AudioOffset: e,
        AudioStarttime: o,
        AudioMax: i,
        AudioLong: I + ":" + end
      });
    })
    backgroundAudioManager.onEnded(function (a) {
      u.setData({
        AudioPlayHidden: !1,
        ThumbAnimation: !1,
        onEnded: !0
      }), app.globalData.BackgroundAudioPlay = "", app.globalData.BackgroundAudioId = "";
    });
  },
  sliderchange: function (a) {
    var t = parseInt(a.detail.value);
    backgroundAudioManager.seek(t);
  },
  onloadAudioManager: function () {
    var a = this;
    wx.cloud.getTempFileURL({
      fileList: [a.data.wallData[0].voice],
      success: res => {
        (backgroundAudioManager.src = encodeURI(res.fileList[0].tempFileURL),
          backgroundAudioManager.title = a.data.title), wx.setNavigationBarTitle({
            title: "音频加载中···"
          }),
          backgroundAudioManager.epname = a.data.title, backgroundAudioManager.singer = a.data.wallData[0].userInfo.nickName;
      },
      fail: err => {
        // handle error
      }
    })
  },
  updataAudio: function () {
    var a = this;
    "0:00" == a.data.AudioDuration || 1 == a.data.onEnded ? a.onloadAudioManager() : backgroundAudioManager.play(),
      a.backgroundAudioFunction(), a.setData({
        AudioPlayHidden: !0,
        ThumbAnimation: !0
      }), backgroundAudioManager.startTime = backgroundAudioManager.currentTime;
  },

  // audioPlay() {
  //   wx.cloud.getTempFileURL({
  //     fileList: [this.data.wallData[0].voice],
  //     success: res => {
  //       backgroundAudioManager.src = encodeURI(res.fileList[0].tempFileURL)
  //     },
  //     fail: err => {
  //       // handle error
  //     }
  //   })
  //   backgroundAudioManager.title = this.data.title
  //   backgroundAudioManager.onPlay(() => {
  //     wx.setKeepScreenOn({
  //       keepScreenOn: true
  //     })
  //     this.setData({ showPlay: false })
  //   })
  //   backgroundAudioManager.onStop(() => {
  //     wx.setKeepScreenOn({
  //       keepScreenOn: false
  //     })
  //     this.setData({ showPlay: true, percent: 0 })
  //   })
  //   backgroundAudioManager.onPause(() => {
  //     wx.setKeepScreenOn({
  //       keepScreenOn: false
  //     })
  //     this.setData({ showPlay: true })
  //   })
  //   backgroundAudioManager.onEnded(() => {
  //     wx.setKeepScreenOn({
  //       keepScreenOn: false
  //     })
  //     this.setData({ showPlay: true, percent: 0 })
  //   })
  //   setTimeout(() => {
  //     backgroundAudioManager.onTimeUpdate(() => {
  //       let percent = parseInt(backgroundAudioManager.currentTime / backgroundAudioManager.duration * 100)
  //       this.setData({ percent: percent })
  //     })
  //   }, 500)
  // },

  // audioPause() {
  //   backgroundAudioManager.pause()
  //   backgroundAudioManager.title = this.data.title
  //   backgroundAudioManager.onPause(() => {
  //     this.setData({ showPlay: true })
  //   })
  //   backgroundAudioManager.onPlay(() => {
  //     wx.setKeepScreenOn({
  //       keepScreenOn: true
  //     })
  //     this.setData({ showPlay: false })
  //   })
  // },

  onShow: function () {
    // this.getWallData(0, this.data.wallData.length, false)

  },

  toDaka() {
    wx.showLoading({
      title: '正在跳转',
      mask: true
    })
    wx.navigateTo({
      url: './speechDaka?speech=' + JSON.stringify(this.data.wallData[0]),
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