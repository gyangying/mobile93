import request from '@/utils/request.js'
// 对文章不喜欢
export function articleDislikeApi (articleID) {
  return request({
    url: 'app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: articleID
    }
  })
}

// 获取文章频道
export function articleListApi ({ channel_id, timestamp }) {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id,
      timestamp,
      with_top: 1
    }
  })
}
