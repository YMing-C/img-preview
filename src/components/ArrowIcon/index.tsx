import React from 'react'
import './index.less'
import { ArrowIconProps } from './interface'

const ArrowIcon: React.FC<ArrowIconProps> = ({ trigger = false, style }) => {
  return (
    <div className="arrow-icon-wrap">
      <i className={`arrow-icon${trigger ? ' rotate' : ''}`} style={style} />
    </div>
  )
}

export default ArrowIcon
