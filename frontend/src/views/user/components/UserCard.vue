<script setup>
import router from '@/router'
import fullScreen from '@/utils/fullScreenImg'
import { baseURL } from '@/utils/request'
import { waterFall } from '@/utils/waterFall'
import PostCard from '@/views/post/components/PostCard.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import {
  ref,
  useTemplateRef,
  nextTick,
  onActivated,
  watch,
  onMounted
} from 'vue'
import { usePostStore, useUserStore } from '@/stores'
import FollowButton from '@/components/FollowButton.vue'
import { userFansListService, userFollowListService } from '@/api/user'
import { useRoute } from 'vue-router'

const route = useRoute()
const isChosen = ref(true)
const postStore = usePostStore()
const userStore = useUserStore()
const userFollowList = ref([])
const userFansList = ref([])

const MIN_GAP = 20

const ulRef = useTemplateRef('ul')
const lisRef = useTemplateRef('lis')

const props = defineProps({
  userInfo: Object,
  userPostList: Array,
  userCollectPostList: Array
})

function onWaterFail() {
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

async function toggleState(value) {
  isChosen.value = value
  await nextTick()
  onWaterFail()
}

watch(
  () => [
    postStore.userPostListStateMap[userStore.userId]?.page,
    postStore.userCollectPostListStateMap[userStore.userId]?.page
  ],
  async () => {
    await nextTick()
    onWaterFail()
  }
)

watch(
  () => [
    postStore.userPostListStateMap[route.params.id]?.page,
    postStore.userCollectPostListStateMap[route.params.id]?.page
  ],
  async () => {
    if (!route.fullPath.startsWith('/follow')) return
    await nextTick()
    onWaterFail()
  }
)

const onUpdateListAfterDel = async () => {
  await nextTick()
  onWaterFail()
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

onMounted(async () => {
  await nextTick()
  onWaterFail()
})

onActivated(async () => {
  await nextTick()
  onWaterFail()
})

const currentUserId = () => {
  if (route.fullPath.startsWith('/user')) {
    return userStore.userId
  } else {
    const path = route.path
    const parts = path.split('/')
    const followId = parts[2]
    return followId
  }
}

const getUserFollowList = async () => {
  const res = await userFollowListService(currentUserId())
  if (!res) return
  userFollowList.value = res.data.data
}
getUserFollowList()

const getUserFansList = async () => {
  const res = await userFansListService(currentUserId())
  if (!res) return
  userFansList.value = res.data.data
}
getUserFansList()

function navigateToFollowDetail(id) {
  sessionStorage.setItem(`/follow/${id}`, 0)
  router.push(`/follow/${id}?redirect=${route.fullPath}`)
}

defineExpose({
  onWaterFail
})
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
        :isFollow="userStore.userFollowList.includes(props.userInfo?.user_id)"
        :followId="props.userInfo?.user_id"
        v-if="
          props.userInfo?.user_id !== userStore.userId &&
          userStore.userFollowList.length
        "
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
      <div class="main-item">
        <div class="follows">
          <span class="text">{{ props.userInfo?.follows }}关注</span>
          <div class="follows-box">
            <ul>
              <li
                v-for="(item, index) in userFollowList"
                :key="index"
                @click="navigateToFollowDetail(item.follow_id)"
              >
                <img :src="baseURL + item.user_avatar" />
                <span>{{ item.username }}</span>
              </li>
            </ul>
          </div>
        </div>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <div class="fans">
          <span class="text">{{ props.userInfo?.fans }}粉丝</span>
          <div class="fans-box">
            <ul>
              <li
                v-for="(item, index) in userFansList"
                :key="index"
                @click="navigateToFollowDetail(item.user_id)"
              >
                <img :src="baseURL + item.user_avatar" />
                <span>{{ item.username }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <toggle-button @event="toggleState">
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
        <li ref="lis" v-for="post in props.userPostList" :key="post.p_id">
          <post-card
            @update-list-after-del="onUpdateListAfterDel"
            :post
            :userCollectPidList="userStore.userCollectPidList"
          ></post-card>
        </li>
        <span class="tip" v-if="!props.userPostList.length"
          ><slot name="pText">没有帖子，去</slot
          ><strong v-if="$slots.pEvent" @click="router.push('/publish')"
            ><slot name="pEvent">新建一个</slot></strong
          ></span
        >
      </ul>
      <ul ref="ul" v-else>
        <li
          ref="lis"
          v-for="post in props.userCollectPostList"
          :key="post?.p_id"
        >
          <post-card
            @update-list-after-del="onUpdateListAfterDel"
            :post
            :userCollectPidList="userStore.userCollectPidList"
          >
          </post-card>
        </li>
        <span class="tip" v-if="!props.userCollectPostList.length"
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

    .main-item {
      display: flex;

      .text {
        opacity: 0.6;

        &:hover + .follows-box,
        &:hover + .fans-box {
          padding: calc($main-gap / 1.5);
          grid-template-rows: 1fr;
        }
      }

      .follows,
      .fans {
        position: relative;
      }

      .follows-box,
      .fans-box {
        position: absolute;
        z-index: 2;
        padding: 0;
        display: grid;
        grid-template-rows: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        border-radius: calc($main-gap / 2);
        background-color: var(--search-bg-color);

        ul {
          display: flex;
          white-space: nowrap;
          flex-direction: column;
          gap: calc($main-gap / 2);

          li {
            display: flex;
            align-items: center;
            gap: calc($main-gap / 2);
            cursor: pointer;

            img {
              width: 32px;
              height: 32px;
              border-radius: 50%;
            }

            span {
              font-size: 14px;
            }
          }
        }

        &:hover {
          padding: calc($main-gap / 1.5);
          grid-template-rows: 1fr;
        }
      }
    }

    .name {
      font-weight: bold;
      font-size: 20px;
    }

    .id {
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
