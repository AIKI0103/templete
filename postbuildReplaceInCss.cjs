/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function replaceInFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err)
      return
    }

    const modifiedData = data.replace(/url\(\/assets\/images|url\('\/assets\/images/g, 'url(../images')

    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}:`, err)
        return
      }
      console.log(`Updated contents of ${filePath}.`)
    })
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function processDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err)
      return
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        processDirectory(path.join(directory, entry.name))
      } else if (entry.isFile() && path.extname(entry.name) === '.css') {
        replaceInFile(path.join(directory, entry.name))
      }
    }
  })
}

const targetDir = process.argv[2] || '.' // 引数で指定されたディレクトリ、もしくはカレントディレクトリを使用
processDirectory(targetDir)
