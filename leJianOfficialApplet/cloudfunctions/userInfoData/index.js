// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

let _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "add") {
    let userInfoList = (await cloud.database().collection("userInfoData").get()).data
    let arr = []
    for (let i in userInfoList) {
      arr.push(userInfoList[i].userInfoData.openid)
    }
    let e = arr.includes(wxContext.OPENID)
    if (!e) {
      return await cloud.database().collection("userInfoData").add({
        data: {
          openid: event.openid,
          nickName: event.nickName,
          avatarUrl: event.avatarUrl,
          isAdministrator:event.isAdministrator,
          city: event.city,
        }
      })
    }
  } else if (event.fun == "get") {
    return await cloud.database().collection("userInfoData").where({
      openid: wxContext.OPENID
    }).get()
  }
}