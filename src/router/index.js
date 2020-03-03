import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    // 布局组件 一级路由
    redirect: '/home', // 重定向
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue')
        // 首页组件 二级路由
      },
      {
        path: '/question', // 问答中心 二级路由
        component: () => import('@/views/question/index.vue')
      },
      {
        path: '/video', // 视频组件 二级路由
        component: () => import('@/views/video/index.vue')
      },
      {
        path: '/user', // 个人中心  二级路由
        component: () => import('@/views/user/index.vue')
      }
    ]
  },
  {
    path: '/user/profile',
    component: () => import('@/views/user/profile.vue')
  },
  {
    path: '/user/chat',
    component: () => import('@/views/user/chat.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/user/login.vue')
  },
  {
    path: '/article',
    component: () => import('@/views/article/index.vue')
  },
  {
    path: '/search',
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/search/result',
    component: () => import('@/views/search/result.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
