import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// localStorage 存储用户信息的key名称，统一设置，方便后续使用
const USER_KEY = 'hm-toutiao-m-user'
export default new Vuex.Store({
  state: {
    // 设置用户存储信息，如果有 存， 没有返回{}
    user: JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },
  mutations: {
    // 修改用户数据，重新渲染页面
    updateUser: function (state, data) {
      // 重新渲染vuex
      state.user = data
      // 修改本地存储的信息
      localStorage.steItem(USER_KEY, JSON.stringify(data))
    },
    clearUser: function (state, data) {
      state.user = {}
      localStorage.removeItem(USER_KEY)
    }
  },
  actions: {
  },
  modules: {
  }
})
