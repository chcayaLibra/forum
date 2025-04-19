import {
  userCollectPostService,
  userInfoService,
  userPostListService
} from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useFollowStore = defineStore(
  'follow',
  () => {
    const userStore = useUserStore()
    const followPostList = ref()
    const followInfo = ref()
    const followCollectPost = ref()

    const getFollowInfo = async (follow_id) => {
      const res = await userInfoService({
        userId: userStore.userId,
        followId: follow_id
      })
      followInfo.value = res.data.data[0]
    }

    const getFollowPostList = async (follow_id) => {
      const res = await userPostListService({
        userId: userStore.userId,
        followId: follow_id
      })
      followPostList.value = res.data.data
    }

    const getFollowCollectPost = async (follow_id) => {
      const res = await userCollectPostService({
        userId: userStore.userId,
        followId: follow_id
      })
      followCollectPost.value = res.data.data
    }

    return {
      followInfo,
      followPostList,
      followCollectPost,
      getFollowInfo,
      getFollowPostList,
      getFollowCollectPost
    }
  },
  {
    persist: true
  }
)
