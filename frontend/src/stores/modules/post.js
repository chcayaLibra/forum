import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useUserStore } from './user'
import {
  postDetailService,
  postListService,
  postSearchService
} from '@/api/post'
import { userCollectPostService, userPostListService } from '@/api/user'

export const usePostStore = defineStore('post', () => {
  const userStore = useUserStore()
  const postDetail = ref()
  const postListPage = ref(1)
  const postListTotal = ref(0)
  const postList = reactive([])
  const userPostListStateMap = reactive({})
  const userCollectPostListStateMap = reactive({})
  const limit = 5
  const hasMore = ref(true)

  const getPostList = async () => {
    const res = await postListService(
      userStore.userId,
      postListPage.value,
      limit
    )
    if (!res) return
    const data = res.data.data
    postListTotal.value = res.data.total
    if (data.length < limit) {
      hasMore.value = false
    }
    postListPage.value++
    postList.push(...data)
  }

  const getUserPostList = async (user_id) => {
    if (!userPostListStateMap[user_id]) {
      userPostListStateMap[user_id] = {
        page: 1,
        total: 0,
        hasMore: true,
        posts: []
      }
    }
    const state = userPostListStateMap[user_id]
    if (!state.hasMore) return

    const res = await userPostListService({
      userId: userStore.userId,
      followId: user_id,
      page: state.page,
      limit
    })
    if (!res) return
    const data = res.data.data
    state.total = res.data.total

    if (data.length < limit) {
      state.hasMore = false
    }
    state.page++
    state.posts.push(...data)
  }

  const getUserCollectPostList = async (follow_id) => {
    if (!userCollectPostListStateMap[follow_id]) {
      userCollectPostListStateMap[follow_id] = {
        page: 1,
        total: 0,
        hasMore: true,
        posts: []
      }
    }
    const state = userCollectPostListStateMap[follow_id]
    if (!state.hasMore) return

    const res = await userCollectPostService({
      userId: userStore.userId,
      followId: follow_id,
      page: state.page,
      limit
    })
    if (!res) return
    const data = res.data.data
    state.total = res.data.total

    if (data.length < limit) {
      state.hasMore = false
    }
    state.page++
    state.posts.push(...data)
  }

  const getSearchPostList = async (content) => {
    const res = await postSearchService({
      userId: userStore.userId,
      searchContent: content
    })
    if (!res) return
    postList.splice(0, postList.length, ...res.data.data)
  }

  const getPostDetail = async (p_id) => {
    const res = await postDetailService({
      p_id,
      user_id: userStore.userId
    })
    if (!res) return
    postDetail.value = res.data.data[0]
  }

  const updateCollectCount = (p_id, num) => {
    const lists = [
      postList,
      userPostListStateMap[userStore.userId]?.posts,
      userCollectPostListStateMap[userStore.userId]?.posts
    ]

    for (const list of lists) {
      if (!Array.isArray(list)) continue
      const index = list.findIndex((item) => item.p_id === p_id)
      if (index !== -1) {
        list[index].p_collect_count = +list[index].p_collect_count + num
      }
    }

    if (postDetail.value && postDetail.value.p_id === p_id) {
      postDetail.value.p_collect_count = +postDetail.value.p_collect_count + num
    }
  }

  const addPostViewCount = (p_id) => {
    const lists = [
      postList,
      ...Object.values(userPostListStateMap).map((x) => x.posts),
      ...Object.values(userCollectPostListStateMap).map((x) => x.posts)
    ]

    for (const list of lists) {
      if (!Array.isArray(list)) continue

      for (const post of list) {
        if (post.p_id === p_id) {
          post.p_view_count = +post.p_view_count + 1
        }
      }
    }
  }

  const updatePublicState = (p_id, state) => {
    const lists = [
      userPostListStateMap[userStore.userId]?.posts,
      userCollectPostListStateMap[userStore.userId]?.posts
    ]

    for (const list of lists) {
      if (!Array.isArray(list)) continue
      const index = list.findIndex((item) => item.p_id === p_id)
      if (index !== -1) {
        list[index].is_public = state
      }
    }
  }

  const delPost = (p_id) => {
    const lists = [
      postList,
      userPostListStateMap[userStore.userId]?.posts,
      userCollectPostListStateMap[userStore.userId]?.posts
    ]

    for (const list of lists) {
      if (!Array.isArray(list)) continue
      const index = list.findIndex((item) => item.p_id === p_id)
      if (index !== -1) {
        list.splice(index, 1)
      }
    }
  }

  const addCollectCount = (p_id) => {
    updateCollectCount(p_id, 1)
  }

  const subCollectCount = (p_id) => {
    updateCollectCount(p_id, -1)
  }

  return {
    postDetail,
    postList,
    postListPage,
    postListTotal,
    userPostListStateMap,
    userCollectPostListStateMap,
    getPostList,
    getSearchPostList,
    getPostDetail,
    addCollectCount,
    subCollectCount,
    getUserPostList,
    getUserCollectPostList,
    delPost,
    updatePublicState,
    addPostViewCount
  }
})
