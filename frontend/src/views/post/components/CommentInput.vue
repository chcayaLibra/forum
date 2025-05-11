<script setup>
import { postCommentService } from '@/api/post'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import showPrompt from '@/utils/promptBox'
import { useRoute } from 'vue-router'
import { escapeHTML } from '@/utils/safeContent'

const textarea = ref()
const userStore = useUserStore()
const route = useRoute()

const props = defineProps({
  id: String
})

const comment = ref({
  user_id: userStore.userId,
  p_id: props.id,
  c_content: computed(() => escapeHTML(textarea.value))
})

const emit = defineEmits(['updateCommentList'])

let flag = ref(true)
const sendComment = async (e) => {
  if (!textarea.value) {
    return
  }
  if (flag.value && !userStore.userId) {
    flag.value = false
    showPrompt('未登录，是否跳转到', 'error', {
      time: 5000,
      pushPath: `/login?redirect=${route.fullPath}`,
      pathName: '登录页'
    })
    setTimeout(() => {
      flag.value = true
    }, 5100)
    return
  }
  if (e.key === 'Enter' && e.shiftKey) return
  if (flag.value) {
    await postCommentService(comment.value)
    textarea.value = ''
    emit('updateCommentList')
  }
}
</script>

<template>
  <form class="ipt" @submit.prevent>
    <textarea
      v-disableEnter
      v-model.trim="textarea"
      @keydown.enter="sendComment"
      placeholder="Please input your comment..."
    ></textarea>
    <button @click="sendComment" title="发送">
      <svg
        t="1742698506380"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4729"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="32"
        height="32"
      >
        <path
          d="M642.688 867.872l348.544-689.376-76.432-59.44L22.464 300.912l200.928 182.064 72.192-42.544-102.32-92.704L784 227.376 272 528.8v404.528l184.048-145.92-60.528-54.08L352 767.856v-159.2l290.688 259.216z m206.688-586.208l-231.2 457.248-216.96-193.44 448.16-263.808z"
          p-id="4730"
        ></path>
      </svg>
    </button>
  </form>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.ipt {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: calc($main-gap / 2);
  overflow: hidden;

  button {
    height: 60px;
    border: none;
    outline: none;
    padding: 0 calc($main-gap / 1.3);
    background-color: var(--search-bg-color);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--search-chosen-color);
    }

    svg {
      fill: var(--search-placeholder-color);
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        filter: drop-shadow(0 0 1px var(--search-placeholder-color));
      }
    }
  }

  textarea {
    width: 100%;
    height: 60px;
    resize: none;
    padding: calc($main-gap / 2);
    // border-radius: calc($main-gap / 2);
    border: none;
    outline: none;
    color: var(--search-font-color);
    background-color: var(--search-bg-color);
    transition: all 0.3s ease;
    font-family: 'Gill Sans';

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    &::placeholder {
      color: var(--search-placeholder-color);
    }

    &:hover,
    &:focus {
      background-color: var(--search-chosen-color);
    }
  }
}
</style>
