<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>

    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="followMe()"
          :lodaing="followLoading"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <!-- :class="active" 代表激活红色样式
        plain 表示按钮没有背景色，白底，有边框-->
        <van-button
          round
          size="small"
          :class="{active:article.attitude===1}"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button
          round
          size="small"
          :class="{active:article.attitude===0}"
          plain
          icon="delete"
        >不喜欢</van-button>
        <!-- 评论列表 -->
      </div>
      <com-comment></com-comment>
    </div>
  </div>
</template>

<script>
import ComComment from './components/com-comment.vue'
import { userFollowApi, userUnfollowApi } from '@/api/user.js'
import { articleDetailApi } from '@/api/article.js'
export default {
  name: 'article-index',
  data () {
    return {
      followLoading: false, // 关注期间动画效果
      // 模板中不输出用null，模板展示用{}
      article: {} // vue声明空对象不用null与响应式有冲突
    }
  },
  components: {
    ComComment
  },
  created () {
    this.getArticleDetail()
  },
  methods: {
    async followMe () {
      this.followLoading = true
      await this.$sleep(1000)
      if (this.article.is_followed) {
        await userUnfollowApi(this.article.aut_id.toString())
        // 页面更新数据，使得响应式执行
        // 取消关注
        this.article.is_followed = false
      } else {
        // 自己关注自己会失败
        try {
          await userFollowApi(this.article.aut_id.toString())
          this.article.is_followed = true
        } catch (err) {
          if (err.response.status === 400) {
            this.$toast.fail('自己不能关注自己')
          } else {
            this.$toast.fail('关注失败，请联系管理员')
          }
        }
      }
      this.followLoading = false
    },
    async getArticleDetail () {
      const res = await articleDetailApi(this.$route.params.aid)
      this.article = res
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top: 92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
