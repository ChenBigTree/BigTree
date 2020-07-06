<template>
  <div class="hello">
  
    <div @click="clicks">登录</div>
  </div>
</template>

<script>
// import tcb from "../tcb"
import tcb from './tcb'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }, 
  // methods: {
  //   clicks() {
  //     provider.signInWithRedirect();
  //     // 如果页面含有微信的登录态，那么回调中会存在 LoginState
  //     provider.getRedirectResult().then(loginState => {
  //       if (loginState) {
  //         // 有登录态
  //         console.log("登陆成功",loginState)
  //       }else{
  //         console.log("失败")
  //       }
  //     })
  //   }
  // },
  
  created() {
    // var app = tcb.init({
    //   traceUser: true,
    //   env: "kpxjt-pjo8d"
    // });
    // console.log(app)
    // const provider = app.auth().weixinAuthProvider({
    //   appid: "wxafa3ec7cc695fda2",
    //   scope: "snsapi_userinfo"
    // });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
