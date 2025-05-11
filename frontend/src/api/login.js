import request from '@/utils/request'

export const userLoginService = (data) => request.post('/login', data)

export const userRegisterService = (data) => request.post('/register', data)
