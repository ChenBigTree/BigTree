// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.collectionName == "sub-companyData") { // 管理员获取未拒绝的商家申请数据
    return await cloud.database().collection("sub-companyData").where({
      formVal: {
        process: false
      }
    }).get()
  } else if (event.collectionName == "CompanyProfileList") { // 获取合作伙伴信息
    if(event.where == ""){
      return await cloud.database().collection("CompanyProfileList").get()
    }else{
      return await cloud.database().collection("CompanyProfileList").where({
        _id:event.where
      }).get()
    }
  }

}