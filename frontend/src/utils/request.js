import axios from 'axios'
import { useUserStore } from '@/stores'
import showPrompt from './promptBox'
import router from '@/router'
const baseURL = 'http://localhost:2053'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0 || res.data.code === 200) {
      return Promise.resolve(res)
    }
    return Promise.reject(res.data)
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      console.log(err.response.data)
      showPrompt(err.response.data, 'error')
    }
    if (err.response && err.response.status === 400) {
      console.log(err.response.data)
      showPrompt(err.response.data.message, 'error')
    }
    if(err.response && err.response.status === 404) {
      console.log('not found')
      router.push('/notfound')
    }
  }
)

export default instance
export { baseURL }
