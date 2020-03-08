<template>
<div class='container'>
  <!-- @input="$emit('input', $event)"
  组件标签写 $event
  表单标签写 $event.target.value -->
  <van-dialog
    :value="value"
    @input="$emit('input', $event)"
    :show-confirm-button="false"
    close-on-click-overlay
    @closed="show=true"
  >
  <!-- 一级菜单 -->
  <van-cell-group v-if="show">
    <van-cell icon="location-o" title="不感兴趣"></van-cell>
    <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="show=false"></van-cell>
    <van-cell icon="location-o" title="拉黑作者"></van-cell>
  </van-cell-group>
  <!-- 二级菜单 -->
  <van-cell-group v-else>
    <van-cell icon="arrow-left" @click="show=true"></van-cell>
    <van-cell title="其他问题" icon="location-o"></van-cell>
    <van-cell title="标题夸张" icon="location-o"></van-cell>
    <van-cell title="低俗色情" icon="location-o"></van-cell>
    <van-cell title="错别字多" icon="location-o"></van-cell>
    <van-cell title="旧闻重复" icon="location-o"></van-cell>
    <van-cell title="广告软文" icon="location-o"></van-cell>
    <van-cell title="内容不实" icon="location-o"></van-cell>
    <van-cell title="涉嫌非法犯罪" icon="location-o"></van-cell>
    <van-cell title="侵权" icon="location-o"></van-cell>
  </van-cell-group>
  </van-dialog>
</div>
</template>

<script>
export default {
  name: 'com-moreaction',
  data () {
    return {
      show: true // 控制一级或者二级菜单显示
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang='less'></style>
