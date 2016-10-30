import React from 'react'

require('./index.css')


export const meta_class_name = 'ziltag-ziltag'

export default ({style, onClick, onMouseEnter, onMouseLeave}) => (
  <div
    className={meta_class_name}
    style={style}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
  </div>
)
