<template>
  <div class="container">
    <!--
      van-tabs:标签页组件
        v-model设置默认激活项目 ，激活根据是项目的下标，从0开始
      van-tab: 标签页项目组件
        title：标签名称
        内容区域：标签对应内容
    -->
    <van-tabs v-model="activeChannelIndex">
      <div slot="nav-right" class="channel-more" @click="showPopup=true">
        <van-icon name="wap-nav" />
      </div>
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <com-article :channelID="item.id"></com-article>
      </van-tab>
      <!-- 应用频道子组件弹出层 -->
      <com-channel
        v-model="showPopup"
        :channelList="channelList"
        :activeChannelIndex.sync="activeChannelIndex"
        ></com-channel>
    </van-tabs>
  </div>
</template>

<script>
import ComChannel from './components/com-channel.vue'
import { channelListApi } from '@/api/channel.js'
import ComArticle from './components/com-article.vue'
export default {
  name: 'home',
  components: {
    ComArticle,
    ComChannel
  },
  data () {
    return {
      // 控制子组件弹出是否显示
      showPopup: false,
      // 用户频道列表
      channelList: [],
      // 设置频道默认激活项目
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    // 获取频道
    async getChannelList () {
      const res = await channelListApi()
      // console.log(res)
      this.channelList = res.channels
      // console.log(this.channelList[1].id)
    },
    onLoad () {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 40) {
          // 瀑布停止
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  // 标签页全部内容展示区域
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  // 标签页具体内容展示区域
  /deep/ .van-tab__pane {
    height: 100%;
    // 给上拉列表区域设置样式
    .scroll-wrapper {
      height: 100%;
      // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
      // 是瀑布实现的关键要素
      overflow-y: auto;
    }
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
.channel-more {
  position: fixed;
  right: 0;
  background-color: white;
  line-height: 88px;
  height: 88px;
  width: 90px;
  text-align: center;
  font-size: 40px;
}
/deep/ .van-tabs_wrap {
  width: 90%;
}
</style>
