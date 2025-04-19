<script setup>
import { followAddService, followDelService } from '@/api/follow'
import { ref, watch } from 'vue'
import { useUserStore, usePostStore, useFollowStore } from '@/stores'
import showPrompt from '@/utils/promptBox'
import { useRoute } from 'vue-router'

const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()
const followStore = useFollowStore()

const active = ref(false)

const props = defineProps({
  isFollow: String,
  followId: String
})

watch(
  () => props.isFollow,
  () => getFollowList()
)

const getFollowList = async () => {
  if (props.isFollow === 'true') {
    active.value = true
  } else {
    active.value = false
  }
}
getFollowList()

let flag = true
const onFollow = async () => {
  if (flag && !userStore.userId) {
    flag = false
    showPrompt('未登录，是否跳转到', 'error', {
      time: 5000,
      pushPath: `/login?redirect=${route.fullPath}`,
      pathName: '登录页'
    })
    setTimeout(() => {
      flag = true
    }, 4900)
    return
  }
  if (flag) {
    const path = route.path
    const parts = path.split('/')
    const followId = parts[2]
    if (active.value === false) {
      await followAddService({
        userId: userStore.userId,
        followId: props.followId
      })
      await postStore.getPostList()
      showPrompt('关注成功', 'success')
    } else {
      await followDelService({
        userId: userStore.userId,
        followId: props.followId
      })
      await postStore.getPostList()
      showPrompt('取消关注成功', 'success')
    }
    if (route.path.startsWith('/post/')) {
      await userStore.getUserInfo()
      await postStore.getPostDetail(followId)
      await userStore.getUserCollectPost()
    }
    if (route.path.startsWith('/user')) {
      await userStore.getUserCollectPost()
      await userStore.getUserInfo()
    }
    if (route.path.startsWith('/follow/')) {
      await userStore.getUserCollectPost()
      await followStore.getFollowInfo(followId)
      await followStore.getFollowPostList(followId)
      await followStore.getFollowCollectPost(followId)
    }
    if (route.path === '/post') {
      await userStore.getUserInfo()
      await userStore.getUserCollectPost()
    }
  }
}
</script>

<template>
  <div>
    <button @click="onFollow" :class="{ show: active }">关注</button>
    <button @click="onFollow" :class="{ show: !active }">已关注</button>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
button {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  // width: 80px;
  // height: 30px;
  border-radius: calc($main-gap / 2);
  transition: all 0.3s ease;
  background-color: var(--postcard-btn-color);
  cursor: pointer;

  &:hover {
    background-color: var(--postcard-btn-hover-color);
  }
}

.show {
  display: none;
}
</style>
