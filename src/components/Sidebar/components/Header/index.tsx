import React, { useCallback, useEffect, useMemo } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import './index.less'
import { debounce } from 'lodash'
import { useDirectoryContext } from 'context'
import { readDirectory, writeDirectory } from 'utils/file'

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

  const init = useCallback(async () => {
    const directoryList = await readDirectory()
    setDirectoryList(directoryList)
  }, [setDirectoryList])

  useEffect(() => {
    const listener = async (e, res) => {
      // 获取文件夹名称
      const pathArr = res.path.split('\\')
      const directoryName = pathArr[pathArr.length - 1]
      // 删除图片后缀
      const list = res.list.map(name => {
        return name.replace(/(\.jpg)|(\.jpeg)|(\.png)$/, '')
      })

      const directoryList = await readDirectory()
      const newDirectoryList = [
        ...directoryList,
        {
          id: crypto.randomUUID(),
          name: directoryName,
          list: list,
          path: res.path,
          originList: res.list,
        },
      ]

      writeDirectory(newDirectoryList)

      setDirectoryList(newDirectoryList)
    }

    ipcRenderer.on('selected-directory', listener)
    return () => {
      ipcRenderer.off('selected-directory', listener)
    }
  }, [setDirectoryList])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="ym-header">
      <div className="ym-logo">IMG-PREVIEW</div>
      <PlusCircleOutlined className="ym-add-icon" onClick={debounceClickHandler} />
    </div>
  )
}

export default Header
