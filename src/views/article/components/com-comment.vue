<template>
  <div class="comment">
    <!--van-list：实现瀑布加载效果-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in commentList" :key="item.com_id.toString()">
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 作者名称 -->
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <!-- 点赞 -->
        <div slot="default">
          <van-button
            icon="like-o"
            size="mini"
            plain
            :type="item.is_liking?'danger':'default'"
          >&nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间 -->
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <span
              @click="openReply(item.com_id.toString())"
            >{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>

    <!-- 回复列表展示-弹出层/瀑布 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <van-cell v-for="item in replyList" :key="item.com_id.toString()">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" src="item.aut_photo" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>{{item.aut_name}}</span>
          </div>
          <!-- 回复内容和时间 -->
          <div slot="label">
            <p>{{item.content}}</p>
            <p>
              <span>{{item.pubdate | formatTime}}</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
    <!-- 添加评论或者回复 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="contentCorR" placeholder="写评论或回复...">
        <!-- van-loading设置加载图标，与提交进行配置使用slot="button"命名插槽，表明要给van-field的指定位置填充内容(右侧)
        -->
        <van-loading v-if="submitting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { replyListApi } from '@/api/reply.js'
import { commentListApi } from '@/api/comment.js'
export default {
  name: 'com-comment',
  data () {
    return {
      contentCorR: '', // 评论或者回复的内容
      submitting: false, // 添加动作是否运行
      commentID: '',
      // 回复列表数据
      replyList: [],
      lastID: null,
      showReply: false,
      // 回复相关
      reply: {
        list: [],
        loading: false,
        finished: false
      },
      commentList: [], // 评论列表
      offset: null, // 评论分页列表
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    // 开启回复弹出层
    openReply (comID) {
      this.commentID = comID
      this.showReply = true
      // 回复弹出层和瀑布初始化
      this.reply.finished = false
      this.lastID = null
      this.replyList = []
    },
    // 回复瀑布
    async onLoadReply () {
      await this.$sleep(800)
      const res = await replyListApi({
        commentID: this.commentID,
        lastID: this.lastID
      })
      this.reply.loading = false
      if (!res.results.length) {
        this.reply.finished = true
        return false
      }
      this.replyList.push(...res.results)
      this.lastID = res.last_id
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.reply.list.push(this.reply.list.length + 1)
      //   }

      //   // 加载状态结束
      //   this.reply.loading = false

      //   // 数据全部加载完成
      //   if (this.reply.list.length >= 40) {
      //     this.reply.finished = true
      //   }
      // }, 1000)
    },
    async onLoad () {
      await this.$sleep(800)
      // 获取评论列表
      const res = await commentListApi({
        articleID: this.$route.params.aid,
        offset: this.offset
      })
      // console.log(res)
      // 加载动画消失
      this.loading = false
      // 数据加载完成
      if (!res.results.length) {
        this.finished = true
        return false
      }
      // 把数据追加给data
      this.commentList.push(...res.results)
      // 接收commentID
      this.offset = res.last_id
      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 5; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 10) {
      //     this.finished = true
      //   }
      // }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  margin-top: 15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title {
    .van-cell__label {
      width: 400px;
    }
  }
}
// 添加评论或回复构件
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 24px;
    color: #3296fa;
  }
}
</style>
