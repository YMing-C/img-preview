/**
 * 书库数据管理 hook
 *
 * 封装书库的加载、导入、临时打开、删除等 CRUD 操作，
 * 管理 library / loading / error 状态。
 * 视图切换由调用方（App.tsx）处理。
 */
import { useEffect, useState } from 'react'
import type { Comic, ComicDetail } from '../types/comic'

export type UseLibraryReturn = {
  library: Comic[]
  loading: boolean
  error: string | null
  loadLibrary: () => Promise<void>
  importFolder: () => Promise<ComicDetail | null>
  openTemp: () => Promise<ComicDetail | null>
  removeComic: (id: string) => Promise<void>
}

export function useLibrary(): UseLibraryReturn {
  const [library, setLibrary] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLibrary = async () => {
    setLoading(true)
    setError(null)
    try {
      setLibrary(await window.comicApi.getLibrary())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '书库加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLibrary()
  }, [])

  /** 导入文件夹 → 刷新书库 → 返回漫画供调用方打开 */
  const importFolder = async () => {
    setError(null)
    try {
      const comic = await window.comicApi.importFolder()
      if (comic) {
        await loadLibrary()
        return comic
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '导入失败')
    }
    return null
  }

  /** 临时打开文件夹阅读，不入库 */
  const openTemp = async () => {
    setError(null)
    try {
      return await window.comicApi.openFolderTemp()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '打开失败')
      return null
    }
  }

  /** 从书库移除漫画记录 */
  const removeComic = async (id: string) => {
    await window.comicApi.removeComic(id)
    await loadLibrary()
  }

  return { library, loading, error, loadLibrary, importFolder, openTemp, removeComic }
}
