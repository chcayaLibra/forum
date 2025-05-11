import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userCollectPostService, userPostListService } from '@/api/user'
import { userInfoService } from '@/api/user'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref()
    const userId = ref()
    const userPostList = ref()
    const userInfo = ref()
    const userCollectPost = ref()

    const setUserId = (value) => {
      userId.value = value
    }

    const getUserPostList = async () => {
      const res = await userPostListService({
        userId: userId.value,
        followId: userId.value
      })
      userPostList.value = res.data.data
    }

    const getUserInfo = async () => {
      const res = await userInfoService({
        userId: userId.value,
        followId: userId.value
      })
      userInfo.value = res.data.data[0]
    }

    const getUserCollectPost = async () => {
      const res = await userCollectPostService({
        userId: userId.value,
        followId: userId.value
      })
      userCollectPost.value = res.data.data
    }

    return {
      token,
      userId,
      userInfo,
      userPostList,
      userCollectPost,
      setUserId,
      getUserPostList,
      getUserInfo,
      getUserCollectPost
    }
  },
  {
    persist: true
  }
)
