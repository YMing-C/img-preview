import React, { useEffect, useMemo } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import './index.less'
import { debounce } from 'lodash'
import { useDirectoryContext } from 'context'

const { ipcRenderer } = window.require('electron')

const Header: React.FC = () => {
  const [, setDirectoryList] = useDirectoryContext()

  const debounceClickHandler = useMemo(
    () =>
      debounce(
        () => {
          ipcRenderer.send('open-directory-select-dialog')
        },
        200,
        { leading: true, trailing: false }
      ),
    []
  )

  useEffect(() => {
    const listener = (e, res) => {
      // 获取文件夹名称
      const pathArr = res.path.split('\\')
      const directoryName = pathArr[pathArr.length - 1]
      // 删除图片后缀
      const list = res.list.map(name => {
        return name.replace(/(\.jpg)|(\.jpeg)|(\.png)$/, '')
      })

      setDirectoryList([
        {
          id: crypto.randomUUID(),
          name: directoryName,
          list: list,
          path: res.path,
          originList: res.list,
        },
      ])
    }

    ipcRenderer.on('selected-directory', listener)
    return () => {
      ipcRenderer.off('selected-directory', listener)
    }
  }, [setDirectoryList])

  return (
    <div className="ym-header">
      <div className="ym-logo">IMG-PREVIEW</div>
      <PlusCircleOutlined className="ym-add-icon" onClick={debounceClickHandler} />
    </div>
  )
}

export default Header
