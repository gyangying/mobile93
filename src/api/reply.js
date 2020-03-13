import request from '@/utils/request.js'

// 回复评论
export function replyListApi ({ commentID, lastID }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'c',
      source: commentID,
      offset: lastID,
      limit: 10
    }
  })
}
