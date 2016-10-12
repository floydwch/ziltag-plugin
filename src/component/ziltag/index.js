import React from 'react'

require('./index.css')


export default ({style, onClick, onMouseEnter, onMouseLeave}) => (
  <div
    className='ziltag-ziltag'
    style={style}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
  </div>
)
