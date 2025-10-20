// tailwind.config.js
import colors from 'tailwindcss/colors'

const baseFont = ['Helvetica Neue', 'Arial', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'BIZ UDPGothic', 'Meiryo', '-apple-system', 'blinkmacsystemfont', 'sans-serif']

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      /* ブレイクポイント */
      md: '768px', // => @media (min-width: 768px) { ... }
      lg: '1024px', // => @media (min-width: 1024px) { ... }
      xl: '1280px', // => @media (min-width: 1280px) { ... }
      /* コンテナサイズ */
      container: '1170px',
      design: '1400px',
      large: '1280px',
      medium: '970px',
      small: '770px',
      xsmall: '570px',
    },
    fontSize: {
      base: '1.6rem',
      pxbase: '16px',
      rembase: '62.5%',
    },
    fontWeight: {
      thin: 100, // thin
      extraLight: 200, // extraLight
      light: 300, // light
      regular: 400, // regular and normal
      medium: 500, // medium
      semiBold: 600, // semiBold
      bold: 700, // bold
      extraBold: 800, // extraBold
      black: 900, // black
    },
    fontFamily: {
      sans: ['Noto Sans JP', ...baseFont],
      serif: ['Georgia', 'serif'],
      roboto: ['Roboto', ...baseFont],
      yugo: ['游ゴシック体', 'YuGothic', '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック', 'Yu Gothic', ...baseFont],
      yumin: ['游明朝体', 'YuMincho', '游明朝 Medium', 'Yu Mincho Medium', '游明朝', 'Yu Mincho', 'serif'],
      hiraginoSans: ['Hiragino Sans', 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', ...baseFont],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: {
        DEFAULT: '#cccccc',
        dddddd: '#dddddd',
        f5f5f5: '#f5f5f5',
      },
      text: {
        /* デフォルトのテキストカラー */
        DEFAULT: '#333333',
      },
      theme: {
        /* 案件ごとのテーマカラー */
        DEFAULT: '#0050ff',
        '0600ff': '#0600ff',
      },
      form: {
        /* フォームパーツ */
        statusAny: '#d2d2d2',
        statusRequired: '#e74d3d',
        inputBg: '#fafafa',
        inputBorder: '#dddddd',
        inputReqiredBg: '#fff6f6',
        listsBg: '#efefef',
        listsActive: '#158eff',
        placeholder: '#a5a5a5',
        response: '#168eff',
        disabled: '#999999',
        disabledBg: '#d9d9d9',
        submit: '#0050ff',
        submitHover: '#e63232',
      },
    },
    extend: {
      lineHeight: {
        tight: 1.2,
        snug: 1.4,
        normal: 1.75,
        relaxed: 1.8,
        loose: 2,
      },
      letterSpacing: {
        tight: '0.05em',
        normal: '0',
        wide: '0.1em',
      },
      zIndex: {
        footer: '1000',
        nav: '1010',
        content: '1020',
        pagetop: '1030',
        'header-base': '1040',
        drawer: '1050',
        header: '1060',
        guide: '1065',
        trigger: '1070',
        loading: '1080',
        debug: '1090',
      },
      width: {
        design: '140rem',
        container: '117rem',
        large: '128rem',
        medium: '97rem',
        small: '77rem',
        xsmall: '57rem',
      },
    },
  },
  plugins: [],
}
