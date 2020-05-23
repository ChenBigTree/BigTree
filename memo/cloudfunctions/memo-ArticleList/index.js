// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "wx99155eb36a6a05c7-8oeqj"
})

const _ = cloud.database().command

// 云函数入口函数 
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.fun == "add") {
    return await cloud.database().collection("memo-ArticleList").add({
      data: {
        ops: event.test,
        time: event.time,
        text: event.text,
        imageFirst: event.imageFirst,
      },
    })
  } else if (event.fun == "get") {
    return await cloud.database().collection("memo-ArticleList").where({
      time: {
        month: _.eq(event.i)
      }
    }).get()
  } else if (event.fun == "remove") {
    return await cloud.database().collection(event.name).where({
      _id: _.neq("")
    }).remove()
  }
}