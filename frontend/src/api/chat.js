import request from '@/utils/request'

export const chatHistoryService = (user_id, follow_id) =>
  request.get(`/chat/history?userId=${user_id}&followId=${follow_id}`)

export const chatUnreadService = (follow_id) =>
  request.get(`/chat/unread/${follow_id}`)

export const chatMarkAsReadService = (data) =>
  request.post('/chat/mark-as-read', data)
