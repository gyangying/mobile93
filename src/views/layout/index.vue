<template>
  <div class="container">
    <van-nav-bar
      fixed
      title="黑马头条"
      right-text="搜索"
      @click-right="$router.push('/search')"
      v-if="$route.path!=='/user'"
    />
    <!-- <div class="my-wrapper" :style="{'padding-top':$route.path==='/user'?0:'46px'}"> -->
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
      <!-- 路由占位符，用于显示home、question、video、user组件 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 公共脚步
      van-tabbar:标签栏组件
      van-tabbar: route  激活路由功能
      van-tabbar-item
        to: 请求路由地址
        icon：标签栏项目显示的图标，icon图标库在组件库中可以看到
    -->
    <van-tabbar route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item
        :to="$store.state.user.token?'/user':'/login'"
        icon="user-o"
      >{{$store.state.user.token?'我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout'
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 92px;
    padding-bottom: 100px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
