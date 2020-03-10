<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    close-icon-position="top-left"
    round
    position="bottom"
    :style="{ height: '95%' }"
    @closed="isEdit=false"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini" round @click="isEdit=!isEdit">
            {{isEdit?'完成':'编辑'}}
          </van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item, k) in channelList" :key="item.id" @click="clkChannel(item.id,k)">
          <span class="text" :style="{color:k === activeChannelIndex?'red':''}">{{item.name}}</span>
          <!-- v-show="k>0 && isEdit"当推荐的索引除外，并且为点击编辑转换完成时显示 × -->
          <van-icon
          v-show="k>0 && isEdit"
          class="close-icon"
          name="close"
          @click="userToRest(item,k)" />
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
import { channelAllApi, channelAddApi, channelDelApi } from '@/api/channel.js'
export default {
  name: 'con-channel',
  props: {
    // 接受父组件v-model的数据信息
    value: {
      type: Boolean,
      default: false
    },
    // 父组件传递过来的频道的信息
    channelList: {
      type: Array,
      default: () => []
    },
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isEdit: false,
      channelAll: []
    }
  },
  created () {
    this.getChannelAll()
  },
  computed: {
    restChannel () {
      const userChannelIDs = this.channelList.map(item => {
        return item.id
      })
      const rest = this.channelAll.filter(item => {
        return !userChannelIDs.includes(item.id)
      })
      return rest
    }
  },
  methods: {
    // 当弹出框关闭时，激活弹出框选中的频道
    clkChannel (channelID, index) {
      // 判断有进入编辑状态，就执行删除逻辑，‘推荐’ 项目不执行
      if (this.isEdit && index > 0) {
        this.userToRest(channelID, index)
        return false
      }
      // 频道弹出层消失
      this.$emit('input', false)
      // home/index.vue页面要激活的频道并展示
      this.$emit('update:activeChannelIndex', index)
    },
    // 删除频道
    userToRest (channel, index) {
      this.channelList.splice(index, 1)
      channelDelApi(channel)
      // 判断删除的如果是最后一个项目，删除的下标===项目的总个数，就要设置前置激活
      if (index === this.channelList.length && this.activeChannelIndex === index) {
        this.$emit('update:activeChannelIndex', index - 1)
      }
    },
    // 添加频道
    restToUser (channel) {
      this.channelList.push(channel)
      // localStorage持久添加
      channelAddApi(channel)
    },
    // 获得全部频道
    async getChannelAll () {
      const res = await channelAllApi()
      this.channelAll = res.channels
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
