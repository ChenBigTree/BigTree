// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "get") {
    if (event.get == "all") {
      return await cloud.database().collection(event.collective).get()
    } else if (event.get == "some") {
      return await cloud.database().collection(event.collective).where({
        isShow: {
          isApply: true,
          isPass: false
        }
      }).get()
    }
  }
}