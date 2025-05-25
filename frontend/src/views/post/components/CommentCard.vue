<script setup>
import router from '@/router'
import { formatDate } from '@/utils/formatDate'
import fullScreen from '@/utils/fullScreenImg'
import { lineBreakReplace } from '@/utils/regular'
import { baseURL } from '@/utils/request'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
  item: Object
})
</script>

<template>
  <div class="card">
    <div class="header">
      <img
        @click="fullScreen(props.item?.user_avatar)"
        :src="baseURL + props.item?.user_avatar"
      />
      <div>
        <span
          @click="
            router.push(
              `/follow/${props.item?.user_id}?redirect=${route.fullPath}`
            )
          "
          >{{ props.item?.username }}</span
        >
        <span class="time">{{ formatDate(props.item?.created_time) }}</span>
      </div>
    </div>
    <div class="main">
      <div v-html="lineBreakReplace(props.item?.c_content)"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.card {
  .header {
    display: flex;
    align-items: center;
    gap: calc($main-gap / 2);

    img {
      width: 32px;
      height: 32px;
      aspect-ratio: 1;
      border-radius: 50%;
      cursor: pointer;
    }

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 14px;

      span {
        cursor: pointer;
      }

      .time {
        font-size: 11px;
      }
    }
  }

  .main {
    margin: calc($main-gap / 2) $main-gap 0 42px;
  }
}
</style>
