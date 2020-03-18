<template>
  <!-- 小智同学的页面结构 -->
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>

    <div class="chat-list" ref="talkArea">

      <!-- <div class="chat-item left">
        <van-image fit="cover" round :src="XZImg" />
        <div class="chat-pao">干啥呢，河蟹</div>
      </div>
      <div class="chat-item right">
        <div class="chat-pao">没看正忙，挖沙呢</div>
        <van-image fit="cover" round :src="userinfo.photo" />
      </div> -->
      <div class="chat-item"
      :class="item.name === 'xz'?'left':'right'"
      v-for="(item,k) in talks"
      :key="k">
        <van-image fit="cover" round :src="XZImg" v-if="item.name === 'xz'" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" round :src="userinfo.photo" v-if="item.name==='vip'" />
      </div>

    </div>

    <div class="reply-container van-hairline--top">
      <van-field v-model="content" placeholder="说点什么..." @keyup.enter="send()">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { userInfoApi } from '@/api/user.js'
import XZImg from '@/assets/image/xiaozhi.jpg'
export default {
  name: 'chat',
  data () {
    return {
      talks: [],
      socket: null, // 存储socket对象
      userinfo: {},
      XZImg,
      content: '',
      loading: false
    }
  },
  created () {
    this.getUserInfo()
    this.setSocket()
  },
  beforeDestroy () {
    // 不使用组件，离开聊天室，关闭socket
    this.socket.close()
  },
  methods: {
    // 聊天区域的滚动条在最下边显示
    // 滚动条显示在上面，因为卷起的高度小于窗口
    // 滚起的高度等于聊天窗口的总高度，这样滚动条就显示在最底下了
    scrollBottom () {
      // this.$nextTick可以保证data数据变化并完成页面更新后的响应式
      this.$nextTick(() => {
        this.$refs.talkArea.scrollTop = this.$refs.talkArea.scrollHeight
      })
    },
    async send () {
      if (!this.content) { return false }
      this.loading = true
      const args = {
        msg: this.content,
        timestamp: Date.now(),
        name: 'vip'
      }
      this.talks.push(args)
      // 滚动条再最下面
      this.scrollBottom()
      this.content = ''
      await this.$sleep(500)
      this.socket.emit('message', args)
      this.loading = false
    },
    // 建立socket连接
    setSocket () {
      // 客户端向服务端发请求，建立连接
      this.socket = io('http://ttapi.research.itcast.cn', {
        query: {
          token: this.$store.state.user.token
        }
      })
      // 服务端连接成功，向客户端发请求告知
      this.socket.on('connect', () => {
        console.log('连接成功')
        this.talks.push({
          msg: '螃蟹好吃吗？',
          timestamp: Date.now(),
          name: 'xz'
        })
      })
      this.socket.on('message', (back) => {
        // 回来的消息
        // console.log(connect)
        this.talks.push({ ...back, name: 'xz' })
        this.scrollBottom()
      })
    },
    async getUserInfo () {
      this.userinfo = await userInfoApi()
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 140%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
