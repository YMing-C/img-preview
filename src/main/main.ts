/**
 * Electron 主进程入口
 *
 * 职责：创建窗口、注册 IPC 通道、挂载 koma-file 协议、管理应用生命周期。
 * 窗口无原生边框（frame: false），关闭/最小化/最大化由渲染进程通过 IPC 控制。
 */
import { app, BrowserWindow, ipcMain, protocol } from 'electron'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import Store from 'electron-store'
import { deleteComic, getComicDetail, getLibrary, importFolder, openFolderTemp, saveProgress } from './library.js'
import { initializeLibrary } from './database.js'
import type { ReaderSettings } from './types.js'

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL)
const store = new Store<{ readerSettings: ReaderSettings }>({
  defaults: {
    readerSettings: {
      background: 'dark',
      zoomMode: 'fit-width',
      zoomValue: 1,
      readingMode: 'scroll'
    }
  }
})

/** 创建主窗口，无边框模式，通过自定义标题栏拖拽和操作 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'Koma',
    backgroundColor: '#191919',
    frame: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist/preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    void mainWindow.loadFile(path.join(app.getAppPath(), 'dist/renderer/index.html'))
  }
}

/** 注册所有 IPC 通道：书库操作、设置读写、窗口控制 */
function registerIpc(): void {
  // 书库
  ipcMain.handle('library:list', () => getLibrary())
  ipcMain.handle('library:import-folder', () => importFolder())
  ipcMain.handle('library:open-folder-temp', () => openFolderTemp())
  ipcMain.handle('library:get-comic', (_event, id: string) => getComicDetail(id))
  ipcMain.handle('library:update-progress', (_event, input) => saveProgress(input))
  ipcMain.handle('library:remove-comic', (_event, id: string) => deleteComic(id))
  // 阅读器设置
  ipcMain.handle('settings:get-reader', () => {
    const stored = store.get('readerSettings')
    if (!('readingMode' in (stored ?? {}))) {
      return { ...stored, readingMode: 'scroll' as const }
    }
    return stored
  })
  ipcMain.handle('settings:set-reader', (_event, settings: ReaderSettings) => {
    store.set('readerSettings', settings)
    return settings
  })
  // 窗口控制（无边框窗口）
  ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.minimize()
  })
  ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
    return window?.isMaximized() ?? false
  })
  ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.close()
  })
  ipcMain.handle('window:is-maximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isMaximized() ?? false
  })
  ipcMain.handle('window:set-fullscreen', (event, fullscreen: boolean) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.setFullScreen(fullscreen)
    return window?.isFullScreen() ?? false
  })
}

app.whenReady().then(() => {
  // 注册自定义协议，用于安全加载本地图片文件
  protocol.registerFileProtocol('koma-file', (request, callback) => {
    const url = new URL(request.url)
    let filePath = decodeURIComponent(url.pathname)
    if (process.platform === 'win32' && filePath.startsWith('/')) {
      filePath = filePath.slice(1)
    }
    callback(filePath)
  })

  initializeLibrary()
  registerIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
