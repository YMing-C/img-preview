/**
 * 书库数据层
 *
 * 以单个 JSON 文件（library.json）存储全部漫画和页面数据，
 * 路径为 app.getPath('userData')/library.json。
 * 内存中维护一份缓存，读写均同步完成，适合当前数据量。
 */
import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import type { Comic, ComicPage, UpdateProgressInput } from './types.js'

type LibraryData = {
  comics: Comic[]
  pages: ComicPage[]
}

const emptyLibrary: LibraryData = {
  comics: [],
  pages: []
}

let cache: LibraryData | null = null

/** 返回 library.json 的完整路径 */
function getLibraryPath(): string {
  return path.join(app.getPath('userData'), 'library.json')
}

/** 读取书库数据，无缓存时从磁盘加载 */
function readLibrary(): LibraryData {
  if (cache) return cache

  const filePath = getLibraryPath()
  if (!fs.existsSync(filePath)) {
    cache = { ...emptyLibrary }
    return cache
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as LibraryData
    cache = {
      comics: Array.isArray(parsed.comics) ? parsed.comics : [],
      pages: Array.isArray(parsed.pages) ? parsed.pages : []
    }
  } catch {
    cache = { ...emptyLibrary }
  }

  return cache
}

/** 将书库数据写入磁盘并更新缓存 */
function writeLibrary(data: LibraryData): void {
  cache = data
  const filePath = getLibraryPath()
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

/** 初始化书库文件，不存在则创建 */
export function initializeLibrary(): void {
  writeLibrary(readLibrary())
}

/** 列出所有漫画，按最后阅读时间倒序 */
export function listComics(): Comic[] {
  return [...readLibrary().comics].sort((a, b) => {
    const left = a.lastReadAt ?? a.createdAt
    const right = b.lastReadAt ?? b.createdAt
    return right.localeCompare(left)
  })
}

/** 按文件夹路径查找已导入的漫画 */
export function findComicByPath(folderPath: string): Comic | null {
  return readLibrary().comics.find((comic) => comic.folderPath === folderPath) ?? null
}

/** 按 ID 查找漫画 */
export function getComic(id: string): Comic | null {
  return readLibrary().comics.find((comic) => comic.id === id) ?? null
}

/** 获取指定漫画的所有页面，按 index 升序 */
export function getPages(comicId: string): ComicPage[] {
  return readLibrary().pages
    .filter((page) => page.comicId === comicId)
    .sort((a, b) => a.index - b.index)
}

/** 新增漫画及其页面记录 */
export function insertComic(comic: Comic, pages: ComicPage[]): void {
  const data = readLibrary()
  writeLibrary({
    comics: [...data.comics, comic],
    pages: [...data.pages, ...pages]
  })
}

/** 更新漫画阅读进度，自动推导阅读状态 */
export function updateProgress(input: UpdateProgressInput): void {
  const data = readLibrary()
  const comics = data.comics.map((comic) => {
    if (comic.id !== input.comicId) return comic

    const currentPageIndex = Math.max(0, Math.min(input.currentPageIndex, Math.max(comic.pageCount - 1, 0)))
    const status: Comic['status'] = currentPageIndex <= 0 ? 'unread' : currentPageIndex >= comic.pageCount - 1 ? 'finished' : 'reading'
    const now = new Date().toISOString()

    return {
      ...comic,
      currentPageIndex,
      status,
      updatedAt: now,
      lastReadAt: now
    }
  })

  writeLibrary({ ...data, comics })
}

/** 移除漫画记录及其关联页面，不删除本地文件 */
export function removeComic(id: string): void {
  const data = readLibrary()
  writeLibrary({
    comics: data.comics.filter((comic) => comic.id !== id),
    pages: data.pages.filter((page) => page.comicId !== id)
  })
}
