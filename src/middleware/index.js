import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()
  let html = await response.text()

  // class または className 属性内の & と > をエスケープ
  html = html.replace(/class="[^"]+"/g, function (match) {
    return match.replace(/>/g, '&gt;')
  })

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  })
})
