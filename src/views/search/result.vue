<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in searchList" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { searchListApi } from '@/api/search'
export default {
  name: 'result',
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  data () {
    return {
      page: 1,
      per_page: 10,
      list: [],
      loading: false,
      finished: false,
      searchList: []
    }
  },
  // created () {
  //   this.getSearchList()
  // },
  methods: {
    // 瀑布流加载
    async onLoad () {
      await this.$sleep(1000)
      const res = await searchListApi({ q: this.q, page: this.page, per_page: this.per_page })
      this.loading = false
      if (!res.results.length) {
        this.finished = true
        // 停止代码执行
        return false
      }
      this.searchList.push(...res.results)
      // 分页累加
      this.page++
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   this.loading = false
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1000)
    }
    // 获取搜索结果列表
    // async getSearchList () {
    //   const res = await searchListApi({ q: this.q })
    //   // console.log(res)
    //   this.searchList = res.results
    // }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
