// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let db = cloud.database().command
  return await cloud.database().collection('chapters').where({
    _id: db.in(event.ids)
  }).get()
}