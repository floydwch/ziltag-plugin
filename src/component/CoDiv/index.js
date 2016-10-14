import React, {Component} from 'react'
import classNames from 'classnames'

require('./index.css')


export default ({style, direction, children, className}) => (
  <div
    style={style}
    className={
      classNames('ziltag-co-div', {
        'ziltag-co-div--left': direction == 'left',
        'ziltag-co-div--right': direction == 'right'
      }, className)
    }
  >
    {children}
  </div>
)
