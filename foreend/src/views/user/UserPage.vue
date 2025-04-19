<script setup>
import { useUserStore } from '@/stores'
import UserCard from './components/UserCard.vue'
import { ref, onMounted, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const userStore = useUserStore()
const userInfo = ref()
const userPostList = ref()
const userCollectPost = ref()
const flag = ref(false)

watch(
  () => route.query,
  async () => {
    if (route.query.event === 'updateUserInfo') {
      await userStore.getUserInfo()
      userInfo.value = userStore.userInfo
    }
    if (route.query.event === 'updateUserList') {
      router.go(0)
    }
  }
)

onMounted(async () => {
  await userStore.getUserInfo()
  await userStore.getUserPostList()
  await userStore.getUserCollectPost()
  userInfo.value = userStore.userInfo
  userPostList.value = userStore.userPostList
  userCollectPost.value = userStore.userCollectPost
  flag.value = true
})

const onUpdateList = () => {
  userInfo.value = userStore.userInfo
  userPostList.value = userStore.userPostList
  userCollectPost.value = userStore.userCollectPost
}

watchEffect(() => {
  if (flag.value) {
    onUpdateList()
  }
})
</script>

<template>
  <user-card
    @updateList="onUpdateList"
    v-if="userInfo"
    :userInfo
    :userPostList
    :userCollectPost
  >
    <template #btn>编辑个人资料</template>
    <template #pEvent></template>
    <template #cEvent></template>
  </user-card>
</template>

<style scoped lang="scss"></style>
