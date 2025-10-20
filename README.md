# FV Standard（技術Div.静的テンプレート）
[Astro](https://as29zkhfow01tro.pages.dev/)を使用した、静的コーディング用の汎用テンプレート
※ CMS開発しやすいように「build:cms」コマンドを追加。テーマフォルダにassetsをコピーしてくれます！テーマフォルダの指定はpackage.jsonから「案件毎に変更してください」を変更してね。
※ 固定ページ流し込み用の「build:sc」コマンドを追加。dist配下のHTMLにWPショートコード[home_url]、[theme_dir]を追加できます。

# Getting Started
1. リポジトリのクローン
2. node.jsバージョンを変更（`.nvmrc`に記載）
3. `npm install`
4. `npm run start`
5. 開発サーバー起動
6. tailwind.config.cjs の初期設定
   | 項目                   | 行目            |
   | ---------------------- | --------------- |
   | デザインコンテナサイズ | 20行目・115行目 |
   | フォント関連           | 26行目〜        |
   | カラー関連             | 50行目〜        |

     - 案件ごとのテーマカラーは、colors: { theme: { ... } } にまとめる
     - 16進数カラーコードで指定


# 便利スニペット
### 【メディアクエリ】
postCSSのカスタムメディアクエリを使って変数管理しています
- `min-md:astro` -> `@media (--min-md) {}` - ビルド後 -> `@media (min-width: 768px) {}`
- `min-lg:astro` -> `@media (--min-lg) {}` - ビルド後 -> `@media (min-width: 1024px) {}`
- `max-md:astro` -> `@media (--max-md) {}` - ビルド後 -> `@media (min-width: 767.98px) {}`
- `max-lg:astro` -> `@media (--max-lg) {}` - ビルド後 -> `@media (min-width: 1023.98px) {}`

他にもあります🙌 詳しくは `.vscode/css.code-snippets` をご覧ください

### 【画像を扱う場合の専用スニペット】
- `picture:astro` -> `<Picture />`コンポーネントが展開されます（必要なPropsを入力してください）
- `image:astro` -> `<Image />`コンポーネントが展開されます（必要なPropsを入力してください）

※ PictureとImageに限らずですが、コンポーネントは `import` が必要です（以下参照）
``` js
import Picture from '../components/Picture.astro'
import Image from '../components/Image.astro'
```

他にもあります🙌 詳しくは `.vscode/html.code-snippets` をご覧ください


# 開発とビルド時の異なる処理
### 【ビルド時】：以下ブレークポイントで分割したファイルをminifyして出力
- main.css（以下2点以外）
- main-minLG.css（min-width: 1024px）
- main-minMD.css（min-width: 768px）

### 【CSS設計】
- SCSS（BEM, FLOCSS）
  - mixinやscssの変数（$hoge など）は基本使わない（スニペットを使いましょう！🙌）
- [FLOCSS](https://github.com/hiloki/flocss/)
- [BEM](https://en.bem.info/)

# フロントエンド
| ビルド後   | 開発時                                                |
| ---------- | ----------------------------------------------------- |
| HTML       | [Astro](https://docs.astro.build/en/getting-started/) |
| CSS        | [Sass（SCSS）in Astro](https://sass-lang.com/)        |
| JavaScript | JavaScript                                            |

※一部[TypeScript](https://www.typescriptlang.org/)ファイルがあるがWeb制作では学習コストの割に恩恵があまりないため使わない方針

---

# プロジェクト構造

Astroプロジェクトの中には、次のフォルダーとファイルで構成されています。

```
/
├── .vscode/（プロジェクト共通設定：便利スニペットや環境設定が登録されています）
├── functions/（Cloudflare用：Basic認証）
├── dist/（納品用：ビルドされたデータが生成されます）
├── public/（静的コンテンツ）
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   ├── js/
│   │   └── svg/
│   └── favicon.svg
├── src/（開発用ディレクトリ）
│   ├── components/（コンポーネントディレクトリ）
│   │   └── Sample.astro
│   ├── js/（JavaScriptディレクトリ）
│   │   └── main.js
│   ├── layouts/（レイアウトディレクトリ）
│   │   └── Layout.astro
│   ├── pages/（ページ構築ディレクトリ：ここがルートになります、astroで構築します）
│   │   └── index.astro
│   └── styles/（scss（css）ディレクトリ：FLOCSSを採用しています）
│       ├── _develop.scss（サンプルCSS：開発着手時はmain.scssから読み込みを解除します）
│       └── main.scss
└── package.json
```

- Astroは `src/pages/` ディレクトリにある `.astro` または `.md` ファイルを対象とします。各ページは、ファイル名に基づいてルートとして公開されます。
- `src/components/` は特別なものではありませんが、 `Astro/React/Vue/Svelte/Preact` のコンポーネントはこのディレクトリに設置します。
- 画像のような静的資産は、 `public/` ディレクトリに設置します。
- SVGアイコンは以下のシートから確認可能です。
  - [アイコンシート](http://localhost:3000/assets/svg/)

## Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                               |
| :------------------ | :--------------------------------------------------- |
| `npm install`       | 依存関係をインストールする                           |
| `npm run dev`       | ローカルサーバを`localhost:3000`で起動する。         |
| `npm run build`     | 静的資産を `./dist/` にビルドする。                  |
| `npm run build:sc`  | dist配下のHTMLにWPショートコード[home_url]、[theme_dir]を追加する。 |
| `npm run build:cms` | CMS開発効率UP 静的資産をテーマフォルダにビルドする。 |
| `npm run preview`   | デプロイする前に、ローカルでビルドをプレビューする。 |

## 👀 もっと詳しく知りたい方はこちら

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
