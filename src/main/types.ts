/** 漫画阅读状态 */
export type ComicStatus = 'unread' | 'reading' | 'finished'

/** 漫画元数据 */
export type Comic = {
  id: string
  title: string
  folderPath: string
  coverPath: string | null
  pageCount: number
  currentPageIndex: number
  status: ComicStatus
  createdAt: string
  updatedAt: string
  lastReadAt: string | null
}

/** 单页图片记录 */
export type ComicPage = {
  id: string
  comicId: string
  index: number
  filePath: string
  fileName: string
}

/** 漫画详情 = 元数据 + 所有页面 */
export type ComicDetail = Comic & {
  pages: ComicPage[]
}

/** 阅读器背景色选项 */
export type ReaderBackground = 'black' | 'dark' | 'light' | 'white'
/** 图片缩放模式 */
export type ZoomMode = 'fit-width' | 'actual' | 'preset'
/** 阅读模式 */
export type ReadingMode = 'scroll' | 'single'

/** 阅读器设置，持久化到 electron-store */
export type ReaderSettings = {
  background: ReaderBackground
  zoomMode: ZoomMode
  zoomValue: number
  readingMode: ReadingMode
}

/** 阅读进度更新入参 */
export type UpdateProgressInput = {
  comicId: string
  currentPageIndex: number
}
