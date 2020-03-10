import request from '@/utils/request.js'
// 举报文章
export function articleReportApi ({ articleID, type, remark = '' }) {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target: articleID,
      // 对象成员简易赋值，完整写法：type:type
      type,
      remark // 其他问题 的附加说明
    }
  })
}
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
