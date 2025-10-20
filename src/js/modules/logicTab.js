/**
 * TabUI - タブ切り替え
 *
 * □機能
 * ・WAI-AREAに対応
 * ・セレクトボックスでの切り替えに対応（タブが多めの時にスマホで便利）
 * ・タブでの切り替え（当たり前）
 *
 * □使い方
 * data-logic="tab-select" は 必要であれば
 * button は aタグ でも可（その場合 data-logic-href は href に変更 type="button" は削除）
 * タブリスト
 *
<div data-logic="tab-root" class="c-tab js-tab">
  <span class="c-form-selectbox">
    <select data-logic="tab-select" aria-label="タブメニュー" name="tabMenu">
      <option label="タブ A" value="#a">タブ A</option>
      <option label="タブ B" value="#b">タブ B</option>
      <option label="タブ C" value="#c">タブ C</option>
      <option label="タブ D" value="#d">タブ D</option>
    </select>
  </span>

  <ul data-logic="tab-tablist" aria-label="タブ" class="c-tab__lists">
    <li role="presentation" class="c-tab__list">
      <button data-logic="tab" data-logic-href="#a" id="tab-a" type="button" class="is-active">タブ A</button>
    </li>
    <li role="presentation" class="c-tab__list">
      <button data-logic="tab" data-logic-href="#b" id="tab-b" type="button">タブ B</button>
    </li>
    <li role="presentation" class="c-tab__list">
      <button data-logic="tab" data-logic-href="#c" id="tab-c" type="button">タブ C</button>
    </li>
    <li role="presentation" class="c-tab__list">
      <button data-logic="tab" data-logic-href="#d" id="tab-d" type="button">タブ D</button>
    </li>
  </ul>

  <div data-logic="contents" class="c-tab__contents">
    <div data-logic="tab-panel" id="a">
      <div>
        <p>
          吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。のみならず顔の真中があまりに突起している。そうしてその穴の中から時々ぷうぷうと煙を
        </p>
      </div>
    </div>
    <div data-logic="tab-panel" id="b">タブパネル B</div>
    <div data-logic="tab-panel" id="c">タブパネル C</div>
    <div data-logic="tab-panel" id="d">タブパネル D</div>
  </div>
</div>
*/
export class LogicTab {
  /**
   * constructor
   * @param {string} targetSelector - Root element selector for tabs
   */
  constructor(targetSelector) {
    this.target = targetSelector
  }

  /**
   * Initialize tabs
   */
  init() {
    const tabRoots = document.querySelectorAll(this.target)
    if (!tabRoots.length) return

    tabRoots.forEach((tabRoot) => {
      const tabList = tabRoot.querySelector('[data-logic="tab-tablist"]')
      const tabs = tabRoot.querySelectorAll('[data-logic="tab"]')
      const select = tabRoot.querySelector('[data-logic="tab-select"]')

      if (!tabList || !tabs.length) return

      // Hide panels initially via JS to prevent FOUC
      tabs.forEach((tab) => {
        const tabPanel = this.getTabPanel(tab)
        tabPanel.style.display = 'none'
      })

      // Set ARIA roles for tab list
      tabList.setAttribute('role', 'tablist')

      tabs.forEach((tab, index) => {
        const tabPanel = this.getTabPanel(tab)

        // Set ARIA attributes for tab and panel
        tab.setAttribute('role', 'tab')
        tab.setAttribute('aria-controls', tabPanel.id)
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1')
        tabPanel.setAttribute('role', 'tabpanel')
        tabPanel.setAttribute('aria-labelledby', tab.id)
        tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true')
        if (index === 0) tabPanel.style.display = 'inherit'

        // Tab click event
        tab.addEventListener('click', (e) => {
          e.preventDefault()
          this.activateTab(tab, tabs, tabPanel)
        })

        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
          this.onKeydown(e, index, tabs)
        })
      })

      // Select dropdown change event
      if (select) {
        select.addEventListener('change', (e) => {
          const selectedTab = tabRoot.querySelector(`[data-logic-href="${e.target.value}"]`)
          if (selectedTab) {
            const tabPanel = this.getTabPanel(selectedTab)
            this.activateTab(selectedTab, tabs, tabPanel)
          }
        })
      }
    })

    this.setDefaultTabForHash()
  }

  /**
   * Activate the selected tab and hide others
   */
  activateTab(selectedTab, tabs, tabPanel) {
    tabs.forEach((tab) => {
      const panel = this.getTabPanel(tab)
      tab.setAttribute('aria-selected', 'false')
      tab.setAttribute('tabindex', '-1')
      tab.classList.remove('is-active')
      tabPanel.setAttribute('aria-hidden', 'false')
      panel.setAttribute('aria-hidden', 'true')
      panel.style.display = 'none'
    })

    selectedTab.setAttribute('aria-selected', 'true')
    selectedTab.setAttribute('tabindex', '0')
    selectedTab.classList.add('is-active')
    tabPanel.setAttribute('aria-hidden', 'false')
    tabPanel.style.display = 'inherit'

    selectedTab.focus()
  }

  /**
   * Handle keyboard navigation
   */
  onKeydown(event, index, tabs) {
    const key = event.key
    let newIndex = index

    if (key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length
    } else if (key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length
    } else if (key === 'Home') {
      newIndex = 0
    } else if (key === 'End') {
      newIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    tabs[newIndex].click()
  }

  /**
   * Get corresponding panel for a tab
   */
  getTabPanel(tab) {
    const selector = tab.getAttribute('data-logic-href') || tab.getAttribute('href')
    return document.querySelector(selector)
  }

  /**
   * Set default tab based on URL hash
   */
  setDefaultTabForHash() {
    const hash = window.location.hash
    if (hash) {
      const defaultTab = document.querySelector(`[data-logic-href="${hash}"]`)
      if (defaultTab) {
        const tabPanel = this.getTabPanel(defaultTab)
        this.activateTab(defaultTab, defaultTab.parentElement.children, tabPanel)
      }
    }
  }
}
