// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import User from '../pages/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name:"login",
      component: Login
    },
    {
      path: '/register',
      name:"register",
      component: Register
    },
    {
      path: '/user',
      name:"user",
      component: User
    }
  ]
})

export default router
