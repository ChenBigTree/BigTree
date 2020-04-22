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
          _id: event.where
        }).get()
      }
    }
  } else if (event.fun == "business") {
    let dataList = await cloud.database().collection("sub-companyData").where({
      openid: wxContext.OPENID
    }).get()
    if (dataList.data == []) {
      return "该账号未有提交记录"
    } else {
      for (let i in dataList) {
        if (dataList[i].isPass) {
          return 'true'
        }
      }
    }
  }

}