/**
 * 书库业务逻辑
 *
 * 负责漫画导入、文件夹扫描、临时打开、进度保存等操作。
 * 数据持久化委托给 database.ts，本层只做业务编排。
 */
import { dialog } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { findComicByPath, getComic, getPages, insertComic, listComics, removeComic, updateProgress } from './database.js'
import type { Comic, ComicDetail, ComicPage, UpdateProgressInput } from './types.js'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/** 弹出系统文件夹选择对话框，返回选择的路径或 null */
export async function chooseComicFolder(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择漫画文件夹'
  })

  return result.canceled ? null : result.filePaths[0] ?? null
}

/** 扫描文件夹内所有支持的图片文件，按自然排序后返回 ComicPage 数组 */
async function scanImagePages(folderPath: string, comicId: string): Promise<ComicPage[]> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .sort((a, b) => collator.compare(a.name, b.name))

  return files.map((file, index) => ({
    id: randomUUID(),
    comicId,
    index,
    filePath: path.join(folderPath, file.name),
    fileName: file.name
  }))
}

/** 根据文件夹路径和页面列表构建 Comic 对象 */
function buildComic(folderPath: string, pages: ComicPage[]): Comic {
  const now = new Date().toISOString()

  return {
    id: pages[0]?.comicId ?? randomUUID(),
    title: path.basename(folderPath),
    folderPath,
    coverPath: pages[0]?.filePath ?? null,
    pageCount: pages.length,
    currentPageIndex: 0,
    status: 'unread',
    createdAt: now,
    updatedAt: now,
    lastReadAt: null
  }
}

/** 导入文件夹到书库：选择文件夹 → 扫描图片 → 写入数据库。重复路径复用现有记录 */
export async function importFolder(): Promise<ComicDetail | null> {
  const folderPath = await chooseComicFolder()
  if (!folderPath) return null

  const existing = findComicByPath(folderPath)
  if (existing) {
    return { ...existing, pages: getPages(existing.id) }
  }

  const comicId = randomUUID()
  const pages = await scanImagePages(folderPath, comicId)
  if (pages.length === 0) {
    throw new Error('所选文件夹中没有支持的图片文件。')
  }

  const comic = buildComic(folderPath, pages)
  insertComic(comic, pages)
  return { ...comic, pages }
}

/** 临时打开文件夹阅读，不入库。ID 前缀 temp- 确保不写入进度 */
export async function openFolderTemp(): Promise<ComicDetail | null> {
  const folderPath = await chooseComicFolder()
  if (!folderPath) return null

  const comicId = `temp-${randomUUID()}`
  const pages = await scanImagePages(folderPath, comicId)
  if (pages.length === 0) {
    throw new Error('所选文件夹中没有支持的图片文件。')
  }

  return { ...buildComic(folderPath, pages), id: comicId, pages }
}

/** 获取书库漫画列表 */
export function getLibrary(): Comic[] {
  return listComics()
}

/** 获取漫画详情（含页面列表） */
export function getComicDetail(id: string): ComicDetail | null {
  const comic = getComic(id)
  if (!comic) return null
  return { ...comic, pages: getPages(id) }
}

/** 保存阅读进度，temp- 前缀的临时漫画跳过 */
export function saveProgress(input: UpdateProgressInput): void {
  if (input.comicId.startsWith('temp-')) return
  updateProgress(input)
}

/** 从书库中移除漫画（不删除本地文件） */
export function deleteComic(id: string): void {
  removeComic(id)
}
