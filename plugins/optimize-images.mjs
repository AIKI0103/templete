// 処理の説明
// 1. dist/assets/images/ 以下の画像を全て取得
// 2. 画像を1つずつ処理
// 3. 画像のフォーマットを変更
// 4. 画像を保存
// 5. 画像のファイルサイズを取得
// 6. 画像のファイルサイズを表示
// 7. 画像のファイルサイズを比較  (初期サイズ - 最終サイズ)

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const beforeDir = './public/assets/images/'
const inputDir = './dist/assets/images/'
const outputDir = './dist/assets/images/'
const quality = 97

const getFileSize = async (filePath) => {
  try {
    const stats = await fs.promises.stat(filePath)
    return stats.size
  } catch (err) {
    console.error('Error getting file size:', filePath, err)
    return 0
  }
}

const getTotalSize = async (directory) => {
  try {
    const files = await fs.promises.readdir(directory)
    const sizes = await Promise.all(files.map((file) => getFileSize(path.join(directory, file))))
    return sizes.reduce((acc, size) => acc + size, 0)
  } catch (err) {
    console.error('Error calculating total size:', err)
    return 0
  }
}

const optimizeImage = async (file, format) => {
  try {
    const tempOutputPath = file + '.tmp'
    let image = sharp(file)

    if (format === 'jpeg') {
      image = image.jpeg({ quality })
    } else if (format === 'png') {
      image = image.png({ compressionLevel: 7 })
    }

    await image.toFile(tempOutputPath)
    await fs.promises.rename(tempOutputPath, file)
    console.log(`Optimized ${format.toUpperCase()}: ${file}`)
  } catch (err) {
    console.error(`Error processing ${format.toUpperCase()} file:`, file, err)
  }
}

const processDirectory = async (directory) => {
  try {
    const items = await fs.promises.readdir(directory, { withFileTypes: true })
    for (const item of items) {
      const fullPath = path.join(directory, item.name)
      if (item.isDirectory()) {
        await processDirectory(fullPath) // 再帰的にディレクトリを処理
      } else {
        const match = fullPath.match(/\.(jpg|jpeg|png)$/i)
        if (match) {
          const format = match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase()
          await optimizeImage(fullPath, format)
        }
      }
    }
  } catch (err) {
    console.error('Error processing directory:', directory, err)
  }
}

const optimizeImages = async () => {
  try {
    const initialSize = await getTotalSize(inputDir)
    console.log(`Initial total size: ${initialSize} bytes`)

    await processDirectory(inputDir)

    const finalSize = await getTotalSize(inputDir)
    console.log(`Final total size: ${finalSize} bytes`)
    console.log(`Total size reduction: ${initialSize - finalSize} bytes`)
  } catch (err) {
    console.error('Error in optimizeImages:', err)
  }
}

optimizeImages()
