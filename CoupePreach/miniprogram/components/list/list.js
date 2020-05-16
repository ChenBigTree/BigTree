Component({
  properties: {
    lists: Array
  },
  data: {
    list: [],
    activeIndex: 0,
    class: "bottom",
    li1HeigthNum: 0,
    li2HeigthNum: 0,
    cate1Info: "",
    calScrollItems:"",
    li1: [{
      image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589460761007&di=8ef9f64b1dbeb2a5844d8617b174f702&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F66%2F78%2F01300000012901131078788371845.jpg",
      text: "遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况"
    }, {
      image: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg",
      text: "遇到需要将"
    }, ],
    li2: [{
      image: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg",
      text: "遇到需要将"
    }, {
      image: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg",
      text: "遇到需要将"
    }, ],

    arr: [{
      image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589460761007&di=8ef9f64b1dbeb2a5844d8617b174f702&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F66%2F78%2F01300000012901131078788371845.jpg",
      text: "1遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况"
    }, {
      image: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg",
      text: "2遇到需要将"
    }, {
      image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589460761007&di=8ef9f64b1dbeb2a5844d8617b174f702&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F66%2F78%2F01300000012901131078788371845.jpg",
      text: "3遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况"
    }, {
      image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589460761007&di=8ef9f64b1dbeb2a5844d8617b174f702&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F66%2F78%2F01300000012901131078788371845.jpg",
      text: "4遇到需要将两组合并情"
    }, {
      image: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg",
      text: "5遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况遇到需要将两组合并情况"
    }, {
      image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589460761007&di=8ef9f64b1dbeb2a5844d8617b174f702&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F66%2F78%2F01300000012901131078788371845.jpg",
      text: "6遇到需要将两组合"
    }, ]
  },

  methods: {
    chooseCatalog: function (event) {
      this.setData({
        activeIndex: event.currentTarget.dataset.index
      })
    },

    swiperChange: function (e) {
      console.log("swiperChange")
      console.log(e.detail.current)
      this.setData({
        activeIndex: e.detail.current,
      })
      this.activeIndex = e.detail.current;
      this.calcScrollLeft();
    },
    // 横滑同步距离计算
    calcScrollLeft: function () {
      console.log("calcScrollLeft")
      if (this.data.activeIndex < 2) this.setData({
        scrollLeft: 0
      });
      this.calcTextLength(this.data.activeIndex)
    },

    calAllScrollItem() {
      console.log("calAllScrollItem")
      let query = wx.createSelectorQuery().in(this);
      let nodeRef = query.selectAll(`.scroll-view-item`);
      this.currentWidth = 0;
      nodeRef.boundingClientRect().exec(ret => {
        console.log("ret[0]",ret[0])
        if (!ret || !ret.length) return;
        this.setData({
          calScrollItems: ret[0]
        });
        console.log("calScrollItems", ret[0])
      });
    },

    // 计算文本长度
    calcTextLength: function (index = 0) {
      console.log("calcTextLength")
      if (!index || !this.data.cate1Info || !this.data.cate1Info.length) return 0
      let length = 0;
      const cate1Info = this.data.cate1Info;
      console.log("cate1Info",cate1Info)
      const currentWidth = this.data.calScrollItems[index].width;
      for (let i = 0; i < index; i += 1) {
        length += this.data.calScrollItems[i].width;
      }
      // console.log("length==>", length)
      // console.log("currentWidth==>", currentWidth)
      this.setData({
        scrollLeft: length - ((wx.getSystemInfoSync().windowWidth - currentWidth) / 2)
      });
      return length;
    },

    // 点击下拉列表展示数据
    showListPage(e) {
      console.log(e.currentTarget.dataset.name)
      if (e.currentTarget.dataset.name != "listPage") {
        this.setData({
          class: "bottom",
          activeIndex: e.currentTarget.dataset.key
        })
        // this.listFun(e.currentTarget.dataset.key)
      } else {
        this.setData({
          class: "top"
        })
      }
    },


    // li1Heigth() {
    //   let _this = this
    //   // var query = wx.createSelectorQuery().in(this);
    //   query.select('#li-1').boundingClientRect().exec(function (res) {
    //     _this.setData({
    //       li1HeigthNum: res[0].height
    //     })
    //   })
    // },
    // li2Heigth() {
    //   // let _this = this
    //   var query = wx.createSelectorQuery().in(this);
    //   console.log('query==>',query)
    //   query.select('li-2').boundingClientRect().exec(function (res) {
    //     console.log(res)
    //     // this.setData({
    //     //   li2HeigthNum: res[0].height
    //     // })
    //   })
    // },
    // c() {
    //   console.log("li1Heigth", this.data.li1HeigthNum);
    //   console.log("li2Heigth", this.data.li2HeigthNum);
    // },

  },
  lifetimes: {
    // 挂载完成后执行
    ready: function () {

      this.calAllScrollItem();
      // this.li2Heigth()
    },

    attached: function () {
      // 可以在这里发起网络请求获取插件的数据
      // this.c()
    },
  }
})