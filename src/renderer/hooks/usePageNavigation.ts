/**
 * 页面导航 hook
 *
 * 管理当前页码状态、视口和页面 DOM 引用。
 * 包含三个副作用：
 * 1. 定位到初始阅读位置
 * 2. 滚动时跟踪当前页（scroll 模式）
 * 3. 单页模式下鼠标滚轮翻页
 */
import { useEffect, useRef, useState } from 'react'
import type { ComicDetail, ReaderSettings } from '../types/comic'

export type UsePageNavigationReturn = {
  currentPage: number
  viewportRef: React.RefObject<HTMLDivElement | null>
  pageRefs: React.MutableRefObject<Array<HTMLDivElement | null>>
}

export function usePageNavigation(
  comic: ComicDetail,
  settings: ReaderSettings
): UsePageNavigationReturn {
  const [currentPage, setCurrentPage] = useState(comic.currentPageIndex)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])

  // 打开漫画时滚动到上次阅读位置
  useEffect(() => {
    const node = pageRefs.current[comic.currentPageIndex]
    node?.scrollIntoView({ block: 'start' })
  }, [comic.currentPageIndex])

  // 滚动时跟踪当前页：比较每页 offsetTop 与视口 scrollTop，取距离最小者
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleScroll = () => {
      const viewportTop = viewport.scrollTop
      let best = 0
      let bestDistance = Infinity
      for (let i = 0; i < pageRefs.current.length; i++) {
        const node = pageRefs.current[i]
        if (!node) continue
        const distance = Math.abs(node.offsetTop - viewportTop)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      }
      setCurrentPage(best)
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    requestAnimationFrame(handleScroll)

    return () => viewport.removeEventListener('scroll', handleScroll)
  }, [comic.pages.length])

  // 单页模式：鼠标滚轮切换页面
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || settings.readingMode !== 'single') return

    let ticking = false
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (event.deltaY > 0) {
          const next = Math.min(comic.pages.length - 1, currentPage + 1)
          pageRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          const prev = Math.max(0, currentPage - 1)
          pageRefs.current[prev]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        ticking = false
      })
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [settings.readingMode, currentPage, comic.pages.length])

  return { currentPage, viewportRef, pageRefs }
}
