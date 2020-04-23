// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

let _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "add") {
    let userInfoList = (await cloud.database().collection("userInfoData").where({
      openid: event.openid
    }).get()).data

      if (userInfoList.length == 0) {
        return await cloud.database().collection("userInfoData").add({
          data: {
            openid: event.openid,
            nickName: event.nickName,
            avatarUrl: event.avatarUrl,
            isAdministrator: false,
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