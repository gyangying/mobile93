<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" @search="onSearch(searchText)" />
    <van-cell-group v-if="suggestionList.length>0">
      <van-cell icon="search" v-for="(item, k) in suggestionList" :key="k" @click="onSearch(item)">
        <div slot="title" v-html="highlightCell(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon
          @click="isDeleteData=true"
          v-show="!isDeleteData"
          slot="right-icon"
          name="delete"
          style="line-height:inherit"
        ></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right:10px" @click="suggestDelAll()">全部删除</span>
          <span @click="isDeleteData=false">完成</span>
        </div>
      </van-cell>
      <!-- 联想数据展示 -->
      <van-cell :title="item" v-for="(item,k) in suggestHistories" :key="k">
        <!-- 删除按钮 -->
        <van-icon
          v-show="isDeleteData"
          slot="right-icon"
          name="close"
          style="line-height:inherit"
          @click="suggestDel(k)"
        ></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 创建常量 配置历史关键字key
import { suggestionListApi } from '@/api/search'
const SH = 'suggest-histories'
export default {
  name: 'search',
  data () {
    return {
      suggestHistories: JSON.parse(localStorage.getItem(SH) || '[]'), // 从localStorage获取已经存储好的关键字
      isDeleteData: false, // 历史记录开关
      suggestionList: [], // 联想建议数据
      searchText: '' // 搜索关键字
    }
  },
  watch: {
    searchText: function (newV) {
      clearTimeout(this.timer)
      if (!newV) {
        this.suggestionList = []
        return false
      }
      this.timer = setTimeout(async () => {
        const res = await suggestionListApi({ q: newV })
        console.log(res)
        this.suggestionList = res.options
      }, 1000)
    }
  },
  methods: {
    // 全部删除
    suggestDelAll () {
      // 页面级
      this.suggestHistories = []
      // 持久级
      localStorage.removeItem(SH)
    },
    // 单个删除
    suggestDel (index) {
      // 页面级
      this.suggestHistories.splice(index, 1)
      // 持久级
      localStorage.setItem(SH, JSON.stringify(this.suggestHistories))
    },
    onSearch (keywords) {
      // 统一对传入的数据做收集

      if (!keywords) {
        return false
      }
      // 存keywords，并去重
      const st = new Set(this.suggestHistories)
      st.add(keywords)
      this.suggestHistories = Array.from(st)
      localStorage.setItem(SH, JSON.stringify(this.suggestHistories))

      this.$router.push({ name: 'result', params: { q: keywords } })
    },
    // item--端口提供的联想词数据
    // keywords--输入框输入的被搜索的数据
    highlightCell (item, keywords) {
      const reg = new RegExp(`${keywords}`, 'i')
      const rst = item.match(reg)
      if (!rst) {
        return item
      }
      return item.replace(reg, `<span style="color:red">${rst[0]}</span>`)
    }
  }
}
</script>

<style scoped lang='less'></style>
