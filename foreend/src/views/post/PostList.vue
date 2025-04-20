<script setup>
import SearchItem from '@/components/SearchItem.vue'
import PostCard from './components/PostCard.vue'
import { ref, useTemplateRef, nextTick, onActivated, watchEffect } from 'vue'
import { waterFall } from '@/utils/waterFall'
import { usePostStore } from '@/stores'
import router from '@/router'

const postList = ref([])
const postStore = usePostStore()

const ulRef = useTemplateRef('ul')
const lisRef = useTemplateRef('lis')
const MIN_GAP = 20

const getPostList = async () => {
  await postStore.getPostList()
  postList.value = postStore.postList
  // nextTick(() => {
  //   onWaterFail()
  // })
  await nextTick()
  if (lisRef.value?.length) {
    onWaterFail()
  }
}
getPostList()

const onWaterFail = () => {
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

const handleResize = () => {
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

onActivated(() => {
  nextTick(() => {
    onWaterFail()
  })
})

watchEffect(() => {
  postList.value = postStore.postList
})

const onSearch = () => {
  router.push('/post?search')
}

const onSearchResult = () => {
  postList.value = postStore.postList
  onWaterFail()
}

setTimeout(() => {
  onWaterFail()
}, 100)
</script>

<template>
  <search-item @click="onSearch" @search-result="onSearchResult"></search-item>

  <div class="container">
    <ul v-if="postList.length" ref="ul">
      <li ref="lis" v-for="post in postList" :key="post.p_id">
        <post-card :post></post-card>
      </li>
    </ul>
    <ul style="font-size: 30px" v-else>
      <span>没有结果🖕</span>
    </ul>
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
}
</style>
