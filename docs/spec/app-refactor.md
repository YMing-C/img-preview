# Spec: App.tsx 模块拆分

## 动机

`App.tsx` 当前约 420 行，包含了标题栏、书库视图、阅读器视图、设置管理、页面跟踪、滚轮导航、键盘快捷键、进度保存等多个职责，违反单一职责原则。按功能拆分为独立模块，提升可维护性。

## 拆分原则

- **按功能职责拆分**，不是按行数
- **Hook 封装状态逻辑**，组件只负责渲染和组合 hook
- **保持现有行为不变**，纯重构，不改功能
- **不新增依赖**

## 目标文件结构

```
src/renderer/
├── App.tsx                         # 根组件：视图切换，~30 行
├── main.tsx                        # 不变
├── styles.css                      # 不变
├── types/                          # 不变
│   ├── comic.ts
│   └── electron.d.ts
├── components/
│   ├── TitleBar.tsx                # 自定义标题栏（无边框窗口）
│   ├── Library.tsx                 # 书库页：搜索、网格、空状态
│   ├── Reader.tsx                  # 阅读器：组合 hook + 渲染
│   └── ReaderToolbar.tsx           # 阅读器工具栏
└── hooks/
    ├── useLibrary.ts               # 书库数据：加载、导入、删除
    ├── useReaderSettings.ts        # 设置持久化 + 缩放逻辑
    ├── usePageNavigation.ts        # 页面跟踪（scroll）+ 单页滚轮翻页
    ├── useAutoSaveProgress.ts      # 防抖自动保存进度
    └── useKeyboardShortcuts.ts     # 键盘快捷键
```

## 组件树 & 数据流

```
App
├── TitleBar                          # 纯 UI，无 props
├── [library view]
│   └── Library
│       props: library, loading, error, query, onSearch, onImport, onOpenTemp,
│              onOpenComic, onRemoveComic
└── [reader view]
    └── Reader({ comic, onBack })
        ├── useReaderSettings()        → { settings, saveSettings, updateZoom }
        ├── usePageNavigation()        → { currentPage, viewportRef, pageRefs }
        ├── useAutoSaveProgress()      → (副作用，无返回值)
        ├── useKeyboardShortcuts()     → (副作用，无返回值)
        │
        └── ReaderToolbar
            props: comic, currentPage, settings, onBack,
                   onSaveSettings, onToggleFullscreen, fullscreen
```

## 各模块详细规格

### components/TitleBar.tsx

**职责**：无边框窗口的自定义标题栏，提供拖拽区域和窗口控制按钮。

**来源**：App.tsx 第 56-93 行，直接搬移。

**Props**：无（全部通过 `window.comicApi` 操作）。

### components/Library.tsx

**职责**：渲染书库页面的搜索栏、漫画网格、空状态提示。

**Props**：

```typescript
type LibraryProps = {
  library: Comic[]
  loading: boolean
  error: string | null
  query: string
  onSearch: (query: string) => void
  onImport: () => void
  onOpenTemp: () => void
  onOpenComic: (id: string) => void
  onRemoveComic: (id: string) => void
}
```

**来源**：App.tsx 第 161-209 行（`App` 组件中 `view.name !== 'reader'` 时渲染的 JSX）。

**包含的辅助函数**（从 App.tsx 搬入，不作为 export）：
- `fileUrl()`
- `progressOf()`
- `statusLabel()`

### components/Reader.tsx

**职责**：阅读器主组件，组合所有 reader hook，渲染 viewport 和页面图片。

**Props**：

```typescript
type ReaderProps = {
  comic: ComicDetail
  onBack: () => void | Promise<void>
}
```

**内部结构**：

```typescript
function Reader({ comic, onBack }: ReaderProps) {
  const { settings, saveSettings, updateZoom } = useReaderSettings()
  const { currentPage, viewportRef, pageRefs } = usePageNavigation({
    comic, settings, initialPage: comic.currentPageIndex
  })
  const [fullscreen, setFullscreen] = useState(false)
  const toggleFullscreen = useCallback(async () => { ... }, [fullscreen])

  useAutoSaveProgress({ comic, currentPage })
  useKeyboardShortcuts({ comic, currentPage, settings, saveSettings, updateZoom,
                          fullscreen, toggleFullscreen, onBack, pageRefs })

  const pageStyle = useMemo(...)  // 缩放计算

  return (
    <div className="app-frame" style={{ background: backgrounds[settings.background] }}>
      <TitleBar />
      <div className="reader-content">
        <ReaderToolbar ... />
        <section className={`reader-viewport${...}`} ref={viewportRef}>
          {comic.pages.map(...)}
        </section>
      </div>
    </div>
  )
}
```

