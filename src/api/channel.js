import request from '@/utils/request.js'
// 导入可以判断用户是否登录系统
import store from '@/store/index.js'
// 设置访客和vip的key值
const CHANNEL_KEY_VIP = 'hm-channel-vip'
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel'
// 获取用户频道
export async function channelListApi () {
  const key = store.state.user.token ? CHANNEL_KEY_VIP : CHANNEL_KEY_TRAVEL
  const cacheChannels = localStorage.getItem(key)
  if (cacheChannels) {
    return { channels: JSON.parse(cacheChannels) }
  } else {
    const rst = await request({
      url: '/app/v1_0/user/channels',
      method: 'get'
    })
    localStorage.setItem(key, JSON.stringify(rst.channels))
    return rst
  }
}
// 获取全部频道
export function channelAllApi () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
// 添加频道
// export function channelAddApi (channel) {
//   return new Promise(function (resolve) {
//     const key = store.state.user.token ? CHANNEL_KEY_VIP : CHANNEL_KEY_TRAVEL
//     const localChannels = localStorage.getItem(key)
//     if (localChannels) {
//       const channels = JSON.parse(localChannels)
//       channels.push(channel)
//       localStorage.setItem(key, JSON.stringify(channels))
//       resolve()
//     }
//   })
// }
export async function channelAddApi (channel) {
  const key = store.state.user.token ? CHANNEL_KEY_VIP : CHANNEL_KEY_TRAVEL
  const cacheChannels = JSON.parse(localStorage.getItem(key))
  cacheChannels.push(channel)
  localStorage.setItem(key, JSON.stringify(cacheChannels))
}
// 删除频道
export function channelDelApi (channel) {
  const key = store.state.user.token ? CHANNEL_KEY_VIP : CHANNEL_KEY_TRAVEL
  const cacheChannels = JSON.parse(localStorage.getItem(key))
  // 对拥有的频道做过滤，把传递进来的channel过滤掉
  const tmpChannels = cacheChannels.filter(item => {
    // 判断当前项目如果不是 channel 就收集
    return channel.id !== item.id
  })
  // 把删除后剩余我的频道数据在存储给localStorage
  localStorage.setItem(key, JSON.stringify(tmpChannels))
  return null
}
