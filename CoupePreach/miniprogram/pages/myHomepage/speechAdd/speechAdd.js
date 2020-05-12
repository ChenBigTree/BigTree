// pages/community/speechAdd.js
const {
  $Message
} = require('../../../components/base/index');
const recorderManager = wx.getRecorderManager()
const backgroundAudioManager = wx.getBackgroundAudioManager()
var util = require("../../../utils/util.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClassify: true,
    percent: 100,
    startClick: false,
    //contentHeight: contentHeight,
    voiceState: false,
    tempFilePath: '', //临时录音文件路径
    recordingTimeqwe: 0, //录音计时
    setInter: "", //录音名称
    isplay: false, //播放状态 true--播放中 false--暂停播放
    uploadState: false,
    showhandle1: true,
    showhandle2: false,
    showWaveView: false,
    currentLeft: 10,
    currentTime: '00',

    time: '',
    lists: [],
    show: false,
    tag: '',
    collection: '',

    //max:30,
    ifIncrease: true,
    duration: '',
    buttonClicked: false,
    playImg: '../../../images/icon/playg.png',
    recordImg: '../../../images/icon/record.png',
    okImg: '../../../images/icon/okg.png',
    numVoice: 600000, //录音时长，毫秒数
    j: 1, //帧动画初始图片 
    k: 0, //初始时间 
    isSpeaking: false, //是否正在说话
    rTime: 0, //录音秒数
    playProgress: 0,

    tmpImgs: [],
    tmpVoice: '',
    imgs: [],
    voice: '',
    title: '',
    ifbeginRecord: true,
    //tempFilePath: "",//临时录音文件路径
    indicatorDots: true,
    imgheights: [],
    vertical: false,
    autoplay: false,
    interval: 2000,
    current: 0, //swiper当前位置
    duration: 500,
    curriculumId: null
  },

  chose: function (e) {
    this.setData({
      tag: this.data.lists[e.currentTarget.dataset.index].tag
    })
    console.log(this.data.tag)
  },
  hidden: function () {
    this.setData({
      show: !this.data.show
    })
  },
  getTime: function () {
    var date = new Date()
    var year = date.getFullYear(); //年
    var month = date.getMonth() + 1; //月
    var day = date.getDate(); //日
    console.log(year + '-' + month + '-' + day)
    this.setData({
      time: year + '-' + month > 9 ? month : ("0" + month) + '-' + day > 9 ? day : ("0" + day)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime()
    if (options.id) {
      this.setData({
        curriculumId: options.id,
        showClassify: false
      })
    } else {
      this.setData({
        curriculumId: '',
        showClassify: true
      })
    }
    this.initRecord()
    // 查看是否授权
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
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
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log("openid-->", res.result.openid)
      that.setData({
        openid: res.result.openid
      })
    })
    // 获取分类列表
    wx.cloud.callFunction({
      name: 'projectClassify',
      data: {
        collectionName: 'curriculumClassify',
        fun: "get"
      },
      success: res => {

        console.log('集合', res.result.data)
        this.setData({
          lists: res.result.data,
        })
      },
    })
  },
  onHide: function () { //离开页面
    backgroundAudioManager.stop()
  },
  onUnload: function () { //离开页面
    backgroundAudioManager.stop()
  },
  onShow() {

  },
  initRecord: function () {
    recorderManager.onStart(() => {
      console.log('开始录音')
      let numVoice = parseInt(this.data.numVoice / 1000)
      this.setData({
        max: numVoice
      })
    })
    recorderManager.onPause(() => {
      console.log('暂停录音')
    })
    recorderManager.onStop((res) => {
      //clearInterval(this.data.setInter);
      clearInterval(this.timer); //清空计时器
      this.setData({
        voiceState: true,
        currentLeft: 10
      })
      console.log('结束录音', res)
      const {
        tempFilePath
      } = res
      var rTime = this.data.k;
      this.setData({
        tmpVoice: tempFilePath,
        k: 0,
        j: 1,
        rTime: res.duration,
        startClick: false,
        isSpeaking: false,
        recordImg: '../../../images/icon/record.png',
        playImg: '../../../images/icon/play.png',
        okImg: '../../../images/icon/ok.png'
      })
      //this.data.tempFilePath = tempFilePath
    })
    recorderManager.onFrameRecorded((res) => {
      const {
        frameBuffer
      } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
  },

  recordingTimer: function () {
    var that = this;
    //将计时器赋值给setInter
    this.data.setInter = setInterval(
      function () {
        let time = that.data.recordingTimeqwe + 1;
        if (time > 10) {
          wx.showToast({
            title: '录音时长最多10s',
            duration: 1500,
            mask: true
          })
          clearInterval(that.data.setInter);
          that.shutRecord();
          return;
        }
        // console.log(time);
        let currentTime = time < 10 ? '0' + time : time;
        that.setData({
          recordingTimeqwe: time,
          currentTime: currentTime,
          currentLeft: that.data.currentLeft + 65
        })
      }, 1000);
  },

  startRecord: function () {
    if (!this.data.isplay) {
      if (!this.data.startClick) { //////////////开始录音
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
        speaking.call(this);
        recordLong.call(this);
        this.setData({
          isSpeaking: true,
          k: 0,
          startClick: true,
          recordImg: '../../../images/icon/stop.png'
        })
        const options = {
          duration: this.data.numVoice, ////录音时长，单位毫秒
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 64000,
          format: 'mp3'
        }
        // 开始倒计时
        //this.recordingTimer()
        // 开始录音
        recorderManager.start(options)
      } else { /////////////停止录音
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
        recorderManager.stop()
        this.setData({
          startClick: false,
          isSpeaking: false,
          recordImg: '../../../images/icon/record.png'
        })
        clearInterval(this.timer);
      }
    } else {
      console.log('startRecord fail')
      return
    }
  },

  playVoice: function (e) {
    // 试听
    util.buttonClicked(this);
    let that = this
    //let rTime=that.data.rTime
    //let isplay = e.currentTarget.dataset.isplay;
    if (!that.data.startClick && (that.data.tmpVoice != '')) {
      backgroundAudioManager.title = '我的录音'
      backgroundAudioManager.src = that.data.tmpVoice
      backgroundAudioManager.onPlay(() => {
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
        that.setData({
          isplay: true,
          playImg: '../../../images/icon/stopg.png',
          recordImg: '../../../images/icon/recordg.png',
          okImg: '../../../images/icon/okg.png'
        })
        console.log("音乐播放开始")
      })
      backgroundAudioManager.onStop(() => {
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
        that.setData({
          percent: 100,
          isplay: false,
          playImg: '../../../images/icon/play.png',
          recordImg: '../../../images/icon/record.png',
          okImg: '../../../images/icon/ok.png'
        })
        console.log("音乐播放停止")
      })
      backgroundAudioManager.onPause(() => {
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
        that.setData({
          isplay: false,
          playImg: '../../../images/icon/play.png',
          recordImg: '../../../images/icon/record.png',
          okImg: '../../../images/icon/ok.png'
        })
        console.log("音乐播放暂停")
      })
      backgroundAudioManager.onEnded(() => {
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
        that.setData({
          percent: 100,
          isplay: false,
          playImg: '../../../images/icon/play.png',
          recordImg: '../../../images/icon/record.png',
          okImg: '../../../images/icon/ok.png'
        })
        console.log("音乐播放结束", that.data.tmpVoice)
      })
      backgroundAudioManager.onTimeUpdate(() => {
        let offset = backgroundAudioManager.currentTime
        let currentTime = parseInt(offset)
        let duration = backgroundAudioManager.duration
        let percent = parseInt(offset * 100 / duration)
        that.setData({
          percent: percent
        })
      })
      if (that.data.playImg == '../../../images/icon/play.png') {
        that.setData({
          playImg: '../../../images/icon/stopg.png',
          recordImg: '../../../images/icon/recordg.png',
          okImg: '../../../images/icon/okg.png'
        })
        backgroundAudioManager.pause()
      } else if (that.data.playImg == '../../../images/icon/stopg.png') {
        that.setData({
          playImg: '../../../images/icon/play.png',
          recordImg: '../../../images/icon/record.png',
          okImg: '../../../images/icon/ok.png'
        })
        backgroundAudioManager.play()
      }
    } else {
      console.log('playVoice fail')
      return
    }
  },

  onChange: function (t) { ///////////input
    this.setData({
      title: t.detail.value
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res) ////
        that.setData({
          tmpImgs: res.tempFilePaths,
          ifIncrease: false
        });
      }
    })
    console.log(that.data.files)
  },

  updateImgs: function () {
    //return new Promise((resolve, reject) => {
    let that = this
    if (0 === that.data.tmpImgs.length) {
      that.updateVoice() //////////////////--------------updateVoice
    } else {
      var tempIds = []
      var num = 0
      for (var i = 0; i < that.data.tmpImgs.length; i++) {
        const filePath = that.data.tmpImgs[i]
        var rn = Math.floor(Math.random() * 10000 + 1) //随机数
        var name = Date.parse(new Date()) / 1000
        const cloudPath = 'speech/img/' + that.data.userInfo.nickName + "/" + rn + name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: res => {
            console.log('uploadImg--->', res) ///////////////------------04
            tempIds.push(res.fileID)
            num = num + 1
            if (num === that.data.tmpImgs.length) {
              that.setData({
                imgs: tempIds
              })
              console.log('imgs--->', that.data.imgs) /////////////---------03
              //resolve(tempIds)
              that.updateVoice() //////////////////----------------updateVoice
            }
          },
          fail: err => {
            console.log('uploadImg--err->', err)
            wx.hideLoading()
          }
        })
      }

    }
    //})
  },

  updateVoice: function () {
    //return new Promise((resolve, reject) => {
    let that = this
    const filePath = that.data.tmpVoice
    var rn = Math.floor(Math.random() * 10000 + 1) //随机数
    var name = Date.parse(new Date()) / 1000
    const cloudPath = 'speech/voice/' + that.data.userInfo.nickName + "/" + rn + name + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        console.log('updateVoice---->', res.fileID) //////////////----------05
        that.setData({
          voice: res.fileID
        })
        that.saveData() ///////////////////------------saveData
        //resolve(res.fileID)
      },
      fail: err => {
        console.log('updateVoice--err-->', err)
        wx.hideLoading()
        //reject(err)
      }
    })
    //})
  },

  saveData: function (sData) {

    let that = this
    const db = wx.cloud.database()
    console.log("that.data.userInfo", that.data.userInfo)
    if (this.data.curriculumId) {
      db.collection('chapters').add({
        data: {
          type: 'speech',
          userInfo: that.data.userInfo,
          createTime: db.serverDate(),
          content: that.data.textareaTxt,
          title: that.data.title,
          time: that.data.time,
          zans: [],
          views: 0,
          images: that.data.imgs,
          voice: that.data.voice,
          comments: [],
          dakas: [],
          //tab: tab,
          isTop: false,
        },
        success: res => {
          console.log('db add success--->', res) ////////////
          wx.cloud.callFunction({
            name: "operate_curriculum",
            data: {
              method: 'update',
              id: that.data.curriculumId,
              chapterId: res._id
            }
          }).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            if (that.data.curriculumId) {
              console.log("跳转forumManager", that.data.userInfo)
              wx.reLaunch({
                url: '../forumManager/forumManager?id=' + that.data.curriculumId,
              })
            } else {
              console.log("跳转myHomepage1", that.data.userInfo)
              wx.reLaunch({
                url: '../myHomepage/myHomepage',
              })
            }
          })

          //resolve(res)
        },
        fail: err => {
          console.log('db add fail--->', err) //////////////
          wx.hideLoading()
          //reject(err)
        }
      })
    } else {
      db.collection('circle').add({
        data: {
          tag: this.data.tag,
          type: 'speech',
          userInfo: that.data.userInfo,
          createTime: db.serverDate(),
          content: that.data.textareaTxt,
          title: that.data.title,
          time: new Date().getTime(),
          zans: [],
          views: 0,
          images: that.data.imgs,
          voice: that.data.voice,
          comments: [],
          dakas: [],
          //tab: tab,
          isTop: false,
          isShow: {
            isPass: false,
            isApply: false
          }
        },
        success: res => {
          console.log('db add success--->', res) ////////////
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          console.log("跳转myHomepage2", that.data.userInfo)
          wx.reLaunch({
            url: '../myHomepage',
          })
          //resolve(res)
        },
        fail: err => {
          console.log('db add fail--->', err) //////////////
          wx.hideLoading()
          //reject(err)
        }
      })

    }

    //})
  },

  subOk: async function () {
    if (!this.data.startClick && !this.data.isplay) {
      console.log('saveData ok') ///////////---------01
      if (this.data.tmpVoice == '') {
        wx.showToast({
          title: '请先录音',
          icon: 'none',
        })
        return
      }
      if (this.data.showClassify) {
        if (this.data.tag == '') {
          wx.showToast({
            title: '标签不能为空',
            icon: 'none',
          })
          return
        }
      }
      wx.showLoading({
        title: '数据上传中',
        mask: true
      })
      this.updateImgs()
      //if (this.data.tmpImgs.length == 0) {
      //console.log('this.data.tmpImgs.length == 0')
      //let result1 = await this.updateVoice()
      //let result2 = await this.saveData(result1)
      //} else {
      //console.log('this.data.tmpImgs.length != 0')//////////////////////-----------02
      //let result1 = await this.updateImgs()
      //let result2 = await this.updateVoice(result1)
      //let result3 = await this.saveData(result2)
      //}

    } else {
      console.log('subOk fail')
    }
  },

  showIncrease: function () {
    let ifIncrease = this.data.ifIncrease
    this.setData({
      ifIncrease: !ifIncrease
    })
  },

})


//麦克风帧动画 
function speaking() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}
//时间动画 
function recordLong() {
  var _this = this;
  var i = 0;
  this.timer = setInterval(function () {
    i++;
    if (i == _this.data.numVoice / 1000 - 5) {
      //wx.vibrateLong();
      $Message({
        content: '离录音结束时间还有5秒钟！',
        type: 'error'
      });
    }
    _this.setData({
      k: i
    })
  }, 1000);
}