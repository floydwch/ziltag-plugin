import React from 'react'
import classNames from 'classnames'

require('./index.css')


class ZiltagPreview extends React.Component {
  render() {
    const { x, y, side, content, usr } = this.props
    const style = { zIndex: MAX_Z_INDEX - 2 }
    const
      ziltag_radius = 6,
      width = 172,
      height = 60,
      margin = 2

    if (side == 'right') {
      var preview_class = 'ziltag-ziltag-preview--right'
      var preview_board_class = 'ziltag-ziltag-preview__board--right'
      style.top = y - height / 2
      style.left = x - (ziltag_radius + margin + width)
    } else if (side == 'left') {
      var preview_class = 'ziltag-ziltag-preview--left'
      var preview_board_class = 'ziltag-ziltag-preview__board--left'
      style.top = y - height / 2
      style.left = x + (ziltag_radius + margin)
    } else if (side == 'upper-right') {
      var preview_class = 'ziltag-ziltag-preview--upper-right'
      var preview_board_class = 'ziltag-ziltag-preview__board--upper-right'
      style.top = y
      style.left = x - (ziltag_radius + margin + width)
    } else if (side == 'upper-left') {
      var preview_class = 'ziltag-ziltag-preview--upper-left'
      var preview_board_class = 'ziltag-ziltag-preview__board--upper-left'
      style.top = y
      style.left = x + (ziltag_radius + margin)
    } else if (side == 'lower-right') {
      var preview_class = 'ziltag-ziltag-preview--lower-right'
      var preview_board_class = 'ziltag-ziltag-preview__board--lower-right'
      style.top = y - height
      style.left = x - (ziltag_radius + margin + width)
    } else if (side == 'lower-left') {
      var preview_class = 'ziltag-ziltag-preview--lower-left'
      var preview_board_class = 'ziltag-ziltag-preview__board--lower-left'
      style.top = y - height
      style.left = x + (ziltag_radius + margin)
    }

    return <div style={style} className={classNames('ziltag-ziltag-preview', preview_class)}>
      <div className={
        classNames('ziltag-ziltag-preview__board', preview_board_class)
      }>
        <div className='ziltag-ziltag-preview__board__content'>{content}</div>
        <div style={{ fontSize: 12 }} className='ziltag-ziltag-preview__board__publisher'>by {usr.name}</div>
      </div>
    </div>
  }
}

export default ZiltagPreview
