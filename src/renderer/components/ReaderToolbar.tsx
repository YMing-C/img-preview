/**
 * 阅读器工具栏
 *
 * 显示返回按钮、漫画标题与页码、缩放/背景/模式切换/全屏控件。
 */
import type { ReactElement } from 'react'
import type { ComicDetail, ReaderBackground, ReaderSettings, ReadingMode } from '../types/comic'
import { zoomOptions } from '../hooks/useReaderSettings'

export type ReaderToolbarProps = {
  comic: ComicDetail
  currentPage: number
  settings: ReaderSettings
  fullscreen: boolean
  onBack: () => void
  onSaveSettings: (settings: ReaderSettings) => void
  onToggleFullscreen: () => void
}

export function ReaderToolbar(props: ReaderToolbarProps): ReactElement {
  const { comic, currentPage, settings, fullscreen, onBack, onSaveSettings, onToggleFullscreen } = props

  return (
    <header className="reader-toolbar">
      <button onClick={() => onBack()}>返回</button>
      <div className="reader-title">
        <strong>{comic.title}</strong>
        <span>{currentPage + 1} / {comic.pageCount}</span>
      </div>
      <div className="reader-controls">
        <select
          value={`${settings.zoomMode}:${settings.zoomValue}`}
          onChange={(event) => {
            const option = zoomOptions.find((item) => `${item.mode}:${item.value}` === event.target.value)
            if (option) void onSaveSettings({ ...settings, zoomMode: option.mode, zoomValue: option.value })
          }}
        >
          {zoomOptions.map((option) => <option key={option.label} value={`${option.mode}:${option.value}`}>{option.label}</option>)}
        </select>
        <select value={settings.background} onChange={(event) => void onSaveSettings({ ...settings, background: event.target.value as ReaderBackground })}>
          <option value="black">黑色</option>
          <option value="dark">深灰</option>
          <option value="light">浅灰</option>
          <option value="white">白色</option>
        </select>
        <button
          onClick={() => {
            const nextMode: ReadingMode = settings.readingMode === 'scroll' ? 'single' : 'scroll'
            void onSaveSettings({ ...settings, readingMode: nextMode })
          }}
          title={settings.readingMode === 'scroll' ? '切换到单页模式' : '切换到滚动模式'}
        >
          {settings.readingMode === 'scroll' ? '单页' : '滚动'}
        </button>
        <button onClick={onToggleFullscreen}>{fullscreen ? '退出全屏' : '全屏'}</button>
      </div>
    </header>
  )
}
