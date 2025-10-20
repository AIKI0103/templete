/**
 * AutoSlide
 * 無限自動スライド
 *
 * 基本仕様：
 * - 要素の長さが画面幅より短い場合、画面幅に達する個数+1要素を複製（+1=見切れ対策）※要素の長さが画面幅より長い場合、要素を1つ複製
 * - 要素をアニメーションさせる（data属性のオプションで操作可能）
 * - 再生停止ボタンをクリックするとアニメーションが再生・停止
 * - prefers-reduced-motion: reduceの場合はアニメーションを再生しない
 */

export class AutoSlide {
  /**
   * constructor
   * @param {element} autoSlideSelector
   */
  constructor(autoSlideSelector, mqlSp = 767) {
    this.autoSlides = document.querySelectorAll(autoSlideSelector)
    this.mqlSp = mqlSp
  }

  /**
   * アニメーションを定義
   * @param {element} slideItem
   * @param {number} itemWidth
   * @param {number || null} itemHeight
   * @param {object} setting
   * @param {string || null} type
   */
  initAnimation = (slideItem, itemWidth, itemHeight, setting, type) => {
    if (type === 'row') {
      return slideItem.animate([{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(0, -${itemHeight}px, 0)` }], { ...setting })
    } else {
      return slideItem.animate([{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(-${itemWidth}px, 0, 0)` }], { ...setting })
    }
  }

  /**
   * 同期処理
   * @param {string} slideID
   * @param {string} action ('play' | 'pause')
   */
  sync = (slideID, action) => {
    // data-as-sync属性を持つ全ての要素を取得
    const syncTargets = document.querySelectorAll(`[data-as-sync="${slideID}"]`)

    syncTargets.forEach((sync) => {
      // 再生・停止のクラスの切り替え
      if (action === 'play') {
        sync.classList.add('is-play')
        sync.classList.remove('is-pause')
        // アニメーションを再生
        const animations = sync.querySelectorAll('[data-as="item"]')
        animations.forEach((item) => {
          const anim = item.getAnimations()[0]
          if (anim) anim.play()
        })
      } else if (action === 'pause') {
        sync.classList.add('is-pause')
        sync.classList.remove('is-play')
        // アニメーションを停止
        const animations = sync.querySelectorAll('[data-as="item"]')
        animations.forEach((item) => {
          const anim = item.getAnimations()[0]
          if (anim) anim.pause()
        })
      }
    })
  }

  /**
   * 「動きを減らす」設定が有効かどうか
   * prefers-reduced-motion: reduce
   */
  isReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * 初期化
   */
  init = () => {
    this.autoSlides.forEach((autoSlide) => {
      const slideItems = autoSlide.querySelectorAll('[data-as="item"]')
      const slideControls = autoSlide.querySelectorAll('[data-as="control"]')
      const slideID = autoSlide.getAttribute('id')
      // const type = window.matchMedia('(max-width: 1023px)').matches ? null : autoSlide.dataset.asType || null
      const type = autoSlide.dataset.asType
      let durationMq = Number(autoSlide.dataset.asDuration) || 50000
      if (autoSlide.dataset.asDurationSp && window.matchMedia(`(max-width: ${this.mqlSp}px)`).matches) {
        durationMq = Number(autoSlide.dataset.asDurationSp)
      }

      const config = {
        delay: Number(autoSlide.dataset.asDelay) || 0, // Number
        duration: durationMq, // Number
        iterations: Number(autoSlide.dataset.asIterations) || 'Infinity', // 'Infinity' || Number
        easing: autoSlide.dataset.asEasing || 'linear', // 'linear' || 'ease' || 'ease-in' || 'ease-out' || 'ease-in-out' || 'cubic-bezier()'
        direction: autoSlide.dataset.asDirection || 'normal', // 'alternate' || 'reverse' || 'alternate-reverse' || 'normal'
        fill: autoSlide.dataset.asFill || 'none', // 'forwards' || 'backwards' || 'both' || 'none'
      }

      const animations = []

      const play = (target, itemWidth, itemHeight) => {
        if (this.isReducedMotion()) return
        const animation = this.initAnimation(target, itemWidth, itemHeight, config, type)
        animations.push(animation)
        animation.play()
      }

      slideItems.forEach((slideItem) => {
        // 画面幅より要素の長さが短い場合
        if (type !== 'row' && document.documentElement.clientWidth - slideItem.scrollWidth * slideItems.length >= 0) {
          // 画面幅に達する個数+1要素を複製（+1=見切れ対策）
          for (let i = 0; i <= slideItems.length + 1; i++) {
            const cloneTargetNode = slideItem.cloneNode(true)
            slideItem.insertAdjacentElement('afterend', cloneTargetNode)
            play(cloneTargetNode, cloneTargetNode.scrollWidth, cloneTargetNode.scrollHeight)
          }
        } else {
          const cloneTargetNode = slideItem.cloneNode(true)
          slideItem.insertAdjacentElement('afterend', cloneTargetNode)
          play(cloneTargetNode, cloneTargetNode.scrollWidth, cloneTargetNode.scrollHeight)
        }

        play(slideItem, slideItem.scrollWidth, slideItem.scrollHeight)
      })

      // 再生停止処理
      slideControls.forEach((slideControl) => {
        slideControl.addEventListener('click', () => {
          if (autoSlide.classList.contains('is-play')) {
            autoSlide.classList.remove('is-play')
            autoSlide.classList.add('is-pause')
            slideControl.classList.add('is-deactive')
            slideControl.classList.remove('is-active')
            slideControl.setAttribute('aria-label', 'スライドを再生')
            this.sync(slideID, 'pause') // スライドの同期
            animations.forEach((anim) => anim.pause())
          } else if (autoSlide.classList.contains('is-pause')) {
            autoSlide.classList.remove('is-pause')
            autoSlide.classList.add('is-play')
            slideControl.classList.add('is-active')
            slideControl.classList.remove('is-deactive')
            slideControl.setAttribute('aria-label', 'スライドを停止')
            animations.forEach((anim) => anim.play())
            this.sync(slideID, 'play') // スライドの同期
          }
        })

        slideControl.classList.add('is-active')
        slideControl.setAttribute('aria-label', 'スライドを停止')
      })

      autoSlide.classList.add('is-play')
      this.sync(slideID, 'play') // スライドが最初に再生状態で同期
    })
  }
}
