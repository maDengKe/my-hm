import Vue from 'vue'
import App from './App.vue'
// 导入通用的样式
import './styles/base.less'
// 导入字体图标文件
import './styles/iconfont.less'
// 导入lib-flexible模块，会自动适配所有的屏幕
// 他会给每一个屏幕设置一个html的大小  会把屏幕的大小/10 = 1rem
import 'lib-flexible'
// 导入路由对象
import router from './router'
import axios from 'axios'

// -------------------------全局注册组件-------------------------------
import HmHeader from './components/HmHeader'
import HmLogo from './components/HmLogo'
import HmButton from './components/HmButton.vue'
import HmInput from './components/HmInput.vue'
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)
// 这里可以将axios封装好的方法之间添加到原型对象上，实例继承原型链的时候，直接拥有axious方法
// 调用方式 this.$axios
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

Vue.config.productionTip = false
console.log(Vue.prototype)

const vm = new Vue({
  // console.log();

  router,
  render: h => h(App)
}).$mount('#app')
