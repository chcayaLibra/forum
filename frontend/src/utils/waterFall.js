/**
 *
 * @param {Object} 传入对象
 * {
 *  minGap: Number,
 *  cards: HtmlElementArray,
 *  cardWidth: Number,
 *  container: HtmlElement
 * }
 */
export function waterFall(opt) {
  const defaultOption = {
    minGap: 10,
    cards: [],
    cardWidth: 300,
    container: opt.container
  }
  const option = Object.assign({}, defaultOption, opt)

  handleParent()
  setCardPosition()

  function setCardPosition() {
    const info = getHorizonTallInfo()
    const arr = new Array(info.number)

    arr.fill(0)

    for (let i = 0; i < option.cards.length; i++) {
      option.cards[i].style.transition = '.5s'
      option.cards[i].style.position = 'absolute'

      const minTop = Math.min(...arr)

      if (info.number > 1) {
        option.cards[i].style.top = `${minTop}px`
      }

      if (info.number === 1) {
        if (i === 0) {
          option.cards[i].style.top = '0px'
        } else {
          let temp = 0
          for (let j = 1; j <= i; j++) {
            temp += option.cards[j - 1].clientHeight
          }
          option.cards[i].style.top = `${temp + i * 2 * option.minGap}px`
        }
      }

      const index = arr.indexOf(minTop)
      arr[index] += option.cards[i].clientHeight + info.gap + option.minGap

      option.cards[i].style.left = `${
        info.gap + index * (option.cardWidth + info.gap) + option.minGap / 2
      }px`
    }

    const maxTop = Math.max(...arr)
    if (info.number === 1) {
      let temp = 0
      for (let i = 0; i < option.cards.length; i++) {
        temp += option.cards[i].clientHeight
      }
      option.container.style.height = `${
        temp + option.cards.length * option.minGap * 2
      }px`
    } else {
      option.container.style.height = `${maxTop + option.minGap}px`
    }
  }

  function getHorizonTallInfo() {
    const obj = {}
    obj.containerWidth = option.container.clientWidth

    obj.number = Math.floor(
      (obj.containerWidth + option.minGap) / option.cardWidth
    )

    if (obj.number >= 1) {
      obj.gap =
        (obj.containerWidth - obj.number * option.cardWidth) / (obj.number + 1)
    }

    return obj
  }

  function handleParent() {
    const style = getComputedStyle(option.container)
    if (style.position === 'static') {
      option.container.style.position = 'relative'
    }
  }
}
