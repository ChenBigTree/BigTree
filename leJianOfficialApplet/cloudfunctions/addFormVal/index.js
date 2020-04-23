// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 提交商家申请的基本资料
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "add") {
    return await cloud.database().collection("sub-companyData").add({
      data: {
        name: event.name,
        useImg: event.useImg,
        openid: event.openid,
        companyName: event.companyName,
        linkman: event.linkman,
        process: event.process,
        isPass: event.isPass,
        iponeVal: event.iponeVal,
      }
    })
  } else if (event.fun == "updata") {
    if (event.obj == 'process') { // 管理员拒绝商家数据请求，修改后台数据
      return await cloud.database().collection("sub-companyData").doc(event.id).update({
        data: {
          process: true
        }
      })
    } else { // 管理员通过商家数据请求，修改后台数据
      return await cloud.database().collection("sub-companyData").doc(event.id).update({
        data: {
          process: true,
          isPass: true
        }
      })
    }
  } else if (event.fun == "get") {
    if (event.collectionName == "sub-companyData") { // 管理员获取未拒绝的商家申请数据
      return await cloud.database().collection("sub-companyData").where({
        process: false
      }).get()
    } else if (event.collectionName == "CompanyProfileList") { // 获取合作伙伴信息
      if (event.where == "") { //获取所有商家信息
        return await cloud.database().collection("CompanyProfileList").get()
      } else { // 获取点击的商家信息
        return await cloud.database().collection("CompanyProfileList").where({
          openid: event.where
        }).get()
      }
    }
  } else if (event.fun == "business") {
    let dataList = await cloud.database().collection("sub-companyData").where({
      openid: wxContext.OPENID
    }).get()
    if (dataList.data.length == 0) {
      return {
        isB: false,
        isShow: false,
        isText: "对不起！您未有提交加盟申请列表"
      }
    } else {
      if (dataList.data[0].isPass == false && dataList.data[0].process == false) {
        return {
          isB: true,
          isShow: false,
          isText: "你提交的申请，管理员未处理"
        }
      } else if (dataList.data[0].isPass == false && dataList.data[0].process == true) {
        return {
          isB: true,
          isShow: false,
          isText: "你提交的申请未能通过审核"
        }
      } else if (dataList.data[0].isPass == true && dataList.data[0].process == true) {
        let bus = await cloud.database().collection("CompanyProfileList").where({
          openid: wxContext.OPENID
        }).get()

        if (bus.data.length == 0) {
          return {
            isB: true,
            isShow: false,
            isText: ""
          }
        } else {
          return {
            isB: true,
            isShow: true,
            isText: "您已成为我们的合作伙伴"
          }
        }
      }
    }
  }
}