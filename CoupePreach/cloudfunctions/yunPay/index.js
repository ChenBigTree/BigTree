//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init()

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
const config = {
  appid: 'wxafa3ec7cc695fda2',
  mchid: '1530285331',
  partnerKey: 'os5xyo5q3pgjaejzlv1c4iuzv2ddgylg',
  notify_url: 'https://mp.weixin.qq.com',
  spbill_create_ip: '127.0.0.1' //这里填这个就可以
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    orderid,
    money,
    gname
  } = event;
  //3，初始化支付
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: orderid,
    body: gname,
    total_fee: parseInt(money*100), //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  });
  return {result:result,openid:wxContext.OPENID};
}