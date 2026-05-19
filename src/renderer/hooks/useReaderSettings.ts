/**
 * 阅读器设置管理 hook
 *
 * 负责设置的加载、保存和缩放步进逻辑。
 * 设置通过 electron-store 在主进程持久化。
 */
import { useEffect, useState } from 'react'
import type { ReaderBackground, ReaderSettings } from '../types/comic'

/** 阅读器背景色映射 */
export const backgrounds: Record<ReaderBackground, string> = {
  black: '#050505',
  dark: '#191919',
  light: '#d8d5ce',
  white: '#f5f2ec'
}

/** 缩放选项 */
export const zoomOptions = [
  { label: '适应宽度', mode: 'fit-width' as const, value: 1 },
  { label: '100%', mode: 'actual' as const, value: 1 },
  { label: '125%', mode: 'preset' as const, value: 1.25 },
  { label: '150%', mode: 'preset' as const, value: 1.5 }
]

export type UseReaderSettingsReturn = {
  settings: ReaderSettings
  saveSettings: (next: ReaderSettings) => Promise<void>
  updateZoom: (direction: 1 | -1) => void
}

export function useReaderSettings(): UseReaderSettingsReturn {
  const [settings, setSettings] = useState<ReaderSettings>({
    background: 'dark',
    zoomMode: 'fit-width',
    zoomValue: 1,
    readingMode: 'scroll'
  })

  // 挂载时加载已保存的阅读器设置
  useEffect(() => {
    void window.comicApi.getReaderSettings().then(setSettings)
  }, [])

  /** 保存阅读器设置到主进程 */
  const saveSettings = async (next: ReaderSettings) => {
    setSettings(next)
    await window.comicApi.setReaderSettings(next)
  }

  /** 缩放步进：在预设值 1 / 1.25 / 1.5 之间切换 */
  const updateZoom = (direction: 1 | -1) => {
    const presets = [1, 1.25, 1.5]
    const current = settings.zoomMode === 'fit-width' ? 1 : settings.zoomValue
    const index = Math.max(0, Math.min(presets.length - 1, presets.findIndex((value) => value >= current) + direction))
    void saveSettings({ ...settings, zoomMode: 'preset', zoomValue: presets[index] })
  }

  return { settings, saveSettings, updateZoom }
}
