<script setup>
import { userLoginService, userRegisterService } from '@/api/login'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { isValidEmail, isValidPassword } from '@/utils/regular'
import showPrompt from '@/utils/promptBox'
import router from '@/router'

const userStore = useUserStore()
const state = ref(true)
const emailText = ref('')
const passwordText = ref('')
const repeatPwdText = ref('')
const flag = ref(true)
const formInfo = ref({
  email: '',
  password: '',
  repeatPwd: ''
})

watch(
  () => formInfo.value.email,
  () => {
    if (isValidEmail(formInfo.value.email)) {
      emailText.value = ''
    }
  }
)

watch(
  () => formInfo.value.password,
  () => {
    if (isValidPassword(formInfo.value.password)) {
      passwordText.value = ''
    }
  }
)

watch(
  () => formInfo.value.repeatPwd,
  () => {
    if (formInfo.value.password === formInfo.value.repeatPwd) {
      repeatPwdText.value = ''
    }
  }
)

function judgeInfo() {
  if (!formInfo.value.email) {
    emailText.value = '邮箱不为空！'
    return false
  }
  if (!isValidEmail(formInfo.value.email)) {
    emailText.value = '请输入正确的邮箱格式！'
    return false
  }
  if (!formInfo.value.password) {
    passwordText.value = '密码不为空！'
    return false
  }
  if (!isValidPassword(formInfo.value.password)) {
    passwordText.value = '只允许数字、字母、符号，禁止空格，长度6-16个字符！'
    return false
  }
  if (!state.value && formInfo.value.repeatPwd !== formInfo.value.password) {
    repeatPwdText.value = '密码不一致！'
    return false
  }
  return true
}

const resetState = () => {
  formInfo.value.email = ''
  formInfo.value.password = ''
  formInfo.value.repeatPwd = ''
  emailText.value = ''
  passwordText.value = ''
  repeatPwdText.value = ''
  state.value = !state.value
}

async function login() {
  if (!flag.value) return
  if (!judgeInfo()) return
  flag.value = false
  const token = await userLoginService({
    input: formInfo.value.email,
    password: formInfo.value.password
  })
  if (token) {
    userStore.token = token.data.token
    userStore.setUserId(token.data.userId)
    showPrompt('登录成功', 'success')
    setTimeout(() => {
      router.push(router.currentRoute.value.query.redirect || '/')
      flag.value = true
    }, 1500)
  } else {
    showPrompt('登录失败', 'error')
    flag.value = true
  }
}

async function register() {
  if (!flag.value) return
  if (!judgeInfo()) return
  flag.value = false
  const res = await userRegisterService({
    email: formInfo.value.email,
    password: formInfo.value.password
  })
  if (res) {
    showPrompt('注册成功，请前往登录页登录', 'success')
    setTimeout(() => {
      resetState()
      flag.value = true
    }, 1500)
  } else {
    showPrompt('注册失败', 'error')
    flag.value = true
  }
}

const stateActive = () => {
  state.value ? login() : register()
}
</script>

