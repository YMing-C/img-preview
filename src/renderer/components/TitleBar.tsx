/**
 * 自定义标题栏（无边框窗口）
 *
 * 提供可拖拽区域和最小化 / 最大化（含还原） / 关闭按钮。
 * 通过 resize 事件同步窗口最大化状态以切换图标。
 */
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

export function TitleBar(): ReactElement {
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    void window.comicApi.isMaximized().then(setMaximized)
    const onResize = () => {
      void window.comicApi.isMaximized().then(setMaximized)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleMaximize = async () => {
    const next = await window.comicApi.maximize()
    setMaximized(next)
  }

  return (
    <div className="title-bar">
      <span className="title-bar-name">Koma</span>
      <div className="title-bar-controls">
        <button className="title-btn" onClick={() => void window.comicApi.minimize()} title="最小化">
          <svg width="12" height="12" viewBox="0 0 12 12"><rect y="5" width="12" height="1.5" fill="currentColor" /></svg>
        </button>
        <button className="title-btn" onClick={handleMaximize} title={maximized ? '还原' : '最大化'}>
          {maximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="0" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="0" y="4" width="8" height="8" rx="1" fill="#171717" stroke="currentColor" strokeWidth="1.5" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          )}
        </button>
        <button className="title-btn title-btn-close" onClick={() => void window.comicApi.close()} title="关闭">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
    </div>
  )
}
