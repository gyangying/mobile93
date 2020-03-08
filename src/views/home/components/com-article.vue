<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell单元格组件
              特点：独占一行
              用法非常灵活、复杂
              title：单元格标题内容
        -->
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title">
          <template slot="label">
            <van-grid
              :column-num="item.cover.type"
              :gutter="10"
              :border="false"
              v-if="item.cover.type>0"
            >
              <van-grid-item v-for="item2 in item.cover.type" :key="item2">
                <van-image width="85" height="85" :src="item.cover.images[item2-1]" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <van-icon name="close" style="float:right" @click="displayDialog()" />
              <span>作者：{{item.aut_name}}</span>
              <span>评论：{{item.comm_count}}</span>
              <span>时间：{{item.pubdate | formatTime}}</span>
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <more-action v-model="showDialog"></more-action>
  </div>
</template>

<script>
// 导入子组件
import MoreAction from './com-moreaction.vue'
import { articleListApi } from '@/api/article.js'
export default {
  name: 'com-article',
  // 注册组件
  components: {
    MoreAction
  },
  // props: ['channelID'],
  props: {
    // 当前选中的频道id信息
    channelID: {
      type: Number, // 类型限制String、Number、Array，类型不符合，参数就接收不到
      required: true // true代表此参数必须传递
    }
  },
  data () {
    return {
      showDialog: false, // 控制子组件弹出框是否显示
      // 文章列表
      articleList: [],
      ts: Date.now(), // 时间戳参数，用于分页获取文章信息
      // 上拉成员
      list: [],
      loading: false,
      finished: false,
      // 下拉成员
      isLoading: false
    }
  },
  created () {
    this.getArticleList()
  },
  methods: {
    // 展示更多操作的弹层
    displayDialog () {
      this.showDialog = true
    },
    // 获取文章列表
    async getArticleList () {
      const res = await articleListApi({
        channel_id: this.channelID,
        timestamp: this.ts
      })
      // console.log(this.channelID)
      console.log(res)
      // this.articleList = res.results
      return res
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.onLoad() // 调用上拉获得数据
        this.isLoading = false // 下拉加载完成/结束加载动画
        this.$toast.success('刷新成功') // 成功提示
      }, 1000)
    },
    // 瀑布流上拉加载执行的方法
    async onLoad () {
      await this.$sleep(800)
      const articles = await this.getArticleList()
      console.log(articles)

      if (articles.results.length > 0) {
        // console.log(articles.results.length)
        // this.articleList = articles.results
        this.articleList.push(...articles.results)
        this.ts = articles.pre_timestamp
      } else {
        // 没有获得到数据，要停止瀑布流
        this.finished = true
      }
      // 停止瀑布加载动画
      this.loading = false

      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     // 瀑布停止
      //     this.finished = true
      //   }
      // }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
// 给上拉列表区域设置样式
.scroll-wrapper {
  height: 100%;
  // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
  // 是瀑布实现的关键要素
  // overflow-y: auto;
}
</style>
