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

// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
