import { createApp } from 'vue'
import ChatPrompt from '@/components/ChatPrompt.vue'
import directives from './directives'

let app = null
let instance = null
const container = document.createElement('div')

/**
 * 
 * @param {String} userId 用户id
 * @param {String} avatar 用户头像
 * @param {String} username 用户名称
 * @param {String} msg 接收的信息
 * @param {String} eventName 触发的事件名
 * @param {String} sender 用于记录跳转chat页面的用户id
 */
export const chatPrompt = (
  userId,
  avatar,
  username,
  msg,
  eventName,
  sender
) => {
  if (!app) {
    app = createApp(ChatPrompt)
    app.directive('loading', directives['loading'])
    app.directive('disableEnter', directives['disableEnter'])
    document.body.appendChild(container)
    instance = app.mount(container)
  }
  instance.saveInfo(userId, avatar, username, msg, eventName, sender)
}

export const removeContainer = () => {
  setTimeout(() => {
    app.unmount()
    container.remove()
    app = null
  }, 500)
}
