import React from 'react'
import classNames from 'classnames'

require('./index.css')


export const meta_class_name = 'ziltag-co-div'

export default ({style, direction, children, className}) => (
  <div
    style={style}
    className={
      classNames(meta_class_name, {
        'ziltag-co-div--left': direction == 'left',
        'ziltag-co-div--right': direction == 'right'
      }, className)
    }
  >
    {children}
  </div>
)
