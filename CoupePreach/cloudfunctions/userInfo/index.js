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
          nickName: event.userInfoData.nickName,
          avatarUrl: event.userInfoData.avatarUrl,
          city: event.userInfoData.city,
          isAdministrator: event.userInfoData.isAdministrator,
          isTeacher: event.userInfoData.isTeacher,
          isDistributionMember: event.userInfoData.isDistributionMember,
          fans: event.userInfoData.fans,
          partner: event.userInfoData.partner,
          PriceOfCourse: event.userInfoData.PriceOfCourse,
          openid: wxContext.OPENID,
          individualResume:event.userInfoData.individualResume
        }
      })
    } else {
      return "用户已存在"
    }
  } else if (event.fun == "get_personal") { // 获取自己信息
    return await userInfoData.where({
      openid: wxContext.OPENID
    }).get()
  } else if (event.fun == "get_othersInformation") { // 获取他人信息
    return await userInfoData.where({
      openid: event.openid
    }).get()
  }
}