### components/ReaderToolbar.tsx

**职责**：阅读器顶部工具栏：返回按钮、标题+页码、缩放选择、背景色选择、模式切换、全屏按钮。

**Props**：

```typescript
type ReaderToolbarProps = {
  comic: ComicDetail
  currentPage: number
  settings: ReaderSettings
  fullscreen: boolean
  onBack: () => void
  onSaveSettings: (settings: ReaderSettings) => void
  onToggleFullscreen: () => void
}
```

### hooks/useLibrary.ts

**职责**：封装书库 CRUD 操作。

**返回值**：

```typescript
type UseLibraryReturn = {
  library: Comic[]
  loading: boolean
  error: string | null
  loadLibrary: () => Promise<void>
  importFolder: () => Promise<void>
  openTemp: () => Promise<void>
  removeComic: (id: string) => Promise<void>
}
```

### hooks/useReaderSettings.ts

**职责**：阅读器设置的加载、保存和缩放步进。

**返回值**：

```typescript
type UseReaderSettingsReturn = {
  settings: ReaderSettings
  saveSettings: (next: ReaderSettings) => Promise<void>
  updateZoom: (direction: 1 | -1) => void
}
```

### hooks/usePageNavigation.ts

**职责**：滚动时跟踪当前页（scroll 模式），单页模式下滚轮翻页。

**参数**：

```typescript
type UsePageNavigationParams = {
  comic: ComicDetail
  settings: ReaderSettings
  initialPage: number
}
```

**返回值**：

```typescript
type UsePageNavigationReturn = {
  currentPage: number
  viewportRef: React.RefObject<HTMLDivElement | null>
  pageRefs: React.MutableRefObject<Array<HTMLDivElement | null>>
}
```

**内部**：包含 scroll 事件监听（跟踪当前页）+ wheel 事件监听（单页模式翻页）。

### hooks/useAutoSaveProgress.ts

**职责**：500ms 防抖后自动保存阅读进度。

**参数**：`{ comic: ComicDetail, currentPage: number }`

**返回值**：无（纯副作用 hook）。

### hooks/useKeyboardShortcuts.ts

**职责**：注册/注销全局键盘快捷键：Escape、F、方向键、+/-/0、Home、End。

**参数**：

```typescript
type UseKeyboardShortcutsParams = {
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
```

## App.tsx 重构后

```typescript
import { useLibrary } from './hooks/useLibrary'
import { TitleBar } from './components/TitleBar'
import { Library } from './components/Library'
import { Reader } from './components/Reader'

export function App(): ReactElement {
  const [view, setView] = useState<View>({ name: 'library' })
  const [query, setQuery] = useState('')
  const { library, loading, error, loadLibrary, importFolder, openTemp, removeComic } = useLibrary()

  useEffect(() => { void loadLibrary() }, [loadLibrary])

  const handleBack = useCallback(async () => {
    setView({ name: 'library' })
    await loadLibrary()
  }, [loadLibrary])

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
        onImport={importFolder}
        onOpenTemp={openTemp}
        onOpenComic={(id) => { /* openComic logic */ }}
        onRemoveComic={removeComic}
      />
    </div>
  )
}
```

## 不改动

- `main.tsx`（入口）
- `styles.css`
- `types/comic.ts`、`types/electron.d.ts`
- `preload/index.ts`
- `main/` 下所有文件

## 验证

1. `npm run typecheck` 通过
2. 启动应用，确认书库页功能：导入、搜索、网格展示、删除、临时打开
3. 确认阅读器功能：滚动阅读、页码跟踪、缩放、背景色、全屏
4. 确认单页模式：切换、滚轮翻页、方向键
5. 确认快捷键全部正常
6. 确认进度保存和恢复
