<template>
  <div class="v">
    <div @click="clicks"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import tcb from "./tcb";
export default {
  name: "v",
  methods: {
    clicks() {
      provider.signInWithRedirect();
      // 如果页面含有微信的登录态，那么回调中会存在 LoginState
      provider.getRedirectResult().then(loginState => {
        if (loginState) {
          // 有登录态
          console.log("登陆成功",loginState)
        }else{
          console.log("失败")
        }
      })
    }
  },
  created() {
    const app = tcb.init({
      traceUser: true,
      env: "mywf-10048d"
    });

    const provider = app.auth().weixinAuthProvider({
      appid: "wxdd9b472e622dfe9e",
      scope: "snsapi_userinfo"
    });
  }
};
</script>
