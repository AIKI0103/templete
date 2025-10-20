module.exports = {
  customSyntax: 'postcss-html',
  plugins: ['stylelint-declaration-block-no-ignored-properties', 'stylelint-no-unsupported-browser-features'],
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-config-html/astro', 'stylelint-config-prettier-scss'],
  rules: {
    'prettier/prettier': true,
    'selector-class-pattern': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'media-feature-range-notation': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'layer', 'responsive', 'screen', 'tailwind', 'media'],
      },
    ],
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning', // サポートされていない機能がある場合に警告として扱う
        browsers: ['> 2% in JP and last 2 major versions', '> 0.2% and not dead'],
        ignorePartialSupport: true, // 部分的にサポートされている機能を無視する
      },
    ],
    // 'plugin/selector-bem-pattern': {
    //   componentName: '[A-Z]+',
    //   componentSelectors: {
    //     initial: '^\\.{componentName}(?:-[a-z]+)?$',
    //     combined: '^\\.combined-{componentName}-[a-z]+$',
    //   },
    //   utilitySelectors: '^\\.util-[a-z]+$',
    // },
  },
}
