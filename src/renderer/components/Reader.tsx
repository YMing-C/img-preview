/**
 * 阅读器组件
 *
 * 组合所有阅读器相关 hook 和子组件，负责页面图片的渲染。
 * 自身不持有复杂状态逻辑，所有状态通过 hook 管理。
 */
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import type { ComicDetail } from '../types/comic'
import { fileUrl } from '../utils'
import { useAutoSaveProgress } from '../hooks/useAutoSaveProgress'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { usePageNavigation } from '../hooks/usePageNavigation'
import { backgrounds, useReaderSettings } from '../hooks/useReaderSettings'
import { ReaderToolbar } from './ReaderToolbar'
import { TitleBar } from './TitleBar'

export type ReaderProps = {
  comic: ComicDetail
  onBack: () => void | Promise<void>
}

export function Reader({ comic, onBack }: ReaderProps): ReactElement {
  const { settings, saveSettings, updateZoom } = useReaderSettings()
  const { currentPage, viewportRef, pageRefs } = usePageNavigation(comic, settings)
  const [fullscreen, setFullscreen] = useState(false)

  const toggleFullscreen = async () => {
    const next = await window.comicApi.setFullscreen(!fullscreen)
    setFullscreen(next)
  }

  useAutoSaveProgress(comic, currentPage)
  useKeyboardShortcuts({
    comic, currentPage, settings, saveSettings, updateZoom,
    fullscreen, toggleFullscreen, onBack: () => void onBack(),
    pageRefs
  })

  /** 根据缩放模式计算每页图片的容器样式 */
  const pageStyle = useMemo(() => {
    if (settings.zoomMode === 'fit-width') return { width: 'min(100%, 1040px)' }
    const width = Math.round(860 * settings.zoomValue)
    return { width: `${width}px`, maxWidth: 'none' }
  }, [settings.zoomMode, settings.zoomValue])

  return (
    <div className="app-frame" style={{ background: backgrounds[settings.background] }}>
      <TitleBar />
      <div className="reader-content">
        <ReaderToolbar
          comic={comic}
          currentPage={currentPage}
          settings={settings}
          fullscreen={fullscreen}
          onBack={() => void onBack()}
          onSaveSettings={saveSettings}
          onToggleFullscreen={toggleFullscreen}
        />

        <section className={`reader-viewport${settings.readingMode === 'single' ? ' single-mode' : ''}`} ref={viewportRef}>
          {comic.pages.map((page, index) => {
            // 预加载当前页周围：前 2 页 + 后 3 页使用 eager，其余 lazy
            const shouldPreload = Math.abs(index - currentPage) <= (index < currentPage ? 2 : 3)
            return (
              <div
                className="page-frame"
                data-index={index}
                key={page.id}
                ref={(node) => { pageRefs.current[index] = node }}
                style={settings.readingMode === 'single' ? undefined : pageStyle}
              >
                <img src={fileUrl(page.filePath)} alt={page.fileName} loading={shouldPreload ? 'eager' : 'lazy'} />
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
