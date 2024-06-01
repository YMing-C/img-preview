import React from 'react'
import { LeftOutlined } from '@ant-design/icons'
import './index.less'
import { TriggerProps } from './interface'

const Trigger: React.FC<TriggerProps> = ({ onClick, rotate }) => {
  return (
    <div className={`ym-sidebar-trigger ${rotate ? ' ym-sidebar-trigger-rotate' : ''}`} onClick={onClick}>
      <LeftOutlined style={{ fontSize: 12 }} />
    </div>
  )
}

export default Trigger
