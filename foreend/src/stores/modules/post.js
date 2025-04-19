import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import {
  postDetailService,
  postListService,
  postSearchService
} from '@/api/post'

export const usePostStore = defineStore('post', () => {
  const userStore = useUserStore()
  const postList = ref([])
  const postDetail = ref()

  const getPostList = async () => {
    const res = await postListService(userStore.userId)
    postList.value = res.data.data
  }

  const getSearchPostList = async (content) => {
    const res = await postSearchService({
      userId: userStore.userId,
      searchContent: content
    })
    postList.value = res.data.data
  }

  const getPostDetail = async (p_id) => {
    const res = await postDetailService({
      p_id,
      user_id: userStore.userId
    })
    postDetail.value = res.data.data[0]
  }

  return {
    postList,
    postDetail,
    getPostList,
    getSearchPostList,
    getPostDetail
  }
})
