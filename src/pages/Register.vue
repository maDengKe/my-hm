<template>
  <div class="register">
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <hm-input
      type="text"
      v-model="username"
      placeholder="请输入你的用户名"
      :rule="/^[\u4e00-\u9fa5]{3,7}$/"
      message="你的用户名呢"
      ref="username"
    ></hm-input>
    <hm-input
      type="text"
      v-model="nickname"
      placeholder="请输入您的昵称"
      :rule="/^[\u4e00-\u9fa5]{3,7}$/"
      message="你的昵称呢"
      ref="nickname"
    ></hm-input>
    <hm-input
      type="password"
      v-model="password"
      placeholder="请输入密码"
      :rule="/^\d{3,8}$/"
      message="你的密码呢"
      ref="password"
    ></hm-input>
    <hm-button @click="register">注册</hm-button>
    <div class="tips">
      已经注册？点击这里
      <router-link to="/login">登录</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    register() {
      // 发送请求前优化下 表单校验
      let flag1 = this.$refs.username.validated(this.username);
      let flag2 = this.$refs.nickname.validated(this.nickname);
      let flag3 = this.$refs.password.validated(this.password);
      if (!flag1 || !flag2 || !flag3) {
        return;
      }
      this.$axios({
        method: "post",
        url: "/register",
        data: {
          username: this.username,
          nickname: this.nickname,
          password: this.password
        }
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.$toast.success("注册成功");
          this.$router.push({
            name: "login",
            params: {
              username: this.username,
              nickname: this.nickname,
              password: this.password
            }
          });
          // console.log(this.$route.params);
        }
      });
    }
  },
  data() {
    return {
      username: "",
      nickname: "",
      password: ""
    };
  }
};
</script>

<style scoped lang="less">
span {
  color: red;
}
.tips {
  margin: 20px;
  text-align: right;
}
</style>
