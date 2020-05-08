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
    } else if (event.get == 'exclusive') { // 获取指定用户全部动态数据
      return await cloud.database().collection('circle').where({
        _openid: wxContext.OPENID
      }).get()
    } else if (event.get == 'homeAll') { // 首页获取全部已同意上架的所有数据
      return await cloud.database().collection("circle").where({
        isShow: {
          isApply: true,
          isPass: true
        }
      }).get()
    } else if (event.get == 'homeAssign') { // 首页获取指定已同意上架的热门数据前五条
      return await cloud.database().collection("circle").where({
        isShow: {
          isApply: true,
          isPass: true
        },
        tag:event.tag
      }).get()
    }

  } else if (event.fun == "update") {
    let data = cloud.database().collection("circle").doc(event.id)
    if (event.update == "yes") { // 管理员通过用户申请动态上架
      return await data.update({
        data: {
          isShow: {
            isApply: true,
            isPass: true
          }
        }
      })
    } else if (event.update == "no") { // 管理员不通过用户申请动态上架
      return await data.update({
        data: {
          isShow: {
            isApply: false,
            isPass: true
          }
        }
      })
    } else if (event.update == "up") { // 用户提出申请动态上架
      return await data.update({
        data: {
          isShow: {
            isApply: true,
            isPass: false
          }
        }
      })
    } else if (event.update == "down") { // 用户提出申请动态下架
      return await data.update({
        data: {
          isShow: {
            isApply: false,
            isPass: false
          }
        }
      })
    }
  }
}