/**
 * Preload 脚本
 *
 * 在 contextBridge 上挂载 comicApi 对象，作为渲染进程与主进程间的安全桥梁。
 * contextIsolation: true 确保渲染进程无法直接访问 Node.js API。
 */
import { contextBridge, ipcRenderer } from 'electron'
import type { Comic, ComicDetail, ReaderSettings, UpdateProgressInput } from '../main/types.js'

const comicApi = {
  // 书库操作
  getLibrary: (): Promise<Comic[]> => ipcRenderer.invoke('library:list'),
  importFolder: (): Promise<ComicDetail | null> => ipcRenderer.invoke('library:import-folder'),
  openFolderTemp: (): Promise<ComicDetail | null> => ipcRenderer.invoke('library:open-folder-temp'),
  getComic: (id: string): Promise<ComicDetail | null> => ipcRenderer.invoke('library:get-comic', id),
  updateProgress: (input: UpdateProgressInput): Promise<void> => ipcRenderer.invoke('library:update-progress', input),
  removeComic: (id: string): Promise<void> => ipcRenderer.invoke('library:remove-comic', id),
  // 阅读器设置
  getReaderSettings: (): Promise<ReaderSettings> => ipcRenderer.invoke('settings:get-reader'),
  setReaderSettings: (settings: ReaderSettings): Promise<ReaderSettings> => ipcRenderer.invoke('settings:set-reader', settings),
  // 窗口控制（无边框窗口）
  minimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  maximize: (): Promise<boolean> => ipcRenderer.invoke('window:maximize'),
  close: (): Promise<void> => ipcRenderer.invoke('window:close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:is-maximized'),
  setFullscreen: (fullscreen: boolean): Promise<boolean> => ipcRenderer.invoke('window:set-fullscreen', fullscreen)
}

contextBridge.exposeInMainWorld('comicApi', comicApi)

export type ComicApi = typeof comicApi
