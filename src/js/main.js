/**
 * main.js
 *
 * Webサイトの各種UI操作や機能を管理・初期化するスクリプトです。
 *
 * 主な機能:
 * - マウスオーバー・アウトのインタラクション
 * - ドロップダウンメニュー（ホバー・クリック対応）
 * - フォーム操作や文字列整形のヘルパー関数
 * - アコーディオン、タブ切り替え、ダイアログのUI制御
 * - スクロールトリガーや無限スクロールの実装
 * - スムーススクロールやスクロールヒント
 * - ドロワーメニューの作成とレスポンシブ対応
 * - Splideスライダーの初期化
 *
 * 補足:
 * - ヘルパー機能は、フォームコンテンツがない場合は不要なため、削除をお願いします。
 * - 【任意】と記載された機能は、プロジェクトによっては不要な場合があるため、適宜削除をお願いします。
 * - ドロップダウンメニューは、ホバー展開とクリック展開の2パターンを用意しています。どちらか不要な方は削除をお願いします。
 */

import 'invokers-polyfill'
import 'dialog-closedby-polyfill'
import ScrollHint from 'scroll-hint'

import { AutoSlide } from './modules/autoSlide.js'
import { clickDownUi } from './modules/clickDown.js'
import { detailsUi } from './modules/details.js'
import { dialogUi } from './modules/dialog.js'
import { createDrawer } from './modules/drawer.js'
import { dropDownUi } from './modules/dropDown.js'
import { autoToHalfWidthNum, formBeforeunload, helperCF7, inputKeybindCopyText, Mouseenter, Mouseleave } from './modules/Helper'
import { LogicTab } from './modules/logicTab.js'
import { ScrollTrigger } from './modules/ScrollTrigger.js'
import { initSplide } from './modules/Slider.js'
import { SmoothScroll } from './modules/smoothScroll.js'
import { ViewOver } from './modules/ViewOver.js'

