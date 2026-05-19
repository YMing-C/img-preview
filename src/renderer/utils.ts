/**
 * 渲染进程共享工具函数
 *
 * 被 Library、Reader 等多个组件引用，避免跨组件重复定义。
 */
import type { Comic } from './types/comic'

/** 将本地文件路径转为 koma-file 协议 URL，用于安全加载本地图片 */
export function fileUrl(filePath: string): string {
  return `koma-file:///${encodeURIComponent(filePath.replace(/\\/g, '/'))}`
}

/** 计算阅读进度百分比 */
export function progressOf(comic: Comic): number {
  if (comic.pageCount === 0) return 0
  return Math.round(((comic.currentPageIndex + 1) / comic.pageCount) * 100)
}

/** 漫画状态的中文标签 */
export function statusLabel(comic: Comic): string {
  if (comic.status === 'finished') return '已读'
  if (comic.status === 'reading') return '阅读中'
  return '未读'
}
