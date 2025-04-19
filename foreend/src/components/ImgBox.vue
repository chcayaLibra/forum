<script setup>
import fullScreen from '@/utils/fullScreenImg'
import { baseURL } from '@/utils/request'
import { ref, onMounted } from 'vue'

const active = ref('')
const props = defineProps({
  images: Array
})

onMounted(() => {
  active.value = `size${props.images.length}`
})
</script>

<template>
  <div class="box" :class="active">
    <img
      v-loading
      @click="fullScreen(item)"
      v-for="item in props.images"
      :key="item"
      :src="baseURL + item"
    />
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.box {
  width: 100%;
  height: 100%;

  img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    max-width: 320px;
    max-height: 320px;
    aspect-ratio: 1;
    object-fit: cover;
    cursor: pointer;
  }
}

@for $i from 1 through 9 {
  .size#{$i} {
    display: grid;
    gap: calc($main-gap / 2);
  }
}

.size1 {
  grid-template-columns: 1fr;
}

.size2,
.size4 {
  grid-template-columns: repeat(2, 1fr);
}

.size5 {
  grid-template-areas:
    'a b c'
    'a d e';
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);

  img:nth-child(1) {
    grid-area: a;
  }
}

.size7 {
  grid-template-areas:
    'a b c'
    'a d e'
    'f g g';
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);

  img:nth-child(1) {
    grid-area: a;
  }

  img:nth-child(7) {
    grid-area: g;
  }
}

.size8 {
  grid-template-columns: repeat(4, 1fr);
}

.size3,
.size6,
.size9 {
  grid-template-columns: repeat(3, 1fr);
}
</style>
