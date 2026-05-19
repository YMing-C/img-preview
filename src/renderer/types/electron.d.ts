/**
 * 扩展 Window 类型，声明 preload 注入的 comicApi
 *
 * 泛型类型从 comic.ts 导入，API 形状与 preload/index.ts 暴露的完全一致。
 */
import type { Comic, ComicDetail, ReaderSettings } from './comic'

type UpdateProgressInput = {
  comicId: string
  currentPageIndex: number
}

type ComicApi = {
  getLibrary: () => Promise<Comic[]>
  importFolder: () => Promise<ComicDetail | null>
  openFolderTemp: () => Promise<ComicDetail | null>
  getComic: (id: string) => Promise<ComicDetail | null>
  updateProgress: (input: UpdateProgressInput) => Promise<void>
  removeComic: (id: string) => Promise<void>
  getReaderSettings: () => Promise<ReaderSettings>
  setReaderSettings: (settings: ReaderSettings) => Promise<ReaderSettings>
  minimize: () => Promise<void>
  maximize: () => Promise<boolean>
  close: () => Promise<void>
  isMaximized: () => Promise<boolean>
  setFullscreen: (fullscreen: boolean) => Promise<boolean>
}

declare global {
  interface Window {
    comicApi: ComicApi
  }
}

export {}
