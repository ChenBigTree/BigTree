// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.page == "joinUs") {
    let dataList = await cloud.database().collection("sub-companyData").where({
      openid: wxContext.OPENID
    }).get()
    if (dataList.data.length == 0) {
      return {
        text: "",
        isShow: false
      }
    } else {
      if (dataList.data[0].isPass == false && dataList.data[0].process == false) {
        return {
          isB: true,
          isText: "你提交的申请，管理员未处理"
        }
      } else if (dataList.data[0].isPass == false && dataList.data[0].process == true) {
        return {
          isB: true,
          isText: "你提交的申请未能通过审核"
        }
      } else if (dataList.data[0].isPass == true && dataList.data[0].process == true) {
        return {
          isB: true,
          isText: "您已成为我们的合作伙伴"
        }
      }
    }
  } else if (event.page == "del") {
    return cloud.database().collection("sub-companyData").where({
      openid: wxContext.OPENID
    }).remove()
  } 
  
  // else if (event.page == "business") {
  //   let bus = await cloud.database().collection("CompanyProfileList").where({
  //     openid: wxContext.OPENID
  //   }).get()
  //   if (bus.data.length == 0) {
  //     return {
  //       isShow:true,
  //       text:""
  //     }
  //   }else{
  //     return {
  //       isShow:false,
  //       text:"您已成为我们的合作伙伴"
  //     }
  //   }
  // }

}