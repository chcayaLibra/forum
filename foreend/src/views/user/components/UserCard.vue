<script setup>
import router from '@/router'
import fullScreen from '@/utils/fullScreenImg'
import { baseURL } from '@/utils/request'
import { waterFall } from '@/utils/waterFall'
import PostCard from '@/views/post/components/PostCard.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import { ref, useTemplateRef, nextTick, onActivated } from 'vue'
import { useUserStore } from '@/stores'
import FollowButton from '@/components/FollowButton.vue'

const isChosen = ref(true)
const userStore = useUserStore()

const MIN_GAP = 20

const ulRef = useTemplateRef('ul')
const lisRef = useTemplateRef('lis')

const props = defineProps({
  userInfo: Object,
  userPostList: Array,
  userCollectPost: Array
})

const emit = defineEmits(['updateList'])

const onWaterFail = () => {
  if (!lisRef.value?.length || !ulRef.value) {
    return
  }
  return waterFall({
    minGap: MIN_GAP,
    cards: lisRef.value,
    cardWidth: lisRef.value[0].clientWidth + MIN_GAP,
    container: ulRef.value
  })
}

const toggleEvent = async (value) => {
  isChosen.value = value
  nextTick(() => {
    onWaterFail()
  })
  emit('updateList')
}

const onUpdateListInfo = async () => {
  await userStore.getUserPostList()
  await userStore.getUserCollectPost()
}

const onUpdateList = async () => {
  await userStore.getUserPostList()
  await userStore.getUserCollectPost()
  emit('updateList')
  setTimeout(() => {
    onWaterFail()
  }, 100)
}

nextTick(() => {
  onWaterFail()
})

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
  setTimeout(() => {
    onWaterFail()
  }, 100)
})

setTimeout(() => {
  onWaterFail()
}, 100)
</script>

<template>
  <div class="user-card">
    <div class="header">
      <img
        v-loading
        @click="fullScreen(props.userInfo?.background_img)"
        class="bg"
        :src="baseURL + props.userInfo?.background_img"
        alt=""
      />
      <img
        v-loading
        @click="fullScreen(props.userInfo?.user_avatar)"
        class="avatar"
        :src="baseURL + props.userInfo?.user_avatar"
        alt=""
      />
      <follow-button
        :isFollow="props.userInfo?.is_followed_by_current_user"
        :followId="props.userInfo?.user_id"
        v-if="props.userInfo?.user_id !== userStore.userId"
        class="btn"
      ></follow-button>
      <button
        v-if="$slots.btn && props.userInfo?.user_id === userStore.userId"
        @click="router.push('/user/edit')"
      >
        <slot name="btn"></slot>
      </button>
    </div>
    <div class="main">
      <div class="name">{{ props.userInfo?.username }}</div>
      <div class="id">id: {{ props.userInfo?.user_id }}</div>
      <br />
      <span class="count">{{ props.userInfo?.follows }}关注</span>
      <span>&nbsp;&nbsp;&nbsp;</span>
      <span class="count">{{ props.userInfo?.fans }}粉丝</span>
    </div>
    <div class="footer">
      <toggle-button @event="toggleEvent">
        <template #first>
          <span v-if="props.userInfo?.user_id === userStore.userId"
            >我的帖子</span
          >
          <span v-else>TA的帖子</span>
        </template>
        <template #second>
          <span v-if="props.userInfo?.user_id === userStore.userId"
            >我的收藏</span
          >
          <span v-else>TA的收藏</span>
        </template>
      </toggle-button>
      <ul ref="ul" v-if="isChosen">
        <li ref="lis" v-for="post in userPostList" :key="post.p_id">
          <post-card
            @update-list-info="onUpdateListInfo"
            @update-list-status="onUpdateList"
            :post
          ></post-card>
        </li>
        <span class="tip" v-if="!userPostList.length"
          ><slot name="pText">没有帖子，去</slot
          ><strong v-if="$slots.pEvent" @click="router.push('/publish')"
            ><slot name="pEvent">新建一个</slot></strong
          ></span
        >
      </ul>
      <ul ref="ul" v-else>
        <li ref="lis" v-for="post in userCollectPost" :key="post?.p_id">
          <post-card
            @update-list-info="onUpdateListInfo"
            @update-list-status="onUpdateList"
            :post
          >
          </post-card>
        </li>
        <span class="tip" v-if="!userCollectPost.length"
          ><slot name="cText">没有收藏帖子，去</slot
          ><strong v-if="$slots.cEvent" @click="router.push('/post')"
            ><slot name="cEvent">收藏一个</slot></strong
          ></span
        >
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
$item-w: clamp(362px, 35vw, 500px);
$position-size: 200px;
.user-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: $main-gap;

  @media (max-width: 360px) {
    padding: 0;
  }

  .header {
    position: relative;
    height: $position-size;

    .bg {
      width: 100%;
      height: $position-size - 60px;
      object-fit: cover;
      border-radius: calc($main-gap / 2);
      border: 3px solid;
    }

    .avatar {
      position: absolute;
      top: $position-size - 100px;
      left: $main-gap;
      width: 80px;
      height: 80px;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid;
    }

    .btn {
      position: absolute;
      top: $position-size - 50px;
      right: 0;
      width: 80px;
      height: 30px;
    }

    button {
      position: absolute;
      top: $position-size - 50px;
      right: 0;
      border: none;
      outline: none;
      width: 100px;
      height: 30px;
      border-radius: calc($main-gap / 2);
      transition: all 0.3s ease;
      background-color: var(--postcard-btn-color);
      cursor: pointer;

      &:hover {
        background-color: var(--postcard-btn-hover-color);
      }
    }
  }

  .main {
    height: 100px;
    margin-left: $main-gap;

    .name {
      font-weight: bold;
      font-size: 20px;
    }

    .id {
      opacity: 0.6;
    }

    .count {
      opacity: 0.6;
    }
  }

  .footer {
    margin-top: $main-gap;

    ul {
      display: grid;
      justify-content: center;
      gap: $main-gap;
      margin-top: $main-gap;

      li {
        width: 360px;
        animation: appear 0.5s ease forwards;

        @media (max-width: 376px) {
          width: 80vw;
        }
      }

      .tip {
        margin-top: $main-gap;

        strong {
          cursor: pointer;
          text-decoration: underline;
        }
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
}
</style>
