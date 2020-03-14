// 导入已经配置好的axios函数对象
// request就是经过各种初始配置的axios对象，可以直接使用
import request from '@/utils/request.js'

// 更新用户资料
export function userSaveProfileApi ({ name, gender, birthday }) {
  return request({
    url: '/app/v1_0/user/profile', // 编辑资料的地址
    method: 'patch',
    data: {
      name,
      gender,
      birthday
    }
  })
}
// 对用户头像进行更新
// patch代表局部更新
export function userPhotoApi (fdObj) {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'patch',
    data: fdObj
  })
}
// 获取用户个人资料
export function userProfileApi () {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'get'
  })
}

// 获取用户自己信息
export function userInfoApi () {
  return request({
    url: '/app/v1_0/user',
    method: 'get'
  })
}

// 关注作者
export function userFollowApi (target) {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: {
      target
    }
  })
}
// 取消关注作者
export function userUnfollowApi (target) {
  return request({
    url: '/app/v1_0/user/followings/' + target,
    method: 'delete'
  })
}
// 用户登录
export function userLoginApi ({ mobile, code }) {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}
