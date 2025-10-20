import fs from 'fs/promises'

import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import optimizedHTML from './integration/optimizedHTML.ts'
import { base, siteConfig } from './site.config.mjs'
export const BASE_PATH = process.env.NODE_ENV === 'development' ? base.development : process.env.NODE_ENV === 'local' ? base.local : base.production

// https://astro.build/config
export default defineConfig({
  site: `${siteConfig.siteUrl}${BASE_PATH}`,
  base: BASE_PATH,
  outDir: `./dist${BASE_PATH}`,
  compressHTML: false,
  trailingSlash: 'always',
  server: ({ command }) => ({
    port: command === 'dev' ? 3000 : 4000,
    open: true,
    host: true,
  }),
  build: {
    assets: 'assets',
    inlineStylesheets: 'never',
    // ビルド前にdistフォルダを空にする
    hooks: {
      'astro:build:start': async () => {
        try {
          await fs.rm('./dist', { recursive: true, force: true })
          console.log('dist フォルダを削除しました')
        } catch (error) {
          console.error('dist フォルダの削除に失敗しました:', error)
        }
      },
    },
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      // インライン化しないように設定
      rollupOptions: {
        output: {
          entryFileNames: (assetInfo) => {
            if (assetInfo.name.includes('hoisted')) {
              return `assets/js/main.js`
            }
            return `assets/[ext]/[name].js`
          },
          // chunkFileNames: `assets/js/chunks/[name].js`,
          assetFileNames: (assetInfo) => {
            if (/main\.(css|scss)$/.test(assetInfo.name)) {
              return `assets/css/main.css`
            }
            return `assets/css/utility-tailwind.css`
          },
        },
      },
    },
  },
  integrations: [
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    optimizedHTML(BASE_PATH),
  ],
})
