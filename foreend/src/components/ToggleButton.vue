<script setup>
import { ref, watch, nextTick } from 'vue'

const isChosen = ref(true)

const firstBtn = ref()
const secondBtn = ref()

const emit = defineEmits(['event'])

const props = defineProps({
  theme: String
})

nextTick(() => {
  if (props.theme === 'dark') {
    isChosen.value = false
  } else {
    isChosen.value = true
  }
})

watch(
  () => props.theme,
  () => {
    if (props.theme === 'dark') {
      isChosen.value = false
    } else {
      isChosen.value = true
    }
  }
)

const toggle = () => {
  isChosen.value = !isChosen.value
  emit('event', isChosen.value)
}

watch(isChosen, () => {
  if (isChosen.value === true) {
    firstBtn.value.style.pointerEvents = 'none'
    secondBtn.value.style.pointerEvents = 'auto'
  } else {
    firstBtn.value.style.pointerEvents = 'auto'
    secondBtn.value.style.pointerEvents = 'none'
  }
})
</script>

<template>
  <div class="toggle">
    <button ref="firstBtn" @click="toggle()" :class="{ active: isChosen }">
      <slot name="first">按钮1</slot>
    </button>
    <button ref="secondBtn" @click="toggle()" :class="{ active: !isChosen }">
      <slot name="second">按钮2</slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
.toggle {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  border-radius: calc($main-gap / 2);
  overflow: hidden;

  button {
    width: 50%;
    height: 40px;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    background-color: var(--toggle-btn-color);
    cursor: pointer;

    &:nth-child(1) {
      pointer-events: none;
    }

    &:hover {
      background-color: var(--postcard-btn-hover-color);
    }
  }

  .active {
    background-color: var(--search-chosen-color);
  }
}
</style>
