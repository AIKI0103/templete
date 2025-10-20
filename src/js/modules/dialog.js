import { childIframeYtPause } from './childIframeYtPause'

/** タイアログ
```
<button type="button" command="show-modal" commandfor="el-dialog" class="c-btn">
  <span class="c-btn__label">ダイアログを開く</span>
</button>

<dialog id="el-dialog" closedby="any" aria-labelledby="dialog-heading" autofocus class="c-dialog" title="ダイアログのサンプル（title, id属性は都度変更）">
  <div class="c-dialog__inner" data-dialog="dialog-container">
    <button class="c-dialog__close" command="close" commandfor="el-dialog" aria-label="ダイアログを閉じる" type="button"></button>
    <div class="c-dialog__container">
      <h1 id="dialog-heading" class="c-dialog__heading">ダイアログのサンプル</h1>
      <div class="px-[2rem] py-[4rem] text-center">
        〜〜コンテンツ〜〜
      </div>
    </div>
  </div>
</dialog>
```
 */
export const dialogUi = (dialogNodes, options = { isDefault: false, session: false }) => {
  dialogNodes.forEach((dialog) => {
    // dialogがcloseされた時に、内部のYoutubeを停止
    dialog.addEventListener('close', () => {
      childIframeYtPause(dialog)
    })
  })
}
