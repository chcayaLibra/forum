import showPrompt from '@/utils/promptBox'

/**
 * 上传图片
 * @param {HTMLElement} node 绑定label标签
 * @returns
 */
export const uploadImg = (node) => {
  const label = node.target.parentNode
  const img = label.querySelector('img')

  const file = node.target.files[0]

  if (file && !file.type.startsWith('image/')) {
    showPrompt('非图片格式文件', 'error')
    return
  }
  if (file) {
    const imgUrl = URL.createObjectURL(file)
    img.src = imgUrl
  }
}
