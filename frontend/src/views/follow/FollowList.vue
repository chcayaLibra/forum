<script setup>
import { followListService, followSearchServer } from '@/api/follow'
import router from '@/router'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { ref, watch, reactive, onMounted, onUpdated, nextTick } from 'vue'
import { userInfoService } from '@/api/user'
import fullScreen from '@/utils/fullScreenImg'
import { io } from 'socket.io-client'
import {
  chatHistoryService,
  chatMarkAsReadService,
  chatUnreadService
} from '@/api/chat'
import { chatPrompt } from '@/utils/chatPrompt'
import { lineBreakReplace } from '@/utils/regular'
import { escapeHTML } from '@/utils/safeContent'

const route = useRoute()
const userStore = useUserStore()
const socket = io('wss://api.chcaya.christmas')
// const socket = io('wss://localhost:2053')

const username = ref('')
const searchList = ref([])

const selectedFriend = ref(null)
const message = ref('')
const friends = ref([])
const userList = ref([])
const followInfo = ref({})
const messageBox = ref(null)
const input = ref(null)
const chatRecords = reactive({})
const unreadCount = reactive({})

const getUserList = async () => {
  const res = await followListService({ user_id: userStore.userId })
  userList.value = res.data.data
}
getUserList()

const getFollowInfo = async (followId) => {
  const res = await userInfoService({
    userId: userStore.userId,
    followId
  })
  followInfo.value = res.data.data[0]
  selectedFriend.value = followInfo.value.user_id
  await nextTick()
  if (input.value) {
    input.value.focus()
  }
  if (route.fullPath.startsWith('/chat')) {
    router.push(`/chat?id=${followInfo.value.user_id}`)
  }
}

const toFollowDetail = (id) => {
  const path = route.path
  const parts = path.split('/')
  const followId = parts[3]
  sessionStorage.setItem(`/follow/${followId}`, 0)
  router.push(
    `/follow/${followInfo.value?.user_id || id}?redirect=${route.fullPath}`
  )
}

// 聊天
const login = async () => {
  socket.emit('login', userStore.userId)

  const res = await followListService({ user_id: userStore.userId })
  const arr = res.data.data.map((item) => item.follow_id)
  friends.value = arr

  await fetchUnread()
}
login()

const sendMessage = (e, chatBoxMsg, sender) => {
  if (e.key === 'Enter' && e.shiftKey) return

  if (
    route.fullPath.startsWith('/chat') &&
    (!message.value.trim() || !selectedFriend.value)
  ) {
    return
  }

  let msg
  if (!route.fullPath.startsWith('/chat')) {
    msg = chatBoxMsg
  } else {
    msg = message.value
  }

  msg = escapeHTML(msg)

  if (!chatBoxMsg) {
    const el = messageBox.value
    el.style.scrollBehavior = 'smooth'
  }

  const payload = {
    from: userStore.userId,
    to: selectedFriend.value || sender,
    message: msg
  }

  socket.emit('sendMessage', payload)

  if (!chatRecords[selectedFriend.value]) {
    chatRecords[selectedFriend.value] = []
  }

  chatRecords[selectedFriend.value].push({
    from: userStore.userId,
    message: msg
  })
  message.value = ''
}

socket.on('receiveMessage', async ({ from, message }) => {
  if (!chatRecords[from]) chatRecords[from] = []
  chatRecords[from].push({ from, message })

  if (!route.fullPath.startsWith('/chat')) {
    if (!message) return
    await getFollowInfo(from)
    chatPrompt(
      followInfo.value.user_id,
      followInfo.value.user_avatar,
      followInfo.value.username,
      message,
      sendMessage,
      from
    )
  }

  if (selectedFriend.value !== from) {
    unreadCount[from] = (unreadCount[from] || 0) + 1
  }

  if (selectedFriend.value === from) {
    await chatMarkAsReadService({
      from,
      to: userStore.userId
    })
    unreadCount[from] = 0
  }
  // else {
  //   unreadCount[from] = (unreadCount[from] || 0) + 1
  // }
})

watch(selectedFriend, async (friend) => {
  if (!friend) return

  if (friend) {
    const el = messageBox.value
    if (el) {
      el.style.scrollBehavior = 'auto'
    }
    await chatMarkAsReadService({ from: friend, to: userStore.userId })
    unreadCount[friend] = 0
  }
  unreadCount[friend] = 0

  const res = await chatHistoryService(userStore.userId, friend)
  const history = res.data.data
  chatRecords[friend] = history.map((msg) => ({
    from: msg.sender,
    message: msg.content
  }))
})

const fetchUnread = async () => {
  const res = await chatUnreadService(userStore.userId)
  const data = res.data.data
  data.forEach(({ sender, count }) => {
    unreadCount[sender] = count
  })
}

const scrollToBottom = () => {
  if (selectedFriend.value) {
    const el = messageBox.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }
}

onMounted(async () => {
  scrollToBottom()
  if (route.query.id) {
    await getFollowInfo(route.query.id)
    selectedFriend.value = route.query.id
  }
})

