import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router/index.js'

// 创建一个axios实例 和原来的axios没有关系
// create()调用完毕会返回一个"新的axios对象"(instance接收)
// "新的axios对象" 与原生的axios没有任何关系
// 给instance做各种配置应用，原生的axios对象不会做任何"污染"
// 这样不影响原生axios对象再其他场合的应用
const instance = axios.create({
  // 请求根地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 超大整型数字转换器
  transformResponse: [function (data) {
    // if (data) {
    //   return JSONBig.parse(data)
    // }
    // return data
    try {
      // 成功：实体字符串
      // 失败：空壳字符串
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 配置请求拦截器
instance.interceptors.request.use(function (config) {
  // 判断token存在再做配置(vuex判断)
  // store.data.data 判断是否有用户信息
  if (store.state.user.token) {
    config.headers.Authorization = 'Bearer' + store.state.user.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 正常响应处理
  // 确认服务器端返回的数据：返回data、返回data.data
  try {
    // data.data如果报错，没有获得到，错误信息会被catch步骤，就走data了
    return response.data.data
  } catch (err) {
    return response.data
  }
}, function (error) {
  if (error.response.status === 401) {
    // token不ok(token在服务器端已经失效了，2个小时时效)
    // 强制用户重新登录系统，以刷新服务器端的token时效
    router.push('/login')
    return new Promise(function () {})
  }
  return Promise.reject(error)
})

export default instance
