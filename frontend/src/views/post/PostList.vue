<script setup>
import SearchItem from '@/components/SearchItem.vue'
import PostCard from './components/PostCard.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import { ref, useTemplateRef, nextTick, onActivated, watch } from 'vue'
import { waterFall } from '@/utils/waterFall'
import { usePostStore, useSwitchStore, useUserStore } from '@/stores'
import router from '@/router'

const postList = ref([])

const postStore = usePostStore()
const userStore = useUserStore()
const switchStore = useSwitchStore()

const ulRef = useTemplateRef('ul')
const lisRef = useTemplateRef('lis')
const MIN_GAP = 20

const getPostList = async () => {
  await postStore.getPostList()
  postList.value = postStore.postList

  await nextTick()
  onWaterFail()
}
getPostList()

watch(
  () => postStore.postListPage,
  async () => {
    await nextTick()
    onWaterFail()
  }
)

function onWaterFail() {
  if (!lisRef.value?.length || !ulRef.value) {
    return
  }
  waterFall({
    minGap: MIN_GAP,
    cards: lisRef.value,
    cardWidth: lisRef.value[0].clientWidth + MIN_GAP,
    container: ulRef.value
  })
}

function handleResize() {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      onWaterFail()
    }, 100)
  }
}

const callFn = handleResize()
window.addEventListener('resize', callFn)

onActivated(async () => {
  await nextTick()
  onWaterFail()
})

const onSearch = () => {
  router.push('/post?search')
}

const onSearchResult = async () => {
  postList.value = postStore.postList
  await nextTick()
  onWaterFail()
}

userStore.getUserFollowList()
userStore.getUserCollectPidList(userStore.userId)
</script>

<template>
  <search-item @click="onSearch" @search-result="onSearchResult"></search-item>

  <div class="container">
    <ul v-if="postList.length" ref="ul">
      <li ref="lis" v-for="post in postList" :key="post.p_id">
        <post-card
          :post
          :userCollectPidList="userStore.userCollectPidList"
        ></post-card>
      </li>
    </ul>
    <ul style="font-size: 30px" v-else>
      <span>没有结果🖕</span>
    </ul>
    <LoadingBox v-if="switchStore.loading"></LoadingBox>
    <div class="tip" v-if="!switchStore.hasMore">没有更多了🖕</div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
// $item-w: clamp(320px, 30vw, 500px);
// $item-w: clamp(362px, 35vw, 500px);

.container {
  ul {
    display: grid;
    justify-content: center;
    gap: $main-gap;

    li {
      width: 360px;
      animation: appear 0.5s ease forwards;

      @media (max-width: 376px) {
        width: 80vw;
      }
    }

    span {
      animation: appear 0.5s ease forwards;
    }

    @keyframes appear {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }

  .tip {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
