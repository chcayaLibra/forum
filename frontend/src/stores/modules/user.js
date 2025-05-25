import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userCollectPidListService, userFollowListService } from '@/api/user'
import { userInfoService } from '@/api/user'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userId = ref('')
    const userInfo = ref({})

    const userFollowList = ref([])
    const userCollectPidList = ref([])

    const setUserId = (value) => {
      userId.value = value
    }

    const getUserInfo = async () => {
      const res = await userInfoService({
        followId: userId.value
      })
      if (!res) return
      userInfo.value = res.data.data[0]
    }

    const getUserFollowList = async () => {
      const res = await userFollowListService(userId.value)
      if (!res) return
      const arr = res.data.data
      const result = arr.map((item) => item.follow_id)
      userFollowList.value = result
    }

    const getUserCollectPidList = async () => {
      const res = await userCollectPidListService({
        userId: userId.value,
        currentUserId: userId.value
      })
      if (!res) return
      userCollectPidList.value = res.data.data.map((item) => item.p_id)
    }

    return {
      token,
      userId,
      userInfo,
      userFollowList,
      userCollectPidList,
      setUserId,
      getUserInfo,
      getUserFollowList,
      getUserCollectPidList
    }
  },
  {
    persist: true
  }
)
