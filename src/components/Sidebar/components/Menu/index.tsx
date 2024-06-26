import React, { useEffect, useMemo, useState } from 'react'
import './index.less'
import ArrowIcon from 'components/ArrowIcon'
import { Input } from 'antd'
import { PER_ROW_COUNT, SINGLE_ROW_HEIGHT } from './constant'
import { useDirectoryContext, dataType, useGetSelectedDirectory } from 'context'

const Menu: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>()
  const [subItemHeight, setSubItemHeight] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const [directoryList] = useDirectoryContext()
  const [, setSelectedDirectory] = useGetSelectedDirectory()

  const showDirectoryList = useMemo(() => {
    return directoryList.flatMap(info => {
      if (~info.name.indexOf(searchValue)) {
        return [info]
      }
      return []
    })
  }, [searchValue, directoryList])

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
    setSearchValue(e.target.value)
  }

  const clickHandler = (key: string) => {
    if (key === activeKey) setActiveKey(undefined)
    else setActiveKey(key)
  }

  const selectImgHandler = (directory: dataType, img: string) => {
    const idx = directory.list.findIndex(c => c === img)
    const fullPath = directory.originList.map(c => `${directory.path}\\${c}`)

    setSelectedDirectory({
      list: fullPath.splice(idx),
    })
  }

  useEffect(() => {
    const activeItem = directoryList.find(c => c.id === activeKey)
    const height = Math.ceil((activeItem?.list?.length || 0) / PER_ROW_COUNT)

    setSubItemHeight(height * SINGLE_ROW_HEIGHT)
  }, [activeKey, directoryList])

  return (
    <>
      <div className="ym-nav-search">
        <Input placeholder="emmm.." value={searchValue} onChange={changeHandler} />
      </div>
      <ul className="ym-menu">
        {showDirectoryList.map(c => {
          return (
            <li key={c.id}>
              <div
                className="ym-menu-title"
                onClick={() => {
                  clickHandler(c.id)
                }}>
                {c.name} <ArrowIcon trigger={activeKey === c.id} />
              </div>
              <ul className="ym-subitem-menu" style={{ height: activeKey === c.id ? `${subItemHeight}px` : 0 }}>
                {c.list.map(s => (
                  <li
                    className="ym-subitem"
                    key={s}
                    onClick={() => {
                      selectImgHandler(c, s)
                    }}>
                    {s}
                  </li>
                ))}
                {Array.from({ length: PER_ROW_COUNT }).map((_, idx) => (
                  <div key={idx} className="ym-empty-item" />
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Menu
