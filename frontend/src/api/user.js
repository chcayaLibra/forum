import request from '@/utils/request'

export const userInfoService = (data) => request.post(`/users/info`, data)

export const userPostListService = (data) => request.post(`/users/posts`, data)

export const updateUserInfoService = (data) => request.post('/update', data)

export const userCollectPostService = (data) =>
  request.post(`/user/collect`, data)

export const userPostDelService = (data) =>
  request.delete('/user/post/del', { data })

export const userPostPublicService = (p_id) =>
  request.patch(`/post/public/true/${p_id}`)

export const userPostPrivateService = (p_id) =>
  request.patch(`/post/public/false/${p_id}`)

export const userFollowListService = (user_id) =>
  request.get(`/user/follows?userId=${user_id}`)

export const userFansListService = (user_id) =>
  request.get(`/user/fans?userId=${user_id}`)

export const userCollectPidListService = (data) =>
  request.post('/user/collect/id', data)
