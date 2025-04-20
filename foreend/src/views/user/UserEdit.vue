<script setup>
import { updateUserInfoService } from '@/api/user'
import { uploadImg } from '@/utils/uploadImg'
import { ref, useTemplateRef, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'
import showPrompt from '@/utils/promptBox'
import router from '@/router'

const username = ref('')
const sex = ref('')
const signature = ref('')
const avatarFileRef = useTemplateRef('avatarFile')
const bgFileRef = useTemplateRef('bgFile')

const userStore = useUserStore()
const flag = ref(true)

const updateFormInfo = async () => {
  if (!flag.value) return
  flag.value = false
  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('sex', sex.value)
  formData.append('signature', signature.value)
  formData.append('user_id', userStore.userId)
  if (avatarFileRef.value.files[0]) {
    formData.append('avatar', avatarFileRef.value.files[0])
  }
  if (bgFileRef.value.files[0]) {
    formData.append('bgImg', bgFileRef.value.files[0])
  }
  const res = await updateUserInfoService(formData)
  if (res.data.code === 0) {
    showPrompt(res.data.msg, 'success')
    setTimeout(() => {
      router.push({
        path: '/user',
        query: {
          event: 'updateUserInfo'
        }
      })
      flag.value = true
    }, 1000)
  } else {
    flag.value = true
    showPrompt(res.data.msg, 'error')
  }
}

onMounted(async () => {
  await userStore.getUserInfo()
  username.value = userStore.userInfo.username
  sex.value = userStore.userInfo.sex
  signature.value = userStore.userInfo.signature
})
</script>

<template>
  <div class="edit">
    <div class="header">
      <button class="back" @click="router.go(-1)">&lt;</button>
      <span>编辑个人资料</span>
    </div>
    <div class="main">
      <div class="left">
        <div class="ico">
          <svg
            t="1743078063249"
            class="icon"
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6508"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="256.25"
            height="256"
          >
            <path
              d="M266.047647 756.544354 202.239732 742.336373l439.231418-438.719419 73.023903 73.023903-439.167418 438.655419L266.047647 756.544354zM762.55899 423.872795l-437.183421 436.671421-176.959766 51.967931-36.735951-36.735951 54.207928-184.639755 432.191427-431.679428L545.791277 207.105082l-438.719419 434.687424c-6.015992 4.799994-11.071985 10.879986-13.375982 18.879975l-92.031878 313.407585c-4.031995 13.695982-0.256 28.415962 9.855987 38.527949C18.815975 1020.032005 28.799962 1024 38.911948 1024c3.711995 0 7.35999-0.511999 10.943985-1.535998l313.599584-92.031878c7.48799-2.175997 13.247982-6.783991 17.919976-12.287984l439.743417-435.711423L762.55899 423.872795zM585.535224 163.39314l275.519635 275.327635 62.975917-59.071922L648.575141 104.321219 585.535224 163.39314zM996.41468 159.425146 864.446855 27.52132c-36.415952-36.415952-95.167874-36.735951-131.263826-0.703999l-40.511946 40.959946 263.99965 263.87165 40.511946-40.959946C1033.214631 254.657019 1032.958631 195.905097 996.41468 159.425146z"
              p-id="6509"
            ></path>
          </svg>
        </div>
        <h3 class="text">Edit? Hahahaha...</h3>
      </div>
      <div class="right">
        <form @submit.prevent class="form">
          <div class="username">
            <span>昵称：</span>
            <input
              class="to-right"
              type="text"
              v-model="username"
              placeholder="最多16个字符😊"
              maxlength="16"
            />
          </div>
          <div class="sex">
            <span>性别：</span>
            <div class="to-right radio">
              <label>
                <input
                  v-model="sex"
                  value="boy"
                  id="boy"
                  name="sex"
                  type="radio"
                />男
              </label>
              <label>
                <input
                  v-model="sex"
                  value="girl"
                  name="sex"
                  id="girl"
                  type="radio"
                />女
              </label>
            </div>
          </div>
          <div class="signature">
            <span>个性签名：</span>
            <input
              class="to-right"
              type="text"
              v-model="signature"
              placeholder="最多30个字符😊"
              maxlength="30"
            />
          </div>
          <div>
            <span>头像：</span>
            <label @change="uploadImg" class="avatar to-right">
              <img v-loading :src="baseURL + userStore.userInfo?.user_avatar" />
              <input ref="avatarFile" type="file" style="display: none" />
            </label>
          </div>
          <div>
            <span>背景图：</span>
            <label @change="uploadImg" class="background to-right">
              <img
                v-loading
                :src="baseURL + userStore.userInfo?.background_img"
                alt=""
              />
              <input ref="bgFile" type="file" style="display: none" />
            </label>
          </div>
          <button @click="updateFormInfo" class="save">保存</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
$item-w: clamp(70px, 15vw, 256px);

.edit {
  display: flex;
  flex-direction: column;
  gap: $main-gap;
  padding: $main-gap;

  @media (max-width: 376px) {
    width: 100vw;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    justify-items: center;
    align-items: center;
    padding: 0 calc($main-gap) 0 calc($main-gap / 2);
    gap: calc($main-gap / 2);
    width: 100%;
    height: 60px;
    background-color: var(--postcard-header-color);
    border-radius: calc($main-gap / 2);
    box-shadow: 0 0 5px var(--aside-shadow);

    .back {
      width: 32px;
      height: 32px;
      font-size: 20px;
      border: none;
      outline: none;
      background-color: transparent;
      color: var(--font-color);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
        animation: change 0.7s ease;
      }

      @keyframes change {
        0% {
          transform: translateX(0) scale(1);
        }

        50% {
          transform: translateX(-5px) scale(1.2);
        }

        100% {
          transform: translateX(0) scale(1.2);
        }
      }
    }
  }

  .main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    justify-content: center;
    padding: $main-gap * 2;
    gap: $main-gap;
    width: 100%;
    height: 100%;
    background-color: var(--postcard-header-color);
    box-shadow: 0 0 4px var(--aside-shadow);
    border-radius: calc($main-gap / 2);
    line-height: 1.5;

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
          transition: all 0.5s ease;
          cursor: pointer;
          animation: light 3s ease infinite;
          &:hover {
            fill: rgb(198, 251, 255);
            transform: rotate(3600deg);
            filter: drop-shadow(0 0 4px var(--font-color));
          }

          @keyframes light {
            0%,
            100% {
              filter: drop-shadow(0 0 0px var(--font-color));
            }

            50% {
              filter: drop-shadow(0 0 4px var(--font-color));
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
      width: 100%;
      max-width: 600px;
      height: 70%;
      border-radius: calc($main-gap / 2);
      padding: $main-gap * 2;
      background-color: var(--postcard-main-color);

      @media (max-width: 376px) {
        padding: 40px 10px;
      }
      
      .form {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: $main-gap * 1.5;

        div {
          display: flex;
          align-items: center;
        }

        input {
          width: 160px;
          text-align: end;
          background-color: transparent;
          border: none;
          outline: none;
          color: var(--font-color);
        }

        label {
          cursor: pointer;
        }

        [type='radio'] {
          width: 12px;
          height: 12px;
          margin-right: 5px;
          appearance: none;
          border: 2px solid;
          transition: all 0.3s ease;
          cursor: pointer;

          &:checked {
            background-color: var(--search-chosen-color);
          }
        }

        .radio {
          display: flex;
          align-items: center;
          gap: $main-gap;
        }

        .to-right {
          margin-left: auto;
        }

        .avatar {
          width: 54px;
          height: 54px;
          border: 2px solid;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
        }

        .background {
          width: 52px;
          height: 52px;
          border: 2px solid;
          // border-radius: 50%;
          overflow: hidden;

          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
        }

        .save {
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
    }

    @media (max-width: 850px) {
      display: flex;
      justify-content: normal;
      flex-direction: column;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