const mqlLg = window.matchMedia('(max-width: 1023px)')
const mqlOverLg = window.matchMedia('(min-width: 1023px)')

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('on-DOMContentLoaded')

  /**
   * マウスオーバー
   */
  const onmouseenterSelector = '[data-onmouseenter]'
  if (document.querySelector(onmouseenterSelector)) {
    const hoverIn = new Mouseenter(onmouseenterSelector, (event) => {
      event.preventDefault()
      const className = event.currentTarget.dataset.onmouseenter
      event.currentTarget.classList.add(className)
      event.currentTarget.classList.add('js-onmouseenter')

      const showContent = event.currentTarget.querySelector('.js-show-content')
      showContent?.setAttribute('aria-hidden', 'false')
    })
    hoverIn.init()
  }

  /**
   * マウスアウト
   */
  const onmouseleaveSelector = '[data-onmouseleave]'
  if (document.querySelector(onmouseleaveSelector)) {
    const hoverOut = new Mouseleave(onmouseleaveSelector, (event) => {
      event.preventDefault()
      const className = event.currentTarget.dataset.onmouseleave

      if (event.currentTarget.classList.contains('js-onmouseenter')) {
        event.currentTarget.classList.remove(className)
        event.currentTarget.classList.remove('js-onmouseenter')

        const showContent = event.currentTarget.querySelector('.js-show-content')
        showContent?.setAttribute('aria-hidden', 'true')
      }
    })
    hoverOut.init()
  }

  /**
   * ヘルパー
   */
  helperCF7('[data-form="cf7"]')
  autoToHalfWidthNum()
  formBeforeunload()
  const inputKeybindCopyTextSelector = '[data-inputCopyText]'
  const inputElements = document.querySelectorAll(inputKeybindCopyTextSelector)
  if (inputElements.length > 0) {
    for (let i = 0; i < inputElements.length; i++) {
      inputKeybindCopyText(inputElements[i])
    }
  }

  /**
   * 【任意】追従ヘッダー
   */
  if (mqlOverLg.matches) {
    ;(() => {
      const cloneTarget = document.querySelector('#header-target')
      const fixedHeader = cloneTarget.cloneNode(true)
      const fixedHeaderWrapper = document.createElement('div')
      fixedHeaderWrapper.classList.add('js-fixedheader', 'js-anchor-offset')
      fixedHeaderWrapper.insertAdjacentElement('beforeend', fixedHeader)
      const h1 = fixedHeaderWrapper.querySelector('h1')
      const ids = fixedHeaderWrapper.querySelectorAll('[id]')
      if (h1) {
        const h1toDiv = document.createElement('div')
        h1toDiv.innerHTML = h1.innerHTML
        const h1Class = h1.className
        if (h1Class) h1toDiv.className = h1Class
        h1.insertAdjacentElement('afterend', h1toDiv)
        h1.parentNode.removeChild(h1)
      }
      if (ids.length) {
        ids.forEach((id) => {
          id.setAttribute('id', 'fixed-' + id.getAttribute('id'))
        })
        // .js-dropdown の子要素の aria-controls を変更
        const dropdowns = fixedHeaderWrapper.querySelectorAll('.js-dropdown')
        dropdowns.forEach((dropdown) => {
          const button = dropdown.querySelector('[aria-expanded][aria-controls]')
          ids.forEach((id) => {
            button.setAttribute('aria-controls', id.getAttribute('id'))
          })
        })
      }
      document.body.insertAdjacentElement('beforeend', fixedHeaderWrapper)
    })()
  }

  /**
   * 【任意】ドロップダウンメニュー：ホバー展開
   */
  const dropDownNodes = document.querySelectorAll('.js-dropdown')
  if (dropDownNodes.length) {
    for (let i = 0; i < dropDownNodes.length; i++) {
      const dropDownNode = dropDownNodes[i]
      dropDownUi(dropDownNode, mqlOverLg)
    }
  }

  /**
   * 【任意】ドロップダウンメニュー：クリック展開
   */
  const clickDownNodes = document.querySelectorAll('.js-clickdown')
  if (clickDownNodes.length && mqlOverLg.matches) {
    for (let i = 0; i < clickDownNodes.length; i++) {
      const clickDownNode = clickDownNodes[i]
      clickDownUi(clickDownNode, mqlLg.matches)
    }
  }

  /**
   * 【任意】detailsを使用したアコーディオン
   */
  if (document.querySelector('details')) {
    detailsUi(document.querySelectorAll('details'))
  }

  /**
   * 【任意】ダイアログ
   */
  const dialogSelector = 'dialog'
  if (document.querySelector(dialogSelector)) {
    dialogUi(document.querySelectorAll(dialogSelector), { isDefault: false, session: false })
  }

  /**
   * 【任意】タブ切り替え
   */
  const tabSelector = '.js-tab'
  if (document.querySelector(tabSelector)) {
    const tabInstance = new LogicTab(tabSelector)
    tabInstance.init()
  }

  /**
   * 【任意】スクロールトリガー
   */
  const stSelector = '.js-scrollTrigger'
  if (document.querySelector(stSelector)) {
    document.querySelectorAll(stSelector).forEach((target) => {
      const st = new ScrollTrigger({
        target,
      })
      st.init()
    })
  }

  /**
   * 【任意】ScrollHint
   */
  const scrollHintSelector = '.js-scrollable'
  if (document.querySelector(scrollHintSelector)) {
    const scrollhint = new ScrollHint(scrollHintSelector, {
      i18n: {
        scrollable: 'Scroll',
      },
    })
  }

  /**
   * 【任意】無限スクロール
   */
  const autoSlideSelector = '.js-autoSlide'
  if (document.querySelector(autoSlideSelector)) {
    const autoSlideInstance = new AutoSlide(autoSlideSelector)
    autoSlideInstance.init()
  }
})

window.addEventListener('load', () => {
  /**
   * ViewOver
   */
  const viewOver = new ViewOver('[data-view-over]')
  viewOver.init()

  /**
   * ドロワーメニュー
   */
  const cloneTarget = document.getElementById('global-menu')
  /* ドロワーのラッパー作成（1024px以上でも表示させる場合は引数に「null」を指定） */
  const drawer = createDrawer(cloneTarget)

  /**
   * スムーススクロール
   */
  const smoothScrollSelector = 'a[href],[data-href]'
  const smoothScroll = new SmoothScroll(smoothScrollSelector, {
    duration: 900,
    offset: '.js-anchor-offset',
    callback: (elem) => {
      drawer.setClose(drawer.drawerElement)
    },
  })
  smoothScroll.init()

  /**
   * 【任意】Splide
   */
  initSplide()
})
