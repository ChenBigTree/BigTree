// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// openid: wxContext.OPENID

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const teacherDataList = db.collection("teacherDataList")
  if (event.fun == "add") {
    return await teacherDataList.add({
      data: {
        name: event.name,
        time: new Date().valueOf(),
        phoneVal: event.phoneVal,
        state: {
          isDispose: false,
          isPass: false
        },
        openid: wxContext.OPENID,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName
      }
    })
  } else if (event.fun == "get") {
    if (event.get == "pending") {
      return await teacherDataList.where({
        state: {
          isDispose: false,
          isPass: false
        }
      }).get()
    } else if (event.get == "allData") {
      return await teacherDataList.where({
        state: {
          isDispose: true,
          isPass: true
        }
      }).get()
    }
  } else if (event.fun == "update") {
    if (event.update == "yes") {
      await cloud.database().collection("userInfoData").where({
        openid: event.openid
      }).update({
        data: {
          isTeacher: true
        }
      })
      return await teacherDataList.doc(event.id).update({
        data: {
          state: {
            isDispose: true,
            isPass: true
          },
          passTime: new Date().valueOf(),
        }
      })
    } else if (event.update == "del") {
      await cloud.database().collection("userInfoData").where({
        openid: event.openid
      }).update({
        data: {
          isTeacher: false
        }
      })
      return await teacherDataList.where({
        openid: event.openid
      }).remove()
    } else {
      return await teacherDataList.doc(event.id).update({
        data: {
          state: {
            isDispose: true,
            isPass: false
          }
        }
      })
    }
  }
}