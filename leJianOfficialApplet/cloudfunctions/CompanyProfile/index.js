// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await cloud.database().collection("CompanyProfileList").add({
    data: {
      formVal:event.formVal
    },
  })
}

// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init({
//   // API 调用都保持和云函数当前所在环境一致
//   env: cloud.DYNAMIC_CURRENT_ENV
// })

// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
//   const shareResult=await cloud.database().collection('zp_share').where({
//     shareOpenid:event.shareOpenid,
//     openid:wxContext.OPENID
//   }).get()
//   if (shareResult.data.length == 0 && shareOpenid != wxContext.OPENID) {
//     return await cloud.database().collection('zp_share').add({
//       data: {
//         shareOpenid: event.shareOpenid,
//         openid: wxContext.OPENID,
//         openTime: new Date(Date.now() + (8 * 60 * 60 * 1000))
//       }
//     });
//   }
// }