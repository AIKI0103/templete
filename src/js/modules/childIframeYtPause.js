/**
 * 要素内のiframeのYoutubeを停止
 * @param {*} elem
 */
export const childIframeYtPause = (elem) => {
  const ytIframes = elem.querySelectorAll('iframe[src*="youtube.com"]')

  // Youtubeがない場合は処理を抜ける
  if (!ytIframes) return

  ytIframes.forEach((iframe) => {
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
  })
}