onUpdated(() => {
  scrollToBottom()
})

let timer = ref(null)
const isShow = ref(false)
const ulRef = ref(null)
const inputUsername = () => {
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(async () => {
    if (!username.value) return
    isShow.value = true
    const res = await followSearchServer({ username: username.value })
    searchList.value = res.data.data
  }, 400)
}

const clearResult = () => {
  if (ulRef.value) {
    ulRef.value.style.opacity = 0
  }
  setTimeout(() => {
    username.value = ''
    isShow.value = false
    searchList.value = []
  }, 500)
}
</script>

<template>
  <div class="follow">
    <div class="search">
      <h2>我的好友</h2>
      <div>
        <input
          @blur="clearResult"
          @input="inputUsername"
          v-model.trim="username"
          type="text"
          placeholder="请输入用户名"
        />
        <ul ref="ulRef" v-if="isShow">
          <li v-for="(item, index) in searchList" :key="index">
            <img
              @click="toFollowDetail(item?.user_id)"
              :src="baseURL + item?.user_avatar"
              alt=""
            />
            <span @click="toFollowDetail(item?.user_id)">{{
              item?.username
            }}</span>
          </li>
          <li class="text-tip" v-if="isShow && searchList.length === 0">
            无结果
          </li>
        </ul>
        <svg
          title="搜索用户"
          t="1745042584799"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="14643"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="32"
          height="32"
        >
          <path
            title="搜索用户"
            d="M780.8 699.733333c44.8-61.866667 68.266667-138.666667 68.266667-215.466666 0-206.933333-168.533333-375.466667-375.466667-375.466667S100.266667 277.333333 100.266667 484.266667s168.533333 375.466667 375.466666 375.466666c61.866667 0 123.733333-17.066667 179.2-44.8l-64-64c-36.266667 14.933333-74.666667 23.466667-115.2 23.466667-160 0-290.133333-130.133333-290.133333-290.133333s128-290.133333 288-290.133334 290.133333 130.133333 290.133333 290.133334c0 70.4-25.6 140.8-74.666666 192l-25.6 25.6 4.266666 4.266666 202.666667 202.666667 59.733333-59.733333-149.333333-149.333334z"
            p-id="14644"
          ></path>
        </svg>
      </div>
    </div>
    <div class="list">
      <ul>
        <li class="li-name" v-for="item in userList" :key="item.follow_id">
          <span v-if="unreadCount[item.follow_id]" class="count">{{
            unreadCount[item.follow_id]
          }}</span>
          <img
            v-loading
            @click="getFollowInfo(item.follow_id)"
            :src="baseURL + item.user_avatar"
            :title="item.username"
          />
          <span
            class="follow-name"
            @click="getFollowInfo(item.follow_id)"
            :title="item.username"
            >{{ item.username }}</span
          >
        </li>
      </ul>
      <div class="tip" v-if="!selectedFriend">请选择一位好友</div>
      <div v-else class="chat">
        <div class="header">
          <img
            v-loading
            :title="followInfo?.username"
            @click="fullScreen(followInfo?.user_avatar)"
            :src="baseURL + followInfo?.user_avatar"
          />
          <span :title="followInfo?.username" @click="toFollowDetail">{{
            followInfo?.username
          }}</span>
        </div>
        <div class="main" ref="messageBox">
          <div
            class="text"
            v-for="(msg, index) in chatRecords[selectedFriend] || []"
            :key="index"
          >
            <div class="user-chat" v-if="msg.from === userStore.userId">
              <span v-html="lineBreakReplace(msg.message)"></span>
              <img :src="baseURL + userStore.userInfo?.user_avatar" />
            </div>
            <div class="follow-chat" v-if="msg.from !== userStore.userId">
              <img :src="baseURL + followInfo?.user_avatar" />
              <span v-html="lineBreakReplace(msg.message)"></span>
            </div>
          </div>
        </div>
        <div class="footer">
          <form class="ipt" @submit.prevent>
            <textarea
              ref="input"
              v-disableEnter
              v-model.trim="message"
              @keydown.enter="sendMessage($event)"
              placeholder="Please input your message..."
            ></textarea>
            <button @click="sendMessage($event)" title="发送">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
