// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userInfoData = cloud.database().collection("userInfoData")
  if (event.fun == "add") { // 存储个人信息
    let user = (await userInfoData.where({
      openid: wxContext.OPENID
    }).get()).data.length

    if (user == 0) {
      return await userInfoData.add({
        data: {
          userInfoData: event.userInfoData,
          openid: wxContext.OPENID
        }
      })
    }else{
      return "用户已存在"
    }
  } else if (event.fun == "get_personal") { // 获取个人信息
    return await userInfoData.where({
      openid: wxContext.OPENID
    }).get()
  }
}