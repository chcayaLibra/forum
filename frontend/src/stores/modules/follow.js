import { userInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFollowStore = defineStore(
  'follow',
  () => {
    const followInfo = ref({})

    const getFollowInfo = async (follow_id) => {
      const res = await userInfoService({
        followId: follow_id
      })
      if (!res) return
      followInfo.value = res.data.data[0]
    }

    return {
      followInfo,
      getFollowInfo
    }
  },
  {
    persist: true
  }
)
