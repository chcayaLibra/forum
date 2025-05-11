<script setup>
// import { removeContainer } from '@/utils/chatPrompt'
import router from '@/router'
import { removeContainer } from '@/utils/chatPrompt'
import { lineBreakReplace } from '@/utils/regular'
import { baseURL } from '@/utils/request'
// import { escapeHTML } from '@/utils/safeContent'
import { ref } from 'vue'

const chat = ref(null)
const xValue = ref()

const _avatar = ref()
const _username = ref()
const _msg = ref('')
const _eventName = ref('')
const _sendMsg = ref('')
const _sender = ref('')
const _userId = ref('')

const boxDisappear = () => {
  xValue.value = getComputedStyle(chat.value).getPropertyValue('--x')

  chat.value.animate(
    [
      {
        transform: `translateX(${xValue.value}) translateY(0)`
      },
      {
        transform: `translateX(${xValue.value}) translateY(-250px)`
      }
    ],
    {
      duration: 700,
      easing: 'ease',
      fill: 'forwards'
    }
  )
}

let fn
const saveInfo = (userId, avatar, username, msg, eventName, sender) => {
  _userId.value = userId
  _avatar.value = avatar
  _username.value = username
  _msg.value = msg
  _eventName.value = eventName
  _sender.value = sender
  fn = _eventName.value
}

const sendMessage = (e) => {
  if (e.key === 'Enter' && e.shiftKey) return
  _sendMsg.value
  fn(e, _sendMsg.value, _sender.value)
  _sendMsg.value = ''
  boxDisappear()
  removeContainer()
}

const close = () => {
  boxDisappear()
  removeContainer()
}

const jump = () => {
  router.push({
    path: '/chat',
    query: {
      id: _userId.value
    }
  })
  boxDisappear()
  removeContainer()
}

defineExpose({
  saveInfo
})
</script>

<template>
  <div ref="chat" class="box">
    <div class="user-info">
      <img v-if="_avatar" v-loading :src="baseURL + _avatar" />
      <span>{{ _username }}</span>
      <div class="func-btn">
        <div @click="close" class="close" title="关闭">
          <svg
            t="1745037750698"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4693"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
          >
            <path
              d="M587.264 512l165.888-165.888c20.992-20.992 20.992-54.272 0-75.264s-54.272-20.992-75.264 0L512 436.736 346.112 270.848c-20.992-20.992-54.272-20.992-75.264 0s-20.992 54.272 0 75.264L436.736 512l-165.888 165.888c-20.992 20.992-20.992 54.272 0 75.264 9.728 10.24 23.552 15.36 37.888 15.36 14.336 0 27.648-5.632 37.888-15.36l165.888-165.888 165.888 165.888c9.728 10.24 23.552 15.36 37.888 15.36 14.336 0 27.648-5.632 37.888-15.36 20.992-20.992 20.992-54.272 0-75.264L587.264 512z"
              p-id="4694"
            ></path>
          </svg>
        </div>
        <div @click="jump" class="jump" title="跳转到该用户聊天界面">
          <svg
            t="1745037824027"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="12349"
            width="32"
            height="32"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M359.86136 0.00382a51.199909 51.199909 0 0 1 0 102.399818H153.599727a51.199909 51.199909 0 0 0-51.199909 51.199909V870.400273a51.199909 51.199909 0 0 0 51.199909 51.199909h716.796726a51.199909 51.199909 0 0 0 51.199909-51.199909V665.600637a51.199909 51.199909 0 0 1 102.399818 0v204.799636a153.599727 153.599727 0 0 1-153.599727 153.599727H153.599727A153.599727 153.599727 0 0 1 0 870.400273V153.603547A153.599727 153.599727 0 0 1 153.599727 0.00382h206.261633z m620.980897 0.584999h2.193996a29.256948 29.256948 0 0 1 5.119991 1.243998h0.730998a24.209957 24.209957 0 0 1 5.85199 2.559995 56.2469 56.2469 0 0 1 5.85099 3.071995l2.193996 1.315997a27.793951 27.793951 0 0 1 5.851989 5.412991l-0.731998-1.243998 0.731998 0.731999v0.511999l4.387993 4.168992 1.462997 2.193996a84.113851 84.113851 0 0 1 7.314987 13.969976v0.512999c0.730999 2.193996 0.730999 4.460992 1.461997 6.728988v2.119996a25.892954 25.892954 0 0 1 0.731999 7.314987v332.799408a51.199909 51.199909 0 0 1-102.399818 0V174.813509l-373.759336 373.393337a51.199909 51.199909 0 0 1-70.215875 1.900996l-2.193996-1.900996a52.149907 52.149907 0 0 1 0-72.411872l373.758336-373.392336H639.997863a51.199909 51.199909 0 0 1-51.199909-48.639914v-2.559995a51.199909 51.199909 0 0 1 51.199909-51.199909h332.798408a41.105927 41.105927 0 0 1 7.313987 0.584999h0.731999z m0 0"
              p-id="12350"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="msg" v-html="lineBreakReplace(_msg)"></div>
    <form class="ipt" @submit.prevent>
      <textarea
        ref="input"
        v-disableEnter
        v-model.trim="_sendMsg"
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
</template>

<style scoped lang="scss">
$main-gap: 20px;
.box {
  --x: calc(-50% + 35px);
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: $main-gap;
  transform: translateX(calc(-50% + 35px));
  padding: $main-gap;
  border-radius: calc($main-gap / 2);
  box-shadow: 0 0 5px var(--aside-shadow);
  width: 350px;
  white-space: nowrap;
  color: rgb(0, 0, 0);
  font-weight: 400;
  animation: appear 0.7s ease forwards;
  background-color: white;
  opacity: 0.9;

  @media (max-width: 376px) {
    width: 80%;
  }

  .msg {
    width: 100%;
    padding: 0 5px;
    line-height: 1.5;
    text-overflow: ellipsis;
    display: -webkit-box;
    // height: 220px;
    line-height: 1.5;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-clamp: 1;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: calc($main-gap / 2);
    padding: 0 5px;

    img {
      width: 40px;
      height: 40px;
      aspect-ratio: 1;
      border-radius: 50%;
    }

    .func-btn {
      display: flex;
      align-items: center;
      gap: calc($main-gap / 2);
      margin-left: auto;
      cursor: pointer;

      .jump,
      .close {
        display: flex;
        transition: all 0.3s ease;

        &:hover {
          filter: drop-shadow(0 0 1px black);
        }
      }

      .jump {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

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

  @keyframes appear {
    from {
      transform: translateX(calc(-50% + 35px)) translateY(-250px);
    }

    to {
      transform: translateX(calc(-50% + 35px)) translateY(0);
    }
  }

  @media (max-width: 520px) {
    --x: -50%;
    transform: translateX(-50%);

    @keyframes appear {
      from {
        transform: translateX(-50%) translateY(-250px);
      }

      to {
        transform: translateX(-50%) translateY(0);
      }
    }
  }
}
</style>
