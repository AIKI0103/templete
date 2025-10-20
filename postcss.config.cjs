/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const config = {
  plugins: [],
}

process.env.IS_CUSTOM !== 'minify' &&
  config.plugins.push(
    ...[
      require('autoprefixer')({
        grid: false,
      }),
      require('postcss-custom-media'),
      require('postcss-sort-media-queries')({
        sort: 'mobile-first',
      }),
    ],
  )

process.env.IS_CUSTOM === 'true' &&
  config.plugins.push(
    ...[
      require('postcss-extract-media-query')({
        entry: path.join(__dirname, 'dist/assets/css/main.css'),
        status: true,
        extractAll: false,
        queries: {
          '(min-width: 1024px)': 'minLG',
          '(min-width: 768px)': 'minMD',
        },
        output: {
          path: path.join(__dirname, 'dist/assets/css'),
          name: '[name]-[query].css',
        },
      }),
    ],
)

process.env.IS_CUSTOM === 'minify' &&
  config.plugins.push(
    ...[
      require('cssnano')({
        preset: 'default',
      }),
    ],
  )

module.exports = config
