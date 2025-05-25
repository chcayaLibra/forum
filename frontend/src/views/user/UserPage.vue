<script setup>
import { usePostStore, useUserStore } from '@/stores'
import UserCard from './components/UserCard.vue'
import { ref, onMounted, watch, useTemplateRef, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()
const userInfo = ref({})
const userPostList = ref([])
const userCollectPostList = ref([])
const userCardRef = useTemplateRef('userCard')

watch(
  () => route.query,
  async () => {
    if (route.query.event === 'updateUserInfo') {
      await userStore.getUserInfo()
      userInfo.value = userStore.userInfo
    }
    if (route.query.event === 'updateUserList') {
      router.go(0)
      // TODO
    }
  }
)

const id = userStore.userId

onMounted(async () => {
  await userStore.getUserInfo()
  await postStore.getUserPostList(id)
  await postStore.getUserCollectPostList(id)
  userInfo.value = userStore.userInfo
  userPostList.value = postStore.userPostListStateMap[id]?.posts
  userCollectPostList.value = postStore.userCollectPostListStateMap[id]?.posts
  await nextTick()
  userCardRef.value.onWaterFail()
})

watch(
  () => postStore.userCollectPostListStateMap[id]?.posts,
  () => {
    userCollectPostList.value = postStore.userCollectPostListStateMap[id]?.posts
  },
  {
    deep: true
  }
)
</script>

<template>
  <user-card
    ref="userCard"
    v-if="userInfo"
    :userInfo
    :userPostList
    :userCollectPostList
  >
    <template #btn>编辑个人资料</template>
    <template #pEvent></template>
    <template #cEvent></template>
  </user-card>
</template>

<style scoped lang="scss"></style>