$developed-area: 300px;
.follow {
  padding: $main-gap;

  @media (max-width: 376px) {
    padding: 0;
  }

  @media (max-width: 376px) {
    padding: 0;
  }

  .search {
    display: flex;
    align-items: center;
    line-height: 32px;

    div {
      position: relative;
      display: flex;
      margin-left: auto;

      &:hover {
        input {
          width: 200px;

          &::placeholder {
            color: var(--search-placeholder-color);
          }
        }
      }

      ul {
        position: absolute;
        z-index: 1;
        right: 0;
        top: 28px;
        display: flex;
        flex-direction: column;
        gap: calc($main-gap / 2);
        background-color: var(--search-bg-color);
        width: 200px;
        padding: calc($main-gap / 2);
        border-radius: 0 0 calc($main-gap / 2) calc($main-gap / 2);

        li {
          display: flex;
          align-items: center;
          gap: calc($main-gap / 2);
          font-size: 14px;

          img {
            width: 32px;
            height: 32px;
            aspect-ratio: 1;
            border-radius: 50%;
          }

          img,
          span {
            cursor: pointer;
          }
        }

        .text-tip {
          justify-content: center;
        }
      }

      input {
        // display: none;
        position: absolute;
        top: -4px;
        right: 0;
        width: 45px;
        height: 40px;
        background-color: var(--search-bg-color);
        border: none;
        outline: none;
        padding-left: calc($main-gap / 2);
        border-radius: calc($main-gap / 2);
        color: var(--search-font-color);
        transition: all 0.3s ease;

        &:focus {
          width: 200px;

          &::placeholder {
            color: var(--search-placeholder-color);
          }
        }

        &::placeholder {
          color: transparent;
          transition: all 0.3s ease;
        }
      }

      svg {
        margin-right: calc($main-gap / 2);
        z-index: 1;
        width: 25px;
        fill: var(--font-color);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          filter: drop-shadow(0 0 1px var(--font-color));
        }
      }
    }
  }

  .list {
    margin-top: $main-gap;
    display: grid;
    grid-template-columns: 90px 1fr;
    width: 100%;
    height: 79vh;
    border-radius: calc($main-gap / 2);
    overflow: hidden;
    box-shadow: 0 0 3px var(--aside-shadow);
    transition: all 0.3s ease;

    @media (max-width: 376px) {
      grid-template-columns: 60px 1fr;
    }

    &:has(ul:hover) {
      grid-template-columns: $developed-area 1fr;
    }

    ul {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: $main-gap;
      box-shadow: 1px 0 3px var(--aside-shadow);
      background-color: var(--postcard-header-color);
      overflow-y: scroll;

      @media (max-width: 376px) {
        padding: 12.5px;
      }

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }

      li {
        position: relative;
        display: grid;
        grid-template-columns: 50px 200px;
        grid-template-rows: 70px;
        align-items: center;
        width: 100%;
        gap: $main-gap;

        @media (max-width: 376px) {
          grid-template-rows: 50px;
        }

        .count {
          position: absolute;
          left: 30px;
          bottom: 10px;
          width: 20px;
          height: 20px;
          background-color: #b30101;
          border-radius: 5px;
          color: white;
          text-align: center;
          line-height: 20px;
          font-size: 14px;

          @media (max-width: 376px) {
            left: 20px;
            bottom: 8px;
            width: 16px;
            height: 16px;
            line-height: 16px;
          }
        }

        img {
          width: 50px;
          height: 50px;
          aspect-ratio: 1;
          border-radius: 50%;
          cursor: pointer;

          @media (max-width: 376px) {
            width: 35px;
            height: 35px;
          }
        }

        .follow-name {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
    }

    .tip {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      opacity: 0.5;
      padding-left: $main-gap;
      background-color: var(--postcard-main-color);
    }

    .chat {
      width: 100%;
      height: 79vh;
      background-color: var(--postcard-main-color);
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        gap: calc($main-gap / 2);
        padding: calc($main-gap / 1.5) $main-gap;
        height: calc($main-gap * 5 / 1.5);
        background-color: var(--postcard-header-color);

        img {
          width: 40px;
          height: 40px;
          aspect-ratio: 1;
          border-radius: 50%;
          cursor: pointer;
        }

        span {
          cursor: pointer;
          $line: 1;
          display: -webkit-box;
          line-height: 1.5;
          overflow: hidden;
          -webkit-line-clamp: $line;
          -webkit-box-orient: vertical;
          line-clamp: $line;
          text-overflow: ellipsis;
        }
      }

      .main {
        display: flex;
        flex-direction: column;
        gap: calc($main-gap / 1.5);
        flex: 1;
        padding: $main-gap;
        overflow-y: scroll;

        .text {
          font-size: 14px;
          width: 100%;
          // word-wrap: break-word;
          word-break: break-all;
          // overflow-wrap: break-word;
          // background-color: #564f4f;

          .user-chat {
            justify-content: end;
            img {
              margin-left: calc($main-gap / 2);
            }
          }

          .follow-chat {
            img {
              margin-right: calc($main-gap / 2);
            }
          }

          div {
            display: flex;
            span {
              padding: calc($main-gap / 2);
              border-radius: calc($main-gap / 2);
              background-color: var(--chat-msg-color);
              max-width: 50%;
            }

            img {
              width: 32px;
              height: 32px;
              aspect-ratio: 1;
              border-radius: 50%;
            }
          }
        }

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }

      .footer {
        flex-shrink: 0;

        .ipt {
          display: flex;
          align-items: center;
          width: 100%;
          border-radius: calc($main-gap / 2) calc($main-gap / 2) 0 0;
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
      }
    }
  }

  @media (max-width: 376px) {
    .list {
      &:has(ul:hover) {
        grid-template-columns: 200px 1fr;
      }
    }
  }

  @media (min-width: 850px) {
    .list {
      grid-template-columns: $developed-area 1fr;
    }
  }
}
</style>
