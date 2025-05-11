import showPrompt from '@/utils/promptBox'

/**
 * 上传图片
 * @param {HTMLElement} node 绑定label标签
 * @returns
 */
export const uploadImgs = () => {
  const labelParent = document.querySelector('.images-upload')
  const lastLabel = labelParent.children[labelParent.children.length - 1]
  const img = lastLabel.querySelector('img')
  const clone = lastLabel.cloneNode(true)

  const fileInput = lastLabel.querySelector('input')

  if (labelParent.children.length === 10) {
    showPrompt('最多上传9张图片', 'error')
    fileInput.value = ''
    return
  }

  let file = fileInput.files[0]

  if (!file) {
    return
  }
  if (!file.type.startsWith('image/')) {
    showPrompt('非图片格式文件', 'error')
    return
  }
  if (file) {
    const imgUrl = URL.createObjectURL(file)
    img.src = imgUrl
    const add = lastLabel.querySelector('.add')
    const del = lastLabel.querySelector('.del')
    del.addEventListener('click', (e) => {
      e.preventDefault()
      e.target.parentNode.remove()
    })
    add.style.display = 'none'
    del.style.display = 'block'
  }

  labelParent.appendChild(clone)
  clone.addEventListener('change', uploadImgs)
  clone.querySelector('input').value = ''
}
