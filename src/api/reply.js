import request from '@/utils/request.js'
// 添加评论或者回复
export function addCorRApi ({ target, content, artID = null }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'post',
    data: {
      target,
      content,
      art_id: artID
    }
  })
}

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
