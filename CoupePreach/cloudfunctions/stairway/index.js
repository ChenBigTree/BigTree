// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "get") {
    if (event.get == "all") { // 管理员获取所有用户动态数据
      return await cloud.database().collection(event.collective).get()
    } else if (event.get == "some") { // 管理员获取用户提出申请动态上架数据
      return await cloud.database().collection("circle").where({
        isShow: {
          isApply: true,
          isPass: false
        }
      }).get()
    } else if (event.get == "exclusive") { // 获取指定用户全部动态数据
      return await cloud.database().collection('circle').where({
        _openid: wxContext.OPENID
      }).get()
    } else if (event.get == "one") { // 获取指定用户全部动态数据
      return await cloud.database().collection('circle').where({
        _id: event.id
      }).get()
    } else if (event.get == "homeAll") { // 首页获取全部已同意上架的所有数据
      return await cloud.database().collection("circle").where({
        isShow: {
          isApply: true
        }
      }).get()
    } else if (event.get == "homeAssign") { // 首页获取指定标签的已同意上架的热门数据前五条
      return await cloud.database().collection("circle").where({
        isShow: {
          isApply: true
        },
        tag: event.tag
      }).get()
    } else if (event.get == "individual") { // 其他用户获取个人课程

      if (event.openid == wxContext.OPENID) {
        return {
          data: (await cloud.database().collection("circle").where({
            _openid: event.openid
          }).get()),
          isF: true
        }
      } else {
        return {
          data: (await cloud.database().collection("circle").where({
            _openid: event.openid,
            isShow: {
              isApply: true
            }
          }).get()),
          isF: false
        }
      }
    }

  } else if (event.fun == "update") {
    let data1 = cloud.database().collection("circle").doc(event.id)
    let data2 = cloud.database().collection("userInfoData").doc(event.id)
    if (event.update == "yes") { // 管理员通过讲师入住
      return await data2.update({
        data: {
          isTeacher: true
        }
      })
    } else if (event.update == "no") { // 管理员不通过讲师入住
      return await data2.update({
        data: {
          isTeacher: false
        }
      })
    } else if (event.update == "up") { // 用户提出申请动态上架
      return await data1.update({
        data: {
          isShow: {
            isApply: true
          }
        }
      })
    } else if (event.update == "down") { // 用户提出申请动态下架
      return await data1.update({
        data: {
          isShow: {
            isApply: false
          }
        }
      })
    } else if (event.update == "dianzan") {
      return await data1.update({
        data: {
          zans: event.zansArr
        }
      })
    }
  }
}