/**
 * 书库页组件
 *
 * 渲染搜索栏、漫画卡片网格和空状态提示。
 * 所有数据和操作通过 props 注入，自身不持有业务状态。
 */
import type { ReactElement } from 'react'
import type { Comic } from '../types/comic'
import { fileUrl, progressOf, statusLabel } from '../utils'

export type LibraryProps = {
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

export function Library(props: LibraryProps): ReactElement {
  const { library, loading, error, query, onSearch, onImport, onOpenTemp, onOpenComic, onRemoveComic } = props

  const filtered = library.filter((comic) => comic.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <main className="app-shell">
      <header className="library-header">
        <div>
          <h1>漫画书库</h1>
        </div>
        <div className="header-actions">
          <input value={query} onChange={(event) => onSearch(event.target.value)} placeholder="搜索漫画" />
          <button onClick={onOpenTemp}>临时打开</button>
          <button className="primary" onClick={onImport}>导入文件夹</button>
        </div>
      </header>

      {error && <div className="notice error">{error}</div>}
      {loading && <div className="notice">正在加载书库...</div>}

      {!loading && filtered.length === 0 && (
        <section className="empty-state">
          <h2>{query ? '没有匹配的漫画' : '书库还空着'}</h2>
          <p>{query ? '换个关键词试试。' : '导入一个本地漫画文件夹开始阅读。'}</p>
          {!query && <button className="primary" onClick={onImport}>导入文件夹</button>}
        </section>
      )}

      <section className="comic-grid">
        {filtered.map((comic) => (
          <article className="comic-card" key={comic.id}>
            <button className="cover-button" onClick={() => onOpenComic(comic.id)}>
              {comic.coverPath ? <img src={fileUrl(comic.coverPath)} alt="" /> : <span>无封面</span>}
            </button>
            <div className="comic-meta">
              <h2 title={comic.title}>{comic.title}</h2>
              <p>{comic.pageCount} 页 · {statusLabel(comic)} · {progressOf(comic)}%</p>
              <div className="progress"><span style={{ width: `${progressOf(comic)}%` }} /></div>
              <div className="card-actions">
                <button onClick={() => onOpenComic(comic.id)}>继续阅读</button>
                <button className="ghost" onClick={() => onRemoveComic(comic.id)}>移除</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
