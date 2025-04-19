import request from '@/utils/request'

export const postListService = (user_id) =>
  request.get(`/post?user_id=${user_id}`)

export const postImagesService = () => request.get('/post/images')

export const postDetailService = (data) => request.post(`/post/detail`, data)

export const postCommentService = (data) => request.post('/post/comments', data)

export const postCommentListService = (p_id) =>
  request.get(`/post/comments/${p_id}`)

export const postUpdateViewService = (p_id) => {
  request.patch(`/post/view/${p_id}`)
}

export const postPublishService = (data) => request.post('/publish', data)

export const postCollectAddService = (data) =>
  request.post('/post/collect/add', data)

export const postCollectDelService = (data) =>
  request.delete('/post/collect/del', { data })

export const postSearchService = (data) => request.post('/post/search', data)
