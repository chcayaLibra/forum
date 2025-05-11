import request from '@/utils/request'

export const followListService = (user_id) => request.post('/friend', user_id)

export const followAddService = (data) => request.post('/follow/add', data)

export const followDelService = (data) =>
  request.delete('/follow/del', { data })

export const followSearchServer = (username) =>
  request.post('/user/search', username)