<template>
  <form class="login" @submit.prevent>
    <div class="left">
      <div class="ico">
        <svg
          t="1742719157794"
          class="icon"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4790"
          width="256.25"
          height="256"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M588.1088 490.3424c12.81024 109.23008 105.63072 193.9968 218.30144 193.9968s205.4912-84.76672 218.30144-193.9968c0 0-0.35328 0-0.3584 0 0.52224-4.92032-0.37376-10.04032-2.87744-14.73024l-189.68064-355.2256c-1.65376-6.85568-6.02112-13.02528-12.73344-16.60928-2.29888-1.2288-4.70528-1.9456-7.13728-2.42176-0.2048-0.04608-0.41472-0.0768-0.61952-0.11776-1.17248-0.19968-2.33472-0.3328-3.5072-0.36864-0.3584-0.01536-0.6912-0.11264-1.0496-0.11264l-269.2864 0 0-38.63552c0-17.3312-11.46368-31.38048-25.6-31.38048s-25.6 14.04928-25.6 31.38048l0 38.63552L216.97024 100.75648c-0.35328 0-0.68096 0.09216-1.02912 0.10752-0.31232 0.0256-0.62464 0.06144-0.93696 0.09728-5.10464 0.43008-9.72288 2.46784-13.4656 5.67296-0.04096 0.03584-0.0768 0.06656-0.11776 0.1024-0.9984 0.86528-1.92512 1.792-2.78016 2.816-0.50176 0.57344-0.95744 1.16736-1.40288 1.77664-0.31232 0.45056-0.61952 0.90112-0.90624 1.37216-1.5104 2.3808-2.6112 4.95616-3.27168 7.67488L3.3792 475.61728c-2.24256 4.20352-3.09248 8.74496-2.8928 13.184C0.4608 489.3184 0.3584 489.81504 0.3584 490.3424l-0.35328 0c12.81024 109.23008 105.63072 193.9968 218.30144 193.9968s205.4912-84.76672 218.30144-193.9968c0 0-0.35328 0-0.3584 0 0.52224-4.92032-0.37376-10.04032-2.87744-14.73024L260.54656 151.95648l225.7152 0 0 790.45632L216.97024 942.4128c-13.51168 0-24.46848 11.46368-24.46848 25.6s10.9568 25.6 24.46848 25.6l589.78304 0c13.51168 0 24.46848-11.46368 24.46848-25.6 0-14.14144-10.9568-25.6-24.4736-25.6l-269.2864 0L537.46176 151.95648l226.85184 0-172.8256 323.65568c-2.24256 4.20352-3.0976 8.74496-2.89792 13.184-0.0256 0.52224-0.128 1.01888-0.128 1.54624L588.1088 490.3424zM218.30656 633.1392c-75.19744 0-138.85952-49.22368-160.62464-117.1968l265.5488 0c11.60704 0 21.02272-11.46368 21.02272-25.6 0-14.14144-9.41056-25.6-21.02272-25.6l-256 0 151.1424-283.0592 166.17472 311.1936C371.04128 572.49792 301.7728 633.1392 218.30656 633.1392zM806.41024 633.1392c-75.19744 0-138.85952-49.22368-160.62464-117.1968l267.8016 0c11.68896 0 21.16608-11.46368 21.16608-25.6 0-14.14144-9.47712-25.6-21.16608-25.6l-258.25792 0 151.14752-283.0592 166.1696 311.19872C959.14496 572.49792 889.87648 633.1392 806.41024 633.1392z"
            p-id="4791"
          ></path>
        </svg>
      </div>
      <h3 class="text">Welcome to ...</h3>
    </div>
    <div class="right">
      <h2>{{ state ? 'Login' : 'Sign up' }}</h2>
      <input
        @blur="judgeInfo"
        v-model="formInfo.email"
        type="text"
        placeholder="请输入邮箱"
      />
      <div class="warning">{{ emailText }}</div>
      <input
        @blur="judgeInfo"
        v-model="formInfo.password"
        type="text"
        placeholder="请输入密码"
      />
      <div class="warning">{{ passwordText }}</div>
      <input
        @blur="judgeInfo"
        v-model="formInfo.repeatPwd"
        v-if="!state"
        type="text"
        placeholder="再次输入密码"
      />
      <div v-if="!state" class="warning">{{ repeatPwdText }}</div>
      <button
        @keydown.enter.stop="stateActive"
        @click="stateActive"
        class="login-btn"
      >
        {{ state ? '登录' : '注册' }}
      </button>
      <div class="tip">
        {{ state ? '还没有' : '已有' }}账号？前往
        <button @click="resetState">
          {{ state ? '注册' : '登录' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
$main-gap: 20px;
$item-w: clamp(100px, 20vw, 256px);
.login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-content: center;
  padding: $main-gap;
  gap: $main-gap;
  width: 100%;
  height: 100%;
  background-color: var(--theme-color);
  // box-shadow: 0 0 4px var(--aside-shadow);
  border-radius: calc($main-gap / 2);

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $main-gap;

    .ico {
      svg {
        width: $item-w;
        height: $item-w;
        aspect-ratio: 1;
        fill: var(--font-color);
        transition: all 0.3s ease;
        cursor: pointer;
        animation: light 3s ease infinite;
        &:hover {
          filter: drop-shadow(0 0 6px var(--font-color));
        }

        @keyframes light {
          0%,
          100% {
            filter: drop-shadow(0 0 0px var(--font-color));
          }

          50% {
            filter: drop-shadow(0 0 6px var(--font-color));
          }
        }
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc($main-gap / 1.5);
    width: 80%;
    height: 70%;
    max-height: 500px;
    border-radius: calc($main-gap / 2);
    padding: $main-gap;
    background-color: var(--postcard-main-color);
    transition: all 0.3s ease;
    box-shadow: 0 0 3px var(--aside-shadow);

    h2 {
      margin-bottom: $main-gap;
    }

    .warning {
      color: rgb(223, 76, 76);
      font-weight: bold;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      transform: translateY(-7px);
    }

    input {
      width: 80%;
      max-width: 300px;
      height: 40px;
      padding: 0 calc($main-gap / 2);
      border-radius: calc($main-gap / 2);
      border: none;
      outline: none;
      background-color: var(--login-input-color);
      transition: all 0.3s ease;

      &:hover,
      &:focus {
        background-color: var(--login-hover-color);
      }
    }

    .login-btn {
      width: 80%;
      max-width: 300px;
      height: 40px;
      border: none;
      outline: none;
      border-radius: calc($main-gap / 2);
      transition: all 0.3s ease;
      background-color: var(--login-input-color);

      &:hover {
        background-color: var(--login-hover-color);
      }
    }

    .tip {
      font-size: 14px;

      button {
        margin-left: 2px;
        background-color: transparent;
        border: none;
        outline: none;
        font-weight: bold;
        text-decoration: underline;
        color: var(--font-color);
      }
    }
  }

  @media (max-width: 850px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
