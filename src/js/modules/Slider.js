import { Splide } from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

export const initSplide = () => {
  /*
   * Splide
   */
  const splideConfig = {
    type: 'slide',
    classes: {
      // 矢印関連のクラスを追加
      arrows: 'splide__arrows c-splide-arrows',
      arrow: 'splide__arrow c-splide-arrow',
      prev: 'splide__arrow--prev c-splide-arrow--prev',
      next: 'splide__arrow--next c-splide-arrow--next',
      // ページネーション関連のクラスを追加
      pagination: 'splide__pagination c-splide-pagination', // container
      page: 'splide__pagination__page c-splide-pagination__page', // each button
    },
    mediaQuery: 'min',
    noDrag: 'button, span, svg',
    waitForTransition: false,
    rewindSpeed: 1000,
    rewind: true,
    updateOnMove: true,
    trimSpace: true,
    interval: 5000, // 自動再生の間隔
    autoplay: 'pause',
    pagination: true,
    snap: true,
    autoScroll: false,
    arrowPath: 'M1146,871V830.8h40.2V871H1146Zm17.68-29.03h-6.51l11.43,8.932-11.43,8.933h6.51l11.35-8.933Z',
    // arrows: false,
  }

  const splideInstances = {}

  document.querySelectorAll('.splide:not([data-sync-target])')?.forEach((splideItem) => {
    const id = splideItem.id
    const options = { ...splideConfig }
    const mountTiming = splideItem.dataset.mountTiming
    const isAutoplay = splideItem.dataset.autoplay === 'true'
    const syncId = splideItem.dataset.sync

    if (isAutoplay) {
      options.intersection = {
        rootMargin: '2% 0px',
        inView: {
          autoplay: true,
        },
        outView: {
          autoplay: false,
        },
      }
    }

    const splide = new Splide(`#${id}`, options)
    splideInstances[id] = splide
    const Components = splide.Components

    // マウント時
    splide.on('mounted', function () {
      splide.root.querySelectorAll('[aria-busy="true"]')?.forEach((el) => {
        el.setAttribute('aria-busy', 'false')
      })

      // if (splide.length < splide.options.perPage) {
      // }

      if (splide?.options?.autoScroll) {
        const { Autoplay } = Components
        const { pause, play } = Components.AutoScroll

        const scrollPlay = () => {
          Autoplay.play()
          play()
        }

        const scrollPause = () => {
          Autoplay.pause()
          pause()
        }

        scrollPlay()

        splide.on('autoplay:play', (e) => {
          scrollPlay()
        })
        splide.on('autoplay:pause', (e) => {
          scrollPause()
        })
      }
    })

    // オーバーフロー時 [左右をあえて見せるコンテンツでバグるのでコメントアウト]
    splide.on('overflow', function (isOverflow) {
      // スライダーの位置をリセット
      splide.go(0)

      splide.options = {
        arrows: splide.options.arrows && isOverflow,
        pagination: splide.options.pagination && isOverflow,
        drag: splide.options.drag && isOverflow,
        clones: isOverflow ? undefined : splide.options.drag > 0 ? splide.options.drag : 0, // クローンの破棄・再生成
        focus: isOverflow ? splide.options.focus : 'auto',
        type: isOverflow ? splide.options.type : 'slide',
      }
    })

    // リサイズ時
    splide.on('resized', function () {
      const isOverflow = Components.Layout.isOverflow()
      const list = Components.Elements.list
      const lastSlide = Components.Slides.getAt(splide.length - 1)

      if (lastSlide) {
        // `justify-content: center`を適用・除去する
        list.style.justifyContent = isOverflow ? '' : 'center'

        // 最後のmarginを取り除く
        if (!isOverflow) {
          lastSlide.slide.style.marginRight = ''
        }
      }
    })

    if (syncId) {
      const thumbnails = new Splide(`#${syncId}`, {
        ...options,
        ...{
          isNavigation: true,
        },
      })
      splide.sync(thumbnails)
      splide.mount({ Intersection })
      thumbnails.mount({ Intersection })
    }

    if (mountTiming === 'onmount') {
      splide.mount({ Intersection, AutoScroll })
    }
  })
}
