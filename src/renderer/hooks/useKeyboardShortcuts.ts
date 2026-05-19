/**
 * 键盘快捷键 hook
 *
 * 注册全局键盘事件监听，处理阅读器所有快捷键：
 * Escape / F / 方向键 / +-0 / Home / End
 */
import { useEffect } from 'react'
import type { ComicDetail, ReaderSettings } from '../types/comic'

export type UseKeyboardShortcutsParams = {
  comic: ComicDetail
  currentPage: number
  settings: ReaderSettings
  saveSettings: (next: ReaderSettings) => Promise<void>
  updateZoom: (direction: 1 | -1) => void
  fullscreen: boolean
  toggleFullscreen: () => void
  onBack: () => void
  pageRefs: React.MutableRefObject<Array<HTMLDivElement | null>>
}

export function useKeyboardShortcuts(params: UseKeyboardShortcutsParams): void {
  const { comic, currentPage, settings, saveSettings, updateZoom, fullscreen, toggleFullscreen, onBack, pageRefs } = params

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (fullscreen) toggleFullscreen()
        else onBack()
      }
      if (event.key.toLowerCase() === 'f') toggleFullscreen()
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const next = Math.min(comic.pages.length - 1, currentPage + 1)
        pageRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prev = Math.max(0, currentPage - 1)
        pageRefs.current[prev]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (event.key === '+' || event.key === '=') updateZoom(1)
      if (event.key === '-') updateZoom(-1)
      if (event.key === '0') void saveSettings({ ...settings, zoomMode: 'fit-width', zoomValue: 1 })
      if (event.key === 'Home') pageRefs.current[0]?.scrollIntoView({ block: 'start' })
      if (event.key === 'End') pageRefs.current[comic.pages.length - 1]?.scrollIntoView({ block: 'start' })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [comic.pages.length, currentPage, fullscreen, onBack, saveSettings, settings, toggleFullscreen, updateZoom, pageRefs])
}
