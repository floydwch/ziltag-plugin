import React from 'react'

require('./index.css')


export const meta_class_name = 'ziltag-switch'

export default ({img_id, map_id, x, y, style, onClick, onMouseEnter, onMouseOut}) => (
  <div
    style={style}
    className={meta_class_name}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseOut={onMouseOut}
  />
)
