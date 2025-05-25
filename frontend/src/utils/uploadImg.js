import showPrompt from '@/utils/promptBox'

/**
 * 上传单图片
 * @param {HTMLElement} node 绑定label标签
 * @returns
 */
export function uploadImg(node) {
  const label = node.target.parentNode
  const img = label.querySelector('img')

  const file = node.target.files[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    showPrompt('非图片格式文件', 'error')
    return
  }

  const imgUrl = URL.createObjectURL(file)
  img.src = imgUrl
}
