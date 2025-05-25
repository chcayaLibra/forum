<script setup>
import { followAddService, followDelService } from '@/api/follow'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import showPrompt from '@/utils/promptBox'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()

const active = ref(false)

const props = defineProps({
  isFollow: Boolean,
  followId: String
})

watch(
  () => props.isFollow,
  () => setActive()
)

const setActive = async () => {
  if (props.isFollow) {
    active.value = true
  } else {
    active.value = false
  }
}
setActive()

let flag = true
const onFollow = async () => {
  if (!flag) return
  if (!userStore.userId) {
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
  if (active.value === false) {
    await followAddService({
      userId: userStore.userId,
      followId: props.followId
    })
    showPrompt('关注成功', 'success')
  } else {
    await followDelService({
      userId: userStore.userId,
      followId: props.followId
    })
    showPrompt('取消关注成功', 'success')
  }
  await userStore.getUserFollowList()
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
