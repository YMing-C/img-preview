/**
 * 自动保存阅读进度 hook
 *
 * 在 currentPage 变化后等待 500ms 防抖，然后通过 IPC 保存进度到主进程。
 * 纯副作用 hook，无返回值。
 */
import { useEffect } from 'react'
import type { ComicDetail } from '../types/comic'

export function useAutoSaveProgress(comic: ComicDetail, currentPage: number): void {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void window.comicApi.updateProgress({ comicId: comic.id, currentPageIndex: currentPage })
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [comic.id, currentPage])
}
