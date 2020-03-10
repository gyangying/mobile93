<template>
  <div class="container">
    <!-- @input="$emit('input', $event)"
  组件标签写 $event
    表单标签写 $event.target.value-->
    <van-dialog
      :value="value"
      @input="$emit('input', $event)"
      :show-confirm-button="false"
      close-on-click-overlay
      @closed="show=true"
    >
      <!-- 一级菜单 -->
      <van-cell-group v-if="show">
        <van-cell icon="location-o" title="不感兴趣" @click="articleDislike()"></van-cell>
        <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="show=false"></van-cell>
        <van-cell icon="location-o" title="拉黑作者"></van-cell>
      </van-cell-group>
      <!-- 二级菜单 -->
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="show=true" />
        <van-cell
          v-for="item in reportsList"
          :key="item.value"
          :title="item.title"
          icon="location-o"
          @click="articleReport(item.value)"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { articleDislikeApi, articleReportApi } from '@/api/article.js'
export default {
  name: 'com-moreaction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleID: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      show: true, // 控制一级或者二级菜单显示
      // 举报类型：
      reportsList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ]
    }
  },
  methods: {
    // 举报文章
    async articleReport (type) {
      try {
        await articleReportApi({
          articleID: this.articleID,
          type
        })
        // const obj = { articleID: this.articleID, type }
        // await articleReportApi(obj)
      } catch (err) {
        if (err.response.status === 409) {
          return this.$toast.fail('文章已经被举报过了')
        } else {
          return this.$toast.fail('文章举报失败')
        }
      }
      // 成功提示
      this.$toast.success('举报成功！')
      // 弹框消失
      this.$emit('input', false)
    },
    // 不感兴趣的文章
    async articleDislike () {
      const res = await articleDislikeApi(this.articleID)
      console.log(res)
      this.$toast.success('处理成功')
      this.$emit('input', false)
      this.$emit('dislikeSuccess')
    }
  }
}
</script>

<style scoped lang='less'></style>
