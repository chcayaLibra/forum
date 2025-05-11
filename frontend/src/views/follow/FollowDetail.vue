<script setup>
import { ref, onMounted, onActivated, watchEffect, provide } from 'vue'
import UserCard from '../user/components/UserCard.vue'
import { useFollowStore } from '@/stores'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const followStore = useFollowStore()
const followInfo = ref()
const followPostList = ref()
const followCollectPost = ref()
const flag = ref(false)

const getFollow = async () => {
  await followStore.getFollowInfo(route.params.id)
  await followStore.getFollowPostList(route.params.id)
  await followStore.getFollowCollectPost(route.params.id)
}

onMounted(async () => {
  await getFollow()
})

const updateFollowList = () => {
  followInfo.value = followStore.followInfo
  followPostList.value = followStore.followPostList
  followCollectPost.value = followStore.followCollectPost
}

provide('updateCollectInfo', { updateFollowList })

onActivated(async () => {
  await getFollow()
  updateFollowList()
})

const back = async () => {
  const url = router.currentRoute.value.query.redirect
  const newUrl = url.replace(/\?event.*$/, '')
  router.push(newUrl)
}
</script>

<template>
  <div class="detail">
    <user-card
      v-if="followInfo"
      :userInfo="followInfo"
      :userPostList="followPostList"
      :userCollectPost="followCollectPost"
    >
      <template #btn>编辑个人资料</template>
      <template #pText>没有帖子</template>
      <template #cText>没有收藏</template>
    </user-card>
    <button class="btn" @click="back" title="返回">&lt;</button>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.detail {
  .btn {
    position: fixed;
    right: $main-gap * 2;
    bottom: $main-gap * 2;
    width: 50px;
    height: 50px;
    border-radius: calc($main-gap / 2);
    overflow: hidden;
    border: none;
    outline: none;
    font-size: 20px;
    line-height: 30px;
    transition: all 0.3s ease;
    background-color: var(--postcard-btn-color);
    cursor: pointer;

    &:hover {
      background-color: var(--postcard-btn-hover-color);
    }
  }

  @media (max-width: 520px) {
    .btn {
      position: fixed;
      right: $main-gap * 2;
      bottom: $main-gap * 5;
    }
  }
}
</style>
