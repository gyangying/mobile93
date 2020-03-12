import request from '@/utils/request'
export function suggestionListApi ({ q }) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    params: {
      q
    }
  })
}
// q:联想的关键字
// page:页码
// per_page:每页返回的内容条数
export function searchListApi ({ q, page = 1, per_page = 10 }) {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    params: {
      q,
      page,
      per_page
    }
  })
}
