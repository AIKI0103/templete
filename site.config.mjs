export const base = {
  local: '/', // ローカル開発環境用のパス
  development: '/example.com/', // 開発環境用のパス
  production: '/', // 本番環境用のパス
}

export const siteConfig = {
  siteName: 'サイト名',
  siteUrl: `https://example.com`, // 公開時のドメイン
  base,
  ogImage: 'og-image.jpg',
  msapplicationTileColor: '#ffffff',
  themeColor: '#ffffff',
  charset: 'UTF-8',
  locale: 'ja_JP',
  favicon: 'favicon.png',
  appleTouchIcon: 'apple-touch-icon.png',
}
