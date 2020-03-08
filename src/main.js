import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant
// 导入懒加载模块
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 引入设置rem基准值
import 'amfe-flexible/index.min.js'
// 导入全局样式控制文件
import '@/assets/css/global.less'
// 导入vee-validate规则文件
import '@/utils/validate.js'
// 导入过滤器
import * as filters from '@/utils/filters'

// 注册vant
Vue.use(Vant)

// 注册懒加载
Vue.use(Lazyload)

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 设置全局延迟器
Vue.prototype.$sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
