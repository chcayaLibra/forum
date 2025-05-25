import { createApp } from 'vue'
import FullScreenImg from '@/components/FullScreenImg.vue'

const imgInstance = createApp(FullScreenImg)
const container = document.createElement('div')
document.body.appendChild(container)
const img = imgInstance.mount(container)

/**
 *
 * @param {String} imgUrl 传入imgURL
 */
function fullScreen(imgUrl) {
  if (imgUrl) {
    img.onFullScreen(imgUrl)
  }
}

export default fullScreen
