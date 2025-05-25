<script setup>
import { usePostStore, useSwitchStore, useUserStore } from '@/stores'
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const prop = defineProps({
  keyPath: String
})
const container = ref(null)
const postStore = usePostStore()
const userStore = useUserStore()
const switchStore = useSwitchStore()

const route = useRoute()

const restoreScrollPosition = () => {
  if (prop.keyPath === '/publish' || prop.keyPath.startsWith('/post/')) {
    sessionStorage.setItem(prop.keyPath, 0)
  }

  nextTick(() => {
    const savePosition = sessionStorage.getItem(prop.keyPath)
    if (savePosition) {
      container.value.scrollTop = parseInt(savePosition)
    }
  })
}

watch(route, () => {
  restoreScrollPosition()
})

const saveScrollPosition = () => {
  if (
    prop.keyPath === '/post' ||
    prop.keyPath === '/user' ||
    prop.keyPath.startsWith('/follow/u') ||
    !prop.keyPath.startsWith('/chat')
  ) {
    sessionStorage.setItem(prop.keyPath, container.value.scrollTop)
  }
  onScroll()
}
nextTick(() => {
  sessionStorage.setItem('/user', 0)
  sessionStorage.setItem('/post', 0)
})

// async function onScroll() {
//   if (route.fullPath === '/post') {
//     if (postStore.postListTotal === postStore.postList.length) {
//       switchStore.setHasMore(false)
//       return
//     }
//     const el = container.value
//     const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
//     if (nearBottom) {
//       switchStore.setLoading(true)
//       await postStore.getPostList()
//       switchStore.setLoading(false)
//     }
//   } else if (route.fullPath.startsWith('/user') && switchStore.userPageToggle) {
//     if (postStore.userPostListTotal === postStore.userPostList.length) {
//       return
//     }
//     const el = container.value
//     const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
//     if (nearBottom) {
//       switchStore.setLoading(true)
//       await postStore.getUserPostList()
//       switchStore.setLoading(false)
//     }
//   } else if (
//     route.fullPath.startsWith('/user') &&
//     !switchStore.userPageToggle
//   ) {
//     if (
//       postStore.userCollectPostListTotal ===
//       postStore.userCollectPostList.length
//     ) {
//       return
//     }
//     const el = container.value
//     const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
//     if (nearBottom) {
//       switchStore.setLoading(true)
//       await postStore.getUserCollectPostList()
//       switchStore.setLoading(false)
//     }
//   } else if (
//     route.fullPath.startsWith('/follow') &&
//     switchStore.userPageToggle
//   ) {
//     const currentFollowInfo = postStore.followPostListStateMap[route.params.id]
//     if (currentFollowInfo.total === currentFollowInfo.posts.length) {
//       return
//     }
//     const el = container.value
//     const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
//     if (nearBottom) {
//       switchStore.setLoading(true)
//       await postStore.getFollowPostList(route.params.id)
//       switchStore.setLoading(false)
//     }
//   } else if (
//     route.fullPath.startsWith('/follow') &&
//     !switchStore.userPageToggle
//   ) {
//     const currentFollowInfo = postStore.followPostListStateMap[route.params.id]
//     if (currentFollowInfo.total === currentFollowInfo.posts.length) {
//       return
//     }
//     const el = container.value
//     const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
//     if (nearBottom) {
//       switchStore.setLoading(true)
//       await postStore.getFollowCollectPostList(route.params.id)
//       switchStore.setLoading(false)
//     }
//   }
// }

async function onScroll() {
  const el = container.value
  if (!el) return

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (!nearBottom) return

  const { fullPath } = route
  const isUserOrFollow =
    fullPath.startsWith('/user') || fullPath.startsWith('/follow')
  const isPost = fullPath === '/post'

  const tryLoad = async ({ total, current, loadFn }) => {
    if (total === current) return
    switchStore.setLoading(true)
    await loadFn()
    switchStore.setLoading(false)
  }

  if (isPost) {
    await tryLoad({
      total: postStore.postListTotal,
      current: postStore.postList.length,
      loadFn: postStore.getPostList
    })
  } else if (isUserOrFollow) {
    const id = fullPath.startsWith('/user') ? userStore.userId : route.params.id
    const map = switchStore.userPageToggle
      ? postStore.userPostListStateMap
      : postStore.userCollectPostListStateMap
    const state = map[id]
    if (!state) return

    await tryLoad({
      total: state.total,
      current: state.posts.length,
      loadFn: () =>
        switchStore.userPageToggle
          ? postStore.getUserPostList(id)
          : postStore.getUserCollectPostList(id)
    })
  }
}
</script>

<template>
  <div ref="container" @scrollend="saveScrollPosition">
    <slot></slot>
  </div>
</template>

<style></style>
