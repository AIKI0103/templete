// 画像ファイルをWebPに変換するプラグイン
// 画像ファイルが追加されたらWebPに変換する
// 画像ファイルが削除されたらWebPも削除する
// 画像ファイルが変更されたらWebPも変更する

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

const targetDirectory = path.join(process.cwd(), 'public/assets/images')

async function convertToWebP(inputPath) {
  try {
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    await sharp(inputPath)
      .toFormat('webp', { quality: 99 }) // クオリティを99に設定
      .toFile(outputPath)
    console.log(`Converted ${inputPath} to ${outputPath}`)
  } catch (error) {
    console.error('Error converting image:', error)
  }
}

function deleteWebP(filePath) {
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  if (fs.existsSync(webpPath)) {
    fs.unlinkSync(webpPath)
    console.log(`Deleted WebP file ${webpPath}`)
  }
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file)
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      convertToWebP(fullPath)
    }
  })
}

function watchDirectory(directory) {
  chokidar
    .watch(directory, { ignored: /^\./, persistent: true })
    .on('add', (path) => {
      console.log(`File ${path} has been added`)
      if (/\.(jpg|jpeg|png)$/i.test(path)) {
        convertToWebP(path)
      }
    })
    .on('change', (path) => {
      console.log(`File ${path} has been changed`)
      if (/\.(jpg|jpeg|png)$/i.test(path)) {
        convertToWebP(path)
      }
    })
    .on('unlink', (path) => {
      console.log(`File ${path} has been removed`)
      deleteWebP(path)
    })
    .on('error', (error) => console.error(`Watcher error: ${error}`))
}

function main() {
  const args = process.argv.slice(2)
  const mode = args[0]

  processDirectory(targetDirectory)

  if (mode === 'watch') {
    watchDirectory(targetDirectory)
  }
}

main()
