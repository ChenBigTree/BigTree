// components/circlePage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // wallData:''
  },

  /**
   * 组件的初始数据
   */
  data: {
    wallData: ""
  },
  /**
   * 组件所在页面的生命周期函数
   */
  pageLifetimes: {
    show: function () {
      this.getAllData()
      // console.log("页面展示时执行")
    },
  },
  /**
   * 组件挂载之前执行
   */
  attached: function () {
    // this.getAllData()
    // console.log("组件挂载之前执行")
  },

  /**
   * 组件挂载后执行
   */
  ready: function () {
    // console.log("组件挂载后执行")
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getAllData() { // 我的所有动态
      let _this = this
      _this.setData({
        wallData: ''
      })
      wx.cloud.callFunction({
        name: "stairway",
        data: {
          fun: "get",
          get: "exclusive"
        },
        success: res => {
          console.log("我的所有动态", res.result.data)
          let s = res.result.data
          for (let i = 0; i < s.length; i++) {
            let date = `${new Date(s[i].time).getFullYear()}-${Number(new Date(s[i].time).getMonth() + 1) >10?Number(new Date(s[i].time).getMonth() + 1):'0'+Number(new Date(s[i].time).getMonth() + 1)}-${new Date(s[i].time).getDate()>10?new Date(s[i].time).getDate():'0'+new Date(s[i].time).getDate()}`
            s[i].date = date
          }

          function compare(e) {
            return function (a, b) {
              var value1 = a[e];
              var value2 = b[e];
              return parseInt(value1) - parseInt(value2);
            }
          }
          var arr2 = s.sort(compare('time')).reverse();
          _this.setData({
            wallData: arr2
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    getData(e) { // 用户提交上下架
      console.log(e.currentTarget.dataset.name)
      if (e.currentTarget.dataset.name == "上架") {
        this.fun('update', 'up', e.currentTarget.dataset.id)
      } else if (e.currentTarget.dataset.name == "待审核") {
        return false
      } else if (e.currentTarget.dataset.name == "下架") {
        this.fun('update', 'down', e.currentTarget.dataset.id)
      } 
    },
    fun(fun, update, id) { // 获取更新后的数据
      let _this = this
      wx.cloud.callFunction({
        name: 'stairway',
        data: {
          fun: fun,
          id: id,
          update: update
        },
        success: res => {
          _this.getAllData()
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    lookDetail(e) { // 点击指定的动态进入详情
      console.log('sdfsadf')
      console.log(e.currentTarget.dataset) ///////////******* */
      wx.navigateTo({
        url: '../../pages/myHomepage/speechDetail/speechDetail?id=' + e.currentTarget.dataset.sid,
      })
    }
  }
})