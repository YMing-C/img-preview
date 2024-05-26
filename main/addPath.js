const { ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const util = require('util')

const readDir = util.promisify(fs.readdir)

const getAllImg = async directory => {
  const imageExtensions = ['.jpg', '.jpeg', '.png']
  let files

  try {
    files = await readDir(directory)
  } catch (err) {
    console.log(`读取文件错误：`, err)
    return []
  }

  return files.filter(filename => {
    const extension = path.extname(filename).toLowerCase()
    return imageExtensions.includes(extension)
  })
}

const openPathSelectDialog = () => {
  ipcMain.on('open-directory-select-dialog', async event => {
    try {
      const res = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      })

      const path = res.filePaths[0]
      if (path) {
        const imgList = await getAllImg(path)
        event.reply('selected-directory', {
          path: path,
          list: imgList,
        })
      }
    } catch (err) {
      console.log('返回数据错误:', err)
    }
  })
}

module.exports = {
  openPathSelectDialog,
}
