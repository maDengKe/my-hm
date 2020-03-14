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
    ></hm-input>

    <hm-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :rule="/^\d{3,12}$/"
      message="用户密码格式错误"
    ></hm-input>

    <hm-button @click="login">登录</hm-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 给DOM注册的事件，可以通过DOM的方式触发  给DOM元素注册点击事件，就可以点击触发
    // 如果给组件去注册事件，通过DOM是无法触发。而是通过 this.$emit触发
    login() {
      console.log('我要登录了')
      this.$axios({
        method: 'post',
        url: '/login',
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        console.log(res)

        if ((res.data.statusCode = 200)) {
          this.$router.push('/user')
        } else {
          alert('傻逼，密码输错啦')
        }
      })
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

<style scoped></style>
