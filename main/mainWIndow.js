const { BrowserWindow, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

const createWindow = () => {
  const isDev = process.env.NODE_ENV === 'development'

  let mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    useContentSize: true,
    frame: false,
    title: '图片查看器',
    transparent: false,
    fullscreenable: false,
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      worldSafeExecuteJavaScript: false,
      enableRemoteModule: true,
    },
  })

  if (isDev) {
    mainWindow.loadURL(`http://localhost:3000`)
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
  }

  mainWindow.maximize()

  // 解决应用启动白屏问题
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  ipcMain.on('min', () => {
    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.on('max', () => {
    if (mainWindow) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    }
  })

  ipcMain.on('close', () => {
    if (mainWindow) mainWindow.close()
  })

  ipcMain.on('destroy-main-win', () => {
    mainWindow.destroy()
  })

  ipcMain.on('show-devtools', () => {
    if (mainWindow) {
      if (mainWindow.webContents.isDevToolsOpened()) mainWindow.webContents.closeDevTools()
      else mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  return mainWindow
}

module.exports = createWindow
