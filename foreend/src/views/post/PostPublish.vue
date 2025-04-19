<script setup>
import showPrompt from '@/utils/promptBox'
import { uploadImgs } from '@/utils/uploadImgs'
import { ref, useTemplateRef } from 'vue'
import { useUserStore } from '@/stores'
import { postPublishService } from '@/api/post'
import ToggleButton from '@/components/ToggleButton.vue'
import router from '@/router'
import { escapeHTML } from '@/utils/safeContent'

const context = ref('')
const imageCountRef = useTemplateRef('imageCount')
const userStore = useUserStore()
const flag = ref(true)
const isPublic = ref(true)

const toggleEvent = (value) => {
  isPublic.value = value
}

const publish = async () => {
  if (!flag.value) return
  flag.value = false
  if (!context.value) {
    showPrompt('请输入内容', 'error')
    flag.value = true
    return
  }

  const formData = new FormData()
  formData.append('content', escapeHTML(context.value))
  formData.append('userId', userStore.userId)
  formData.append('isPublic', isPublic.value)

  const list = imageCountRef.value.querySelectorAll('input')
  if (list) {
    for (let i = 0; i < list.length - 1; i++) {
      formData.append('p_images', list[i].files[0])
    }
  }

  const res = await postPublishService(formData)

  if (res.data.code === 0) {
    showPrompt(res.data.message, 'success')
    setTimeout(async () => {
      router.push({
        path: '/user',
        query: {
          event: 'updateUserList'
        }
      })
      await userStore.getUserPostList()
      flag.value = true
    }, 1000)
  } else {
    flag.value = true
    showPrompt('发布失败', 'error')
  }
}
</script>

<template>
  <form class="publish" @submit.prevent>
    <div class="left">
      <h2>新帖子</h2>
      <div class="content">
        <h3>内容：</h3>
        <textarea v-model.trim="context" placeholder="请输入内容..."></textarea>
      </div>
    </div>
    <div class="right">
      <div class="img">
        <h3>图片：</h3>
        <div ref="imageCount" class="images-upload">
          <label @change="uploadImgs" class="image">
            <div class="icon add">
              <svg
                t="1743324250403"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4552"
                width="32"
                height="32"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M554.666667 170.666667a42.666667 42.666667 0 1 0-85.333334 0v298.666666H170.666667a42.666667 42.666667 0 1 0 0 85.333334h298.666666v298.666666a42.666667 42.666667 0 1 0 85.333334 0v-298.666666h298.666666a42.666667 42.666667 0 0 0 0-85.333334h-298.666666V170.666667z"
                  p-id="4553"
                ></path>
              </svg>
            </div>
            <div class="icon del" title="删除">
              <svg
                t="1743340610620"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5662"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="20"
                height="20"
              >
                <path
                  d="M896 256a21.333333 21.333333 0 0 1 21.333333 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-85.333333v469.333334c0 47.530667-40.96 83.114667-89.322667 85.226666L716.8 896H307.2c-48.768 0-91.221333-34.133333-93.738667-80.917333L213.333333 810.666667V341.333333H128a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333h768z m-170.666667 85.333333H298.666667v466.965334l0.853333 0.597333a14.592 14.592 0 0 0 5.418667 1.642667L307.2 810.666667h409.6a15.893333 15.893333 0 0 0 7.68-1.770667l0.853333-0.618667V341.333333z m-277.333333 106.666667a21.333333 21.333333 0 0 1 21.333333 21.333333v213.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333V469.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667z m170.666667 0a21.333333 21.333333 0 0 1 21.333333 21.333333v213.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333V469.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667z m0-320a21.333333 21.333333 0 0 1 21.333333 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333H405.333333a21.333333 21.333333 0 0 1-21.333333-21.333333V149.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h213.333334z"
                  p-id="5663"
                ></path>
              </svg>
            </div>
            <img />
            <input ref="imgFile" type="file" style="display: none" />
          </label>
        </div>
      </div>

      <div class="status">
        <h3>帖子状态：</h3>
        <toggle-button @event="toggleEvent" class="btn">
          <template #first>公开</template>
          <template #second>私密</template>
        </toggle-button>
      </div>

      <button class="publish-btn" @click="publish">发布</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.publish {
  display: grid;
  grid-template-columns: 1fr;
  gap: $main-gap * 3;
  padding: $main-gap;
  width: 100%;
  height: 100%;

  .left {
    display: flex;
    flex-direction: column;
    gap: $main-gap;

    .content {
      display: flex;
      flex-direction: column;
      gap: $main-gap;

      textarea {
        width: 100%;
        height: 70vh;
        padding: $main-gap;
        font-size: 16px;
        line-height: 1.5;
        resize: none;
        border: none;
        outline: none;
        color: var(--font-color);
        background-color: var(--postcard-main-color);
        box-shadow: 0 0 4px var(--aside-shadow);
        border-radius: calc($main-gap / 2);

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: $main-gap * 3;

    .img {
      display: flex;
      flex-direction: column;
      gap: $main-gap;
    }

    .images-upload {
      display: grid;
      grid-template-columns: repeat(auto-fill, 100px);
      gap: $main-gap;
      background-color: var(--postcard-main-color);
      box-shadow: 0 0 4px var(--aside-shadow);
      padding: $main-gap;
      border-radius: calc($main-gap / 2);

      .image {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        overflow: hidden;
        background-color: var(--postcard-main-color);

        cursor: pointer;

        img {
          display: block;
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        .icon {
          position: absolute;
          z-index: 0;
          width: 50px;
          height: 50px;

          svg {
            pointer-events: none;
            fill: var(--font-color);
            transition: all 0.3s ease;
            cursor: pointer;
          }
        }

        .del {
          display: none;
          right: -8px;
          bottom: -8px;
          background-color: var(--theme-color);
          transform: scale(0.5);
        }
      }
    }

    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: $main-gap;

      .btn {
        max-width: 200px;
      }
    }

    .publish-btn {
      height: 40px;
      border: none;
      outline: none;
      transition: all 0.3s ease;
      background-color: var(--postcard-btn-color);
      border-radius: calc($main-gap / 2);
      cursor: pointer;

      &:hover {
        background-color: var(--postcard-btn-hover-color);
      }
    }
  }

  @media (min-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
    gap: $main-gap * 2;
  }
}
</style>
