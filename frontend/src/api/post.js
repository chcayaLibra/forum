import request from '@/utils/request'

export const postListService = (user_id, page, limit) =>
  request.get(`/post?user_id=${user_id}&page=${page}&limit=${limit}`)

export const postImagesService = () => request.get('/post/images')

export const postDetailService = (data) => request.post(`/post/detail`, data)

export const postCommentService = (data) => request.post('/post/comments', data)

export const postCommentListService = (p_id) =>
  request.get(`/post/comments/${p_id}`)

export const postUpdateViewService = async (p_id) => {
  await request.patch(`/post/view/${p_id}`)
}

export const postPublishService = (data) => request.post('/publish', data)

export const postCollectAddService = (data) =>
  request.post('/post/collect/add', data)

export const postCollectDelService = (data) =>
  request.delete('/post/collect/del', { data })

export const postSearchService = (data) => request.post('/post/search', data)
