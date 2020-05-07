// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.fun == "get") {
      return await cloud.database().collection(event.collectionName).get()
    
  } else if (event.fun == "add") {
    let tag = (await cloud.database().collection(event.collectionName).where({
      tag: event.tag
    }).get()).data.length
    if (tag == 0) {
      return await cloud.database().collection(event.collectionName).add({
        data: {
          tag: event.tag
        }
      })
    }else{
      return "课程名已存在"
    }
  } else if (event.fun == "del") {
    return await cloud.database().collection(event.collectionName).where({
      _id: event._id
    }).remove()
  } else if (event.fun == "update") {
    return await cloud.database().collection(event.collectionName).doc(event._id).update({
      data: {
        tag: event.tag
      }
    })
  } 
}