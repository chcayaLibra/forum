<script setup>
import { ref, watchEffect } from 'vue'
import router from '@/router'
import fullScreen from '@/utils/fullScreenImg'
import ImgBox from '@/components/ImgBox.vue'
import {
  postCollectAddService,
  postCollectDelService,
  postUpdateViewService
} from '@/api/post'
import { lineBreakReplace } from '@/utils/regular'
import { useUserStore, usePostStore } from '@/stores'
import { baseURL } from '@/utils/request'
import showPrompt from '@/utils/promptBox'
import { useRoute } from 'vue-router'
import {
  userPostDelService,
  userPostPrivateService,
  userPostPublicService
} from '@/api/user'
import FollowButton from '@/components/FollowButton.vue'

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()

const images = ref()

const viewCount = ref(0)
const collectCount = ref(0)
const isShowFollowBtn = ref(false)
const isCollect = ref('')
const isPublic = ref(true)

const color = {
  focus: '#ffea00',
  blur: 'transparent'
}
const collectedColor = ref(color.blur)

const props = defineProps({
  post: Object,
  userCollectPidList: Array
})

const setPublicState = () => {
  if (props.post.is_public === 'false') {
    isPublic.value = false
  } else {
    isPublic.value = true
  }
}
setPublicState()

const setCollectState = () => {
  if (props.userCollectPidList.includes(props.post.p_id)) {
    collectedColor.value = color.focus
  } else {
    collectedColor.value = color.blur
  }
}
viewCount.value = props.post.p_view_count
images.value = JSON.parse(props.post.p_images)

watchEffect(() => {
  setCollectState()
  collectCount.value = props.post.p_collect_count
  isCollect.value = props.userCollectPidList.includes(props.post.p_id)
})

