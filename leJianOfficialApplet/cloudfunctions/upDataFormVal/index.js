// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 管理员拒绝商家申请
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.obj == 'process') {
    return await cloud.database().collection("sub-companyData").doc(event.id).update({
      data: {
        // formVal: {
        process: true
        // }
      }
    })
  } else {
    return await cloud.database().collection("sub-companyData").doc(event.id).update({
      data: {
        // formVal: {
        process: true,
        isPass: true
        // }
      }
    })
  }
}