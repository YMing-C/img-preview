const { app } = require('electron')
const createWindow = require('./mainWIndow')
const { openPathSelectDialog } = require('./addPath')
const { getPath } = require('./getUserDataPath')

const onReady = () => {
  createWindow()
  openPathSelectDialog()
  getPath()
}

app.whenReady().then(onReady)
