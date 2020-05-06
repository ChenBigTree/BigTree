// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database().command
  const wxContext = cloud.getWXContext()

  if (event.method == 'get') {
    if (event.id) {
      return await cloud.database().collection('curriculum').doc(event.id).get()
    } else if (event.tag) {
      return await cloud.database().collection('curriculum').where({
        tag: event.tag
      }).get()
    } else if (event.openid) {
      return await cloud.database().collection('curriculum').where({
        openid: event.openid
      }).get()
    } else {
      return await cloud.database().collection('curriculum').get()
    }

  } else if (event.method == 'set') {
    let curriculum = event.curriculum
    curriculum.openid = wxContext.OPENID
    return await cloud.database().collection('curriculum').add({
      data: curriculum
    })

  } else if (event.method == 'update') {
    if (event.type == 'pay') {
      return await cloud.database().collection('curriculum').doc(event.id).update({
        data: {
          join: db.push(wxContext.OPENID)
        }
      })
    } else {
      return await cloud.database().collection('curriculum').doc(event.id).update({
        data: {
          chapter: db.push(event.chapterId)
        }
      })
    }

  } else if (event.method == "checking") {
    return await cloud.database().collection('curriculum').where({
      join: wxContext.OPENID
    }).get()
  }


}