let flag = true
async function onCollect() {
  if (!flag) return
  flag = false
  if (!userStore.userId) {
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
  if (isCollect.value) {
    isCollect.value = false
    await postCollectDelService({
      user_id: userStore.userId,
      p_id: props.post.p_id
    })
    await userStore.getUserCollectPidList()
    showPrompt('已取消收藏', 'success')
    postStore.subCollectCount(props.post.p_id)
    collectedColor.value = color.blur
  } else {
    isCollect.value = true
    await postCollectAddService({
      user_id: userStore.userId,
      p_id: props.post.p_id
    })
    await userStore.getUserCollectPidList()
    showPrompt('收藏成功', 'success')
    postStore.addCollectCount(props.post.p_id)
    collectedColor.value = color.focus
  }
  flag = true
}

async function navigateToPostDetail(e, id) {
  if (route.path.startsWith('/post/')) return
  if (e.target.tagName === 'IMG') return
  await postUpdateViewService(id)
  await postStore.getPostDetail(id)
  postStore.addPostViewCount(props.post.p_id)
  const url = route.fullPath
  const newUrl = url.replace(/\?event.*$/, '')
  router.push(`/post/${id}?redirect=${newUrl}`)
}

const isCurrentUser = () => {
  if (props.post.user_id !== userStore.userId) {
    isShowFollowBtn.value = true
  }
}
isCurrentUser()

let delFlag = true
const emit = defineEmits(['updateListAfterDel'])
function beforeDelPost(p_id) {
  if (delFlag) {
    delFlag = false
    showPrompt('是否删除帖子', 'error', {
      time: 5000,
      eventName: afterDelPost,
      eventParams: {
        user_id: userStore.userId,
        p_id
      }
    })
    setTimeout(() => {
      delFlag = true
    }, 5100)
  }
}
async function afterDelPost(data) {
  await userPostDelService(data)
  postStore.delPost(props.post.p_id)
  showPrompt('删除成功', 'success')
  emit('updateListAfterDel')
  userStore.getUserCollectPidList()
}

const back = () => {
  const url = router.currentRoute.value.query.redirect
  if (url) {
    const newUrl = url.replace(/\?event.*$/, '')
    router.push(newUrl)
  } else {
    router.push('/post')
  }
}

let publicFlag = true
function beforeOnPublic(p_id) {
  if (publicFlag) {
    publicFlag = false
    showPrompt('是否转为公开', 'error', {
      time: 5000,
      eventName: afterOnPublic,
      eventParams: {
        p_id
      }
    })
    setTimeout(() => {
      publicFlag = true
    }, 5100)
  }
}
async function afterOnPublic({ p_id }) {
  await userPostPublicService(p_id)
  showPrompt('已设置为公开', 'success')
  postStore.updatePublicState(p_id, 'true')
  isPublic.value = true
}

let privateFlag = true
function beforeOnPrivate(p_id) {
  if (privateFlag) {
    privateFlag = false
    showPrompt('是否转为非公开', 'error', {
      time: 5000,
      eventName: afterOnPrivate,
      eventParams: {
        p_id
      }
    })
    setTimeout(() => {
      privateFlag = true
    }, 5100)
  }
}
async function afterOnPrivate({ p_id }) {
  await userPostPrivateService(p_id)
  showPrompt('已设置为非公开', 'success')
  postStore.updatePublicState(p_id, 'false')
  isPublic.value = false
}

function navigateToFollowCard() {
  if (route.path.startsWith(`/follow/${props.post?.user_id}`)) {
    return
  }
  sessionStorage.setItem(`/follow/${props.post?.user_id}`, 0)
  router.push(`/follow/${props.post?.user_id}?redirect=${route.fullPath}`)
}
</script>

<template>
  <div class="card">
    <div class="header">
      <button v-if="$slots.back" class="back" @click="back">
        <slot name="back"></slot>
      </button>
      <img
        v-loading
        @click="fullScreen(props.post?.user_avatar)"
        :src="baseURL + props.post?.user_avatar"
      />
      <span @click="navigateToFollowCard" class="username">{{
        props.post?.username
      }}</span>
      <follow-button
        :isFollow="userStore.userFollowList.includes(props.post?.user_id)"
        :followId="props.post?.user_id"
        class="follow"
        v-if="isShowFollowBtn && userStore.userFollowList.length"
      ></follow-button>
      <div
        v-if="
          route.path === '/user' && props.post?.user_id === userStore.userId
        "
        class="to-right"
      >
        <div @click="beforeDelPost(props.post?.p_id)" class="icon" title="删除">
          <svg
            t="1743340610620"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5662"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
          >
            <path
              d="M896 256a21.333333 21.333333 0 0 1 21.333333 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-85.333333v469.333334c0 47.530667-40.96 83.114667-89.322667 85.226666L716.8 896H307.2c-48.768 0-91.221333-34.133333-93.738667-80.917333L213.333333 810.666667V341.333333H128a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333h768z m-170.666667 85.333333H298.666667v466.965334l0.853333 0.597333a14.592 14.592 0 0 0 5.418667 1.642667L307.2 810.666667h409.6a15.893333 15.893333 0 0 0 7.68-1.770667l0.853333-0.618667V341.333333z m-277.333333 106.666667a21.333333 21.333333 0 0 1 21.333333 21.333333v213.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333V469.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667z m170.666667 0a21.333333 21.333333 0 0 1 21.333333 21.333333v213.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333V469.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667z m0-320a21.333333 21.333333 0 0 1 21.333333 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333H405.333333a21.333333 21.333333 0 0 1-21.333333-21.333333V149.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h213.333334z"
              p-id="5663"
            ></path>
          </svg>
        </div>
        <div
          @click="beforeOnPublic(props.post?.p_id)"
          v-if="!isPublic"
          class="icon"
          title="未公开"
        >
          <svg
            t="1743581564331"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4337"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
          >
            <path
              d="M748.8 864 275.2 864c-32 0-57.6-25.6-57.6-57.6L217.6 512c0-32 32-57.6 57.6-57.6l467.2 0c38.4 0 57.6 25.6 57.6 57.6l0 294.4C806.4 838.4 780.8 864 748.8 864z"
              p-id="4338"
            ></path>
            <path
              d="M364.8 422.4 364.8 339.2c0-70.4 51.2-121.6 121.6-121.6l51.2 0c64 0 121.6 51.2 121.6 121.6l0 83.2 57.6 0L716.8 339.2c0-102.4-83.2-179.2-179.2-179.2L486.4 160c-102.4 0-179.2 83.2-179.2 179.2l0 83.2L364.8 422.4z"
              p-id="4339"
            ></path>
          </svg>
        </div>
        <div
          @click="beforeOnPrivate(props.post?.p_id)"
          v-if="isPublic"
          class="icon"
          title="公开"
        >
          <svg
            t="1743841194201"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5183"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
          >
            <path
              d="M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z"
              p-id="5184"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div
      class="main"
      @click="
        (e) => {
          navigateToPostDetail(e, props.post?.p_id)
        }
      "
    >
      <div
        v-if="
          route.path === '/post' ||
          route.path === '/user' ||
          route.path.startsWith('/follow')
        "
        v-html="lineBreakReplace(props.post?.p_content)"
        class="text"
      ></div>
      <div
        v-if="route.path.startsWith('/post/')"
        v-html="lineBreakReplace(props.post?.p_content)"
        class="textAll"
      ></div>
      <div v-if="images.length" class="pic">
        <img-box :images></img-box>
      </div>
    </div>
    <div class="footer">
      <div class="view icon" title="浏览量">
        <svg
          t="1742132824257"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11848"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="32"
          height="32"
        >
          <path
            d="M381.8 1024c-30 0-60.2-7.5-87.9-22.6-61.8-33.8-100.1-99.7-100.1-171.9 0-23.6 19.1-45.3 42.7-45.3s42.7 16.4 42.7 39.9v5.4c0 41 21.4 78.2 55.7 97.1 33.5 18.2 73.6 15.6 104.8-6.9l439.2-317.5c28.1-20.4 44.9-54.1 44.9-90.2s-16.8-69.8-44.9-90.2L439.5 104.4c-31.1-22.5-71.2-25.2-104.8-6.9-34.4 18.8-55.7 56-55.7 97.1v159c0 3.8-0.5 97.6-65 162.3-39 39.2-91.6 59-156.3 59-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c41.7 0 73.1-11.1 95.9-33.9 39.2-39.3 40.1-101.4 40.1-101.9V194.6c0-72.2 38.4-138.1 100.1-171.9 62.6-34.3 137.6-29.4 195.7 12.5l439.2 317.4c50.2 36.4 80.2 96 80.2 159.3s-30 122.9-80.2 159.3L489.5 988.8c-32.3 23.4-69.9 35.2-107.7 35.2z"
            p-id="11849"
          ></path>
        </svg>
        <span>{{ props.post.p_view_count }}</span>
      </div>
      <div @click="onCollect" class="collection icon hover" title="收藏">
        <svg
          t="1742132865803"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="12898"
          width="32"
          height="32"
          id="svg1"
        >
          <path
            d="M563.83 796.296l150.362 79.05a32 32 0 0 0 20.3 3.215c17.419-2.987 29.118-19.53 26.13-36.949l-28.716-167.43a112 112 0 0 1 32.21-99.134l121.645-118.574a32 32 0 0 0 9.331-18.313c2.542-17.49-9.576-33.728-27.066-36.27l-168.108-24.427a112 112 0 0 1-84.33-61.269l-75.18-152.332a32 32 0 0 0-14.533-14.534c-15.849-7.821-35.037-1.314-42.858 14.534l-75.18 152.332a112 112 0 0 1-84.33 61.269L155.4 401.892a32 32 0 0 0-18.314 9.33c-12.336 12.656-12.077 32.916 0.579 45.252l121.644 118.574a112 112 0 0 1 32.211 99.135l-28.716 167.43a32 32 0 0 0 3.215 20.3c8.224 15.643 27.572 21.657 43.215 13.433l150.361-79.05a112 112 0 0 1 104.237 0z m-67.008 70.81l-150.362 79.05c-54.75 28.785-122.468 7.735-151.252-47.016a112 112 0 0 1-11.254-71.051l28.717-167.43a32 32 0 0 0-9.204-28.324L81.823 513.76c-44.294-43.176-45.2-114.085-2.025-158.38a112 112 0 0 1 64.097-32.658l168.108-24.428a32 32 0 0 0 24.094-17.505l75.181-152.332c27.375-55.469 94.533-78.243 150.002-50.867a112 112 0 0 1 50.867 50.867l75.18 152.332a32 32 0 0 0 24.094 17.505l168.11 24.428c61.212 8.895 103.625 65.728 94.73 126.941a112 112 0 0 1-32.659 64.097L819.957 632.335a32 32 0 0 0-9.203 28.324l28.717 167.43c10.456 60.965-30.49 118.864-91.455 129.32a112 112 0 0 1-71.052-11.253l-150.36-79.05a32 32 0 0 0-29.782 0z"
            p-id="12899"
            id="path1"
          />
          <path
            d="M 8.9987069,27.436372 C
      8.936985,27.424205 8.8148638,27.376075 8.7273266,27.329419
      8.4547329,27.184128 8.2771768,26.930186 8.2247299,26.6106 c
      -0.024287,-0.147989 0.00628,-0.346271 0.4541,-2.945851 0.4746265,-2.75518
      0.4801523,-2.79171 0.481274,-3.181594 0.00171,-0.595182
      -0.1132995,-1.084327 -0.3765162,-1.601319 -0.2674211,-0.52525
      -0.3359135,-0.598708 -2.7227965,-2.920173 -1.7560685,-1.70794
      -1.8432561,-1.796617 -1.9378263,-1.970925 -0.082547,-0.152148
      -0.08681,-0.173566 -0.08681,-0.436095 0,-0.249337 0.00715,-0.290657
      0.073826,-0.426428 0.1000889,-0.203822 0.2741402,-0.376095
      0.4724417,-0.467615 0.1756098,-0.08105 -0.1011081,-0.03769
      4.291859,-0.67251 1.4069414,-0.203315 1.7046794,-0.263064
      2.0864044,-0.418692 0.609553,-0.248512 1.178952,-0.717427
      1.558156,-1.283181 0.08915,-0.133015 0.301172,-0.5258226
      0.471148,-0.8729056 0.169976,-0.347083 0.654529,-1.3291701
      1.076785,-2.1824158 C 14.489029,6.37765 14.91092,5.5239722
      15.004309,5.333834 15.141624,5.0542624 15.201542,4.9621815
      15.317518,4.8524959 15.535744,4.6461068 15.65433,4.6016477
      15.986853,4.6015556 c 0.250356,-6.94e-5 0.290305,0.0069 0.428615,0.074819
      0.328046,0.1610824 0.274166,0.067831 1.635477,2.830566 0.679704,1.3794372
      1.293609,2.5975014 1.364234,2.7068084 0.502175,0.77723 1.263124,1.322522
      2.131493,1.527416 0.116463,0.02748 1.438596,0.228204 2.938074,0.446054
      1.499478,0.217851 2.765542,0.409472 2.813475,0.425824 0.131678,0.04492
      0.342626,0.186472 0.427517,0.286873 0.04158,0.04917 0.111151,0.165143
      0.154614,0.257715 0.145282,0.309439 0.101888,0.694573 -0.109355,0.970558
      -0.05301,0.06926 -0.983815,0.99086 -2.06845,2.048 -1.084634,1.057139
      -2.032675,1.99721 -2.106757,2.089046 -0.367386,0.455431 -0.632067,1.038307
      -0.732525,1.613154 -0.04784,0.273775 -0.05483,0.844761 -0.01355,1.108601
      0.01547,0.0989 0.230057,1.357135 0.47686,2.796083 0.364339,2.124223
      0.446303,2.647443 0.435812,2.78202 -0.02669,0.342342 -0.293299,0.699392
      -0.611,0.818259 -0.334124,0.125012 -0.580821,0.09353 -0.993304,-0.126751
      -0.59541,-0.317974 -4.317937,-2.270455 -4.554134,-2.388664
      -0.338443,-0.169378 -0.582742,-0.256324 -0.901004,-0.320666
      -0.677111,-0.136889 -1.360517,-0.07914 -1.990542,0.168194
      -0.121101,0.04754 -0.478466,0.222397 -0.794146,0.388566 -3.659817,1.926477
      -4.3492276,2.282546 -4.4908054,2.319422 -0.1701929,0.04433
      -0.2562484,0.04692 -0.4287397,0.01292 z"
            id="path3"
            transform="translate(-30, -30) scale(34)"
            :fill="collectedColor"
          />
        </svg>
        <span>{{ collectCount }}</span>
      </div>
      <div class="share icon hover" title="分享">
        <svg
          t="1742132893278"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="13889"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20"
          height="20"
        >
          <path
            d="M978.359727 445.198908c-25.076263 0-45.546682 20.982179-44.52316 46.058442 0.51176 6.652886 0.51176 13.817533 0.51176 20.470419 0 240.527421-202.145386 434.9964-445.74337 422.202388-214.427637-11.25873-387.914437-184.74553-399.173167-399.173167-12.794012-243.597984 181.163207-445.74337 422.202388-445.74337 6.652886 0 13.817533 0 20.470419 0.511761 25.076263 1.023521 46.058442-18.935137 46.058443-44.523161 0-24.052742-18.935137-43.49964-42.98788-44.523161-25.588024-1.023521-52.199568-0.51176-78.811112 2.558802C209.695501 29.137645 15.226522 232.818313 0.897229 481.022141c-17.911616 307.056282 234.898056 560.377715 542.466099 541.954338 248.203828-14.841054 451.372735-208.798272 477.472519-455.978579 2.558802-26.611544 3.582323-52.711328 2.558802-78.811113-2.047042-24.052742-21.49394-42.98788-45.034922-42.987879z"
            p-id="13890"
          ></path>
          <path
            d="M1017.253523 194.948038l-89.046322 154.039901c-12.282251 21.49394-39.405556 28.658586-60.899496 16.376335-10.74697-6.141126-17.911616-15.864575-20.470418-27.123304-3.070563-11.25873-1.535281-23.029221 4.605844-33.776192l38.893796-67.552382c-335.714869 51.687808-347.99712 325.99142-347.99712 337.761911-0.51176 22.0057-18.935137 39.917317-40.940838 39.917317h-1.023521c-22.517461-0.51176-40.429077-19.446898-39.917317-41.964359 0-3.582323 2.558802-93.652166 57.828933-189.863135 48.617245-84.952238 147.387016-190.886656 346.461839-225.174607l-62.434777-35.823233c-21.49394-12.282251-28.658586-39.405556-16.376335-60.899496 6.141126-10.74697 15.864575-17.911616 27.123305-20.982179 11.25873-3.070563 23.029221-1.535281 33.776191 4.605844L1000.877188 133.536781c10.74697 6.141126 17.911616 15.864575 20.982179 27.123305 3.070563 11.25873 1.535281 23.540982-4.605844 34.287952z"
            p-id="13891"
          ></path>
        </svg>
        <span>{{ props.post?.p_share_count }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.card {
  border-radius: calc($main-gap / 2);
  box-shadow: 0 0 5px var(--aside-shadow);
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    padding: 0 $main-gap;
    gap: calc($main-gap / 2);
    width: 100%;
    height: 60px;
    background-color: var(--postcard-header-color);

    .to-right {
      display: flex;
      justify-content: center;
      gap: calc($main-gap / 2);

      margin-left: auto;
      cursor: pointer;
    }

    img {
      width: 32px;
      height: 32px;
      aspect-ratio: 1;
      border-radius: 50%;
      cursor: pointer;
      // background: var(--loading-bg-color);
    }

    .username {
      cursor: pointer;
    }

    .back {
      width: 30px;
      height: 30px;
      border: none;
      outline: none;
      border-radius: calc($main-gap / 2);
      transition: all 0.3s ease;
      background-color: var(--postcard-btn-color);
      cursor: pointer;

      &:hover {
        background-color: var(--postcard-btn-hover-color);
      }
    }

    .follow {
      width: 60px;
      height: 30px;
      margin-left: auto;
      border: none;
      outline: none;
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
    display: flex;
    flex-direction: column;
    gap: $main-gap;
    padding: $main-gap;
    width: 100%;
    // height: 380px;
    background-color: var(--postcard-main-color);

    .text {
      $line: 9;
      display: -webkit-box;
      // height: 220px;
      line-height: 1.5;
      overflow: hidden;
      -webkit-line-clamp: $line;
      -webkit-box-orient: vertical;
      line-clamp: $line;
      text-overflow: ellipsis;
      // background-color: #614f4f;
    }

    .textAll {
      line-height: 1.5;
    }
  }

  .footer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-items: center;
    gap: $main-gap;
    width: 100%;
    height: 60px;
    background-color: var(--postcard-footer-color);

    .hover {
      cursor: pointer;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    gap: calc($main-gap / 2.5);

    svg {
      width: 20px;
      height: 20px;
      fill: var(--font-color);
      transition: all 0.3s ease;
      &:hover {
        filter: drop-shadow(0 0 1px var(--font-color));
      }
    }
  }
}
</style>
