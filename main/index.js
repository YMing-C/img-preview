const { app } = require('electron')
const createWindow = require('./mainWIndow')
const { openPathSelectDialog } = require('./addPath')
const { getPath } = require('./getUserDataPath')

const gotTheLock = app.requestSingleInstanceLock()

const onReady = () => {
  createWindow()
  openPathSelectDialog()
  getPath()
}

app.whenReady().then(onReady)

app.on('window-all-closed', () => {
  app.quit()
})

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })
}
