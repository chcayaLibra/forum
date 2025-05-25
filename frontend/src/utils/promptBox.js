import { createApp } from 'vue'
import PromptBox from '@/components/PromptBox.vue'

/**
//  * 顶部弹框
//  * @param {String} msg 提示用户信息
//  * @param {String} type success / error / normal 三种类型可选，默认normal
 * @param {Object} obj 
 time 弹窗显示时间，默认1500ms，仅当设置了pushPath和pathName显示，请输入正整数;
 pushPath 跳转路径，例如 '/login'; 
 pathName 弹窗路径的显示名称，例如 '登录页'; 
 eventName 要触发的事件名;
 eventParams 事件名所需参数（type: Object)
 pathName和pushPath捆绑，eventParams和eventName捆绑，time仅当设置了以上任意一种事件显示倒计时
 */
function showPrompt(
  msg,
  type = 'normal',
  { time = 1500, pushPath, pathName, eventName, eventParams } = {}
) {
  const messageInstance = createApp(PromptBox)
  const container = document.createElement('div')
  document.body.appendChild(container)
  const message = messageInstance.mount(container)

  if (type && typeof type !== 'string') {
    console.error('type不为string')
    return
  }

  if (time !== 1500) {
    if (Number.isNaN(time) || time === Infinity || typeof time !== 'number') {
      console.error('请输入一个正确的正整数')
      return
    }
    if (parseInt(time / 1000) !== time / 1000) {
      console.error('请输入正整数')
      return
    }
  }

  message.show(msg, type, { time, pushPath, pathName, eventName, eventParams })
  setTimeout(() => {
    container.remove()
  }, time + 1500)
}

export default showPrompt
