/**
 * Koma 渲染进程根组件
 *
 * 单页应用，通过 view 状态在书库页和阅读器页之间切换。
 * 无路由库，所有状态通过 hook 和子组件管理。
 */
import type { ReactElement } from 'react'
import { useState } from 'react'
import type { ComicDetail } from './types/comic'
import { Library } from './components/Library'
import { Reader } from './components/Reader'
import { TitleBar } from './components/TitleBar'
import { useLibrary } from './hooks/useLibrary'

/** 视图切换联合类型 */
type View =
  | { name: 'library' }
  | { name: 'reader'; comic: ComicDetail }

/** 应用根组件，管理书库和阅读器两个视图的切换 */
export function App(): ReactElement {
  const [view, setView] = useState<View>({ name: 'library' })
  const [query, setQuery] = useState('')
  const { library, loading, error, loadLibrary, importFolder, openTemp, removeComic } = useLibrary()

  /** 打开漫画进入阅读器 */
  const openComic = async (id: string) => {
    const comic = await window.comicApi.getComic(id)
    if (comic) setView({ name: 'reader', comic })
  }

  /** 导入文件夹 → 刷新书库 → 自动打开 */
  const handleImport = async () => {
    const comic = await importFolder()
    if (comic) setView({ name: 'reader', comic })
  }

  /** 临时打开文件夹阅读，不入库 */
  const handleOpenTemp = async () => {
    const comic = await openTemp()
    if (comic) setView({ name: 'reader', comic })
  }

  /** 从阅读器返回书库并刷新列表 */
  const handleBack = async () => {
    setView({ name: 'library' })
    await loadLibrary()
  }

  if (view.name === 'reader') {
    return <Reader comic={view.comic} onBack={handleBack} />
  }

  return (
    <div className="app-frame">
      <TitleBar />
      <Library
        library={library}
        loading={loading}
        error={error}
        query={query}
        onSearch={setQuery}
        onImport={handleImport}
        onOpenTemp={handleOpenTemp}
        onOpenComic={openComic}
        onRemoveComic={removeComic}
      />
    </div>
  )
}
