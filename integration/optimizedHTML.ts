import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'

import type { AstroIntegration } from 'astro'
import { globSync } from 'glob'


/*

*/
function replaceSrcsetPath(html: string, replaceTxt: string) {
  // replaceTxtの末尾がスラッシュであれば、それを取り除く
  const adjustedReplaceTxt = replaceTxt.endsWith('/') ? replaceTxt.slice(0, -1) : replaceTxt

  // srcset属性を見つけ、その値内で置換を行う
  return html.replace(/srcset="([^"]*)"/g, function (match, srcsetValue) {
    // srcset値内で、replaceTxtで始まらない最初の / と、カンマの後の / を置換する
    const regex = new RegExp(`(\\s|^)(?!${adjustedReplaceTxt})(\/[^,]*)(,|$)`, 'g')
    return `srcset="${srcsetValue.replace(regex, `$1${adjustedReplaceTxt}$2$3`)}"`
  })
}



const optimizeHtmlText = (BASE_PATH: string, htmlText: string): string => {
  let content = htmlText
  content = String(content).replace(/<link(?![^>]*id)[^>]*href="[^"]*utility-tailwind\.css"[^>]*\/?>/g, '')

  // 絶対パスをBASE_PATHで置き換える
  const absolutePathRegex = new RegExp(`src="/(?!${BASE_PATH.slice(1)})`, 'g')
  content = content.replace(absolutePathRegex, `src="${BASE_PATH}`)

  content = replaceSrcsetPath(content, BASE_PATH)

  const hrefAbsolutePathRegex = new RegExp(`href="/(?!${BASE_PATH.slice(1)})`, 'g')
  content = content.replace(hrefAbsolutePathRegex, `href="${BASE_PATH}`)

  const urlAbsolutePathRegex = new RegExp(`url\\("/(?!${BASE_PATH.slice(1)})`, 'g')
  content = content.replace(urlAbsolutePathRegex, `url("${BASE_PATH}`)

  return content
}

export default function optimizedHTML(BASE_PATH: string): AstroIntegration {
  return {
    name: 'optimizedHTML',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        try {
          const outDirPath = fileURLToPath(dir)

          globSync(`${outDirPath}**/*.html`)?.forEach((filePath) => {
            const htmlText = readFileSync(filePath).toString()
            const redactedHtml = optimizeHtmlText(BASE_PATH, htmlText)
            writeFileSync(filePath, redactedHtml)
          })
        } catch (e) {
          console.log(e)
        }
      },
    },
  }
}
