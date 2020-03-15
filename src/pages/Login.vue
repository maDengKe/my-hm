<template>
  <div class="login">
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>

    <!-- 目的：hm-input是一个组件，当成一个input框来用的，hm-input组件要有input框的能力 -->
    <!-- 要求用户名只能是手机号  10086 10010 -->
    <hm-input
      type="text"
      placeholder="请输入用户名"
      v-model="username"
      :rule="/^1\d{4,10}$/"
      message="用户名格式不对"
      ref="username"
    ></hm-input>

    <hm-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :rule="/^\d{3,12}$/"
      message="用户密码格式错误"
      ref="password"
    ></hm-input>

    <hm-button @click="login">登录</hm-button>
    <div class="tips">
      还没有注册？点击这里
      <router-link to="/register">注册</router-link>
    </div>
    <div class="test" ref="a"></div>
  </div>
</template>

<script>
export default {
  methods: {
    // 给DOM注册的事件，可以通过DOM的方式触发  给DOM元素注册点击事件，就可以点击触发
    // 如果给组件去注册事件，通过DOM是无法触发。而是通过 this.$emit触发
    login() {
      console.log('我要登录了')
      const flag1 = this.$refs.username.validated(this.username)
      const flag2 = this.$refs.password.validated(this.password)
      console.log(flag1, flag2)

      if (flag1 && flag2) {
        this.$axios({
          method: 'post',
          url: '/login',
          data: {
            username: this.username,
            password: this.password
          }
        })
          .then(res => {
            console.log(res)
            if (res.data.statusCode == 200) {
              this.$router.push('/user')
              this.$toast.success('666，登录成功')
            } else {
              this.$toast.fail('不好意思，您登陆失败了')
            }
          })
          .catch(res => {
            console.log('登录错误')
          })
      }
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  }
}
</script>

<style scoped>
.tips {
  margin: 20px;
  text-align: right;
}
</style>
