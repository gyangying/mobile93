import request from '@/utils/request.js'

// 评论列表
export function commentListApi ({ articleID, offset }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'a',
      source: articleID,
      offset,
      limit: 10
    }
  })
}
