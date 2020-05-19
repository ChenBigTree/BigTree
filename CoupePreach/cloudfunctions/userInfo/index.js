// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const _ = db.command
  const userInfoData = db.collection("userInfoData")
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
          individualResume: event.userInfoData.individualResume,
          distributionMember: event.userInfoData.distributionMember
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
  } else if (event.fun == "update") {
    if (event.update == "distributionMember") { // 添加所购买的课程信息
      return await userInfoData.where({
        openid: wxContext.OPENID,
      }).update({
        data: {
          isDistributionMember: true,
          distributionMember: _.push({
            nickName: event.useInfo.nickName,
            avatarUrl: event.useInfo.avatarUrl,
            city: event.useInfo.city,
            isAdministrator: event.useInfo.isAdministrator,
            isTeacher: event.useInfo.isTeacher,
            isDistributionMember: event.useInfo.isDistributionMember,
            fans: event.useInfo.fans,
            partner: event.useInfo.partner,
            PriceOfCourse: event.useInfo.PriceOfCourse,
            openid: event.useInfo.openid,
            individualResume: event.useInfo.individualResume,
            distributionMember: event.useInfo.distributionMember,
            createTime: db.serverDate()
          })
        }
      })
    } else if (event.update == "administrator") { // 添加管理员

      return await userInfoData.where({
        openid: event.openid
      }).update({
        data: {
          isAdministrator: Boolean(event.boolean)
        }
      })
    } else if (event.update == "headPortrait") { // 更换头像
      await cloud.database().collection("circle").where({
        _openid: wxContext.OPENID
      }).update({
        data: {
          userInfo: {
            avatarUrl: event.avatarUrl
          }
        }
      })
      await cloud.database().collection("teacherDataList").where({
        openid: wxContext.OPENID
      }).update({
        data: {
          avatarUrl: event.avatarUrl
        }
      })
      return await userInfoData.where({
        openid: wxContext.OPENID
      }).update({
        data: {
          avatarUrl: event.avatarUrl
        }
      })
    }
  } else if (event.fun == "get") {

    if (event.get == "allAdministrator") {
      return await userInfoData.where({
        isAdministrator: true
      }).get()
    } else if (event.get == "searchUser") {
      return await userInfoData.where({
        isAdministrator: false,
        nickName: new RegExp(event.keyWord, 'g')
      }).get()
    }
  }
}