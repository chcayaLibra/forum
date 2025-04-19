<script setup>
import { ref } from 'vue'
import { usePostStore } from '@/stores'

const searchText = ref('')
const postStore = usePostStore()

const getSearchPostList = async () => {
  await postStore.getSearchPostList(searchText.value)
}

const emit = defineEmits(['searchResult'])
let timer = ref(null)
const change = () => {
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(async () => {
    await getSearchPostList()
    emit('searchResult')
  }, 400)
}
</script>

<template>
  <div class="search">
    <input
      @input="change"
      v-model="searchText"
      type="text"
      placeholder="请输入搜索内容..."
    />
  </div>
</template>

<style scoped lang="scss">
$main-gap: 30px;
// $item-w: clamp(320px, 30vw, 500px);
$item-w: clamp(360px, 35vw, 500px);

.search {
  position: sticky;
  top: 20px;
  z-index: 100;
  width: $item-w;
  height: 40px;
  box-shadow: 0 0 4px var(--aside-shadow);
  border-radius: calc($main-gap / 6);
  margin: 0 auto $main-gap * 2;
  overflow: hidden;

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding-left: calc($main-gap / 3);
    background-color: var(--search-bg-color);
    transition: all 0.3s ease;
    color: var(--search-font-color);

    &:hover,
    &:focus {
      background-color: var(--search-chosen-color);
    }

    &::placeholder {
      color: var(--search-placeholder-color);
    }
  }

  @media (max-width: 375px) {
    width: 80vw;
  }
}
</style>
