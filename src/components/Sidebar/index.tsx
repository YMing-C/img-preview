import React, { useState } from 'react'
import './index.less'
import { Menu, Header, Trigger } from './components'

const Sidebar: React.FC = () => {
  const [stowSideBar, setStowSideBar] = useState<boolean>(false)

  const triggerSideBarHandler = () => {
    setStowSideBar(!stowSideBar)
  }

  return (
    <div className={`ym-sidebar${stowSideBar ? ' ym-sidebar-stow' : ''}`}>
      <Header />
      <Menu />
      <Trigger onClick={triggerSideBarHandler} rotate={stowSideBar} />
    </div>
  )
}

export default Sidebar
