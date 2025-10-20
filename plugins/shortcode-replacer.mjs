import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * HTMLファイル内のパスをショートコードに置換する
 * @param {string} filePath - 処理するファイルのパス
 */
function replaceShortcodes(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // 置換処理
    let modifiedData = data;

    // 1. 「"/assets/」 を 「"[theme_dir]/assets/」 に置換
    modifiedData = modifiedData.replace(/\"\/assets\//g, '"[theme_dir]/assets/');

    // 2. 「, /assets/」 を 「, [theme_dir]/assets/」 に置換（カンマの後にスペースがある場合）
    modifiedData = modifiedData.replace(/\, \/assets\//g, ', [theme_dir]/assets/');

    // 3. 「,/assets/」 を 「,[theme_dir]/assets/」 に置換（カンマの後にスペースがない場合）
    modifiedData = modifiedData.replace(/\,\/assets\//g, ',[theme_dir]/assets/');

    // 4. 「href="/」 を 「href="[home_url]/」 に置換
    modifiedData = modifiedData.replace(/href=\"\//g, 'href="[home_url]/');

    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}:`, err);
        return;
      }
      console.log(`Updated contents of ${filePath} with shortcodes.`);
    });
  });
}

/**
 * ディレクトリ内のすべてのHTMLファイルを処理する
 * @param {string} directory - 処理するディレクトリのパス
 */
function processDirectory(directory) {
  // distディレクトリ内のすべてのHTMLファイルを検索
  const htmlFiles = glob.sync(path.join(directory, '**/*.html'));

  if (htmlFiles.length === 0) {
    console.log(`No HTML files found in ${directory}`);
    return;
  }

  console.log(`Found ${htmlFiles.length} HTML files to process`);

  // 各HTMLファイルに対してショートコード置換を実行
  htmlFiles.forEach(filePath => {
    replaceShortcodes(filePath);
  });
}

// メイン処理
const targetDir = process.argv[2] || './dist'; // 引数で指定されたディレクトリ、もしくはデフォルトでdistディレクトリを使用
processDirectory(targetDir);
