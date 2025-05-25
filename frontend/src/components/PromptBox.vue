<script setup>
import router from '@/router'
import { ref } from 'vue'

const timerCount = ref(null)
const tip = ref(null)
const xValue = ref()

const message = ref('')
const types = ref('')
const timer = ref(null)
const path = ref('')
const pName = ref('')
const eName = ref('')
const eParams = ref('')
const count = ref()

function boxDisappearAnimate() {
  xValue.value = getComputedStyle(tip.value).getPropertyValue('--x')

  tip.value.animate(
    [
      {
        transform: `translateX(${xValue.value}) translateY(0)`
      },
      {
        transform: `translateX(${xValue.value}) translateY(-70px)`
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
let flag = true
function show(
  msg,
  type = 'normal',
  { time = 1500, pushPath, pathName, eventName, eventParams } = {}
) {
  types.value = type
  message.value = msg
  path.value = pushPath
  pName.value = pathName
  eName.value = eventName
  eParams.value = eventParams
  fn = eName.value

  if (time !== 1500) {
    if ((pushPath && pathName) || eventName) {
      count.value = time / 1000

      if (timerCount.value) clearInterval(timerCount.value)
      timerCount.value = setInterval(() => {
        if (count.value > 0) {
          count.value--
        } else {
          count.value = 0
          clearInterval(timerCount.value)
        }
      }, 1000)
    }
  }

  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    if (flag) boxDisappearAnimate()
    flag = true
  }, time)
}

const execute = () => {
  if (flag) {
    eParams.value ? fn(eParams.value) : fn()
  }
  flag = false
  boxDisappearAnimate()
}

const routerPush = () => {
  router.push(path.value)
  flag = false
  boxDisappearAnimate()
}

defineExpose({
  show
})
</script>

<template>
  <div ref="tip" :class="types" class="box">
    {{ message }}
    <span class="to-path" @click="routerPush">{{ pName }} </span>
    <span class="to-path" v-if="count && pName" @click="routerPush"
      >（{{ count }}）
    </span>
    <span class="to-event" v-if="eName" @click="execute">确定</span>
    <span class="to-event" v-if="count && eName" @click="execute"
      >（{{ count }}）
    </span>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.box {
  --x: calc(-50% + 35px);
  margin: 0 auto;
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 300;
  transform: translateX(calc(-50% + 35px));
  padding: 0 $main-gap;
  border-radius: calc($main-gap / 2);
  box-shadow: 0 0 5px var(--aside-shadow);
  width: auto;
  min-width: 40px;
  // height: 40px;
  line-height: 45px;
  white-space: nowrap;
  color: rgb(0, 0, 0);
  font-weight: 400;
  animation: appear 0.7s ease forwards;

  .to-path,
  .to-event {
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }

  @keyframes appear {
    from {
      transform: translateX(calc(-50% + 35px)) translateY(-65px);
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
        transform: translateX(-50%) translateY(-65px);
      }

      to {
        transform: translateX(-50%) translateY(0);
      }
    }
  }
}

.success {
  background-color: rgb(180, 232, 180);
}

.error {
  background-color: rgb(236, 164, 164);
}

.normal {
  background-color: #fff;
}
</style>
