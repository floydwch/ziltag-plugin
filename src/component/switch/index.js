import React from 'react'

require('./index.css')


export const meta_class_name = 'ziltag-switch'

class Switch extends React.Component {
  render() {
    const {img_id, map_id, x, y, onClick, onMouseEnter, onMouseOut} = this.props
    const style = {top: y, left: x, zIndex: MAX_Z_INDEX - 1}

    return <div
      style={style}
      className={meta_class_name}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
    >
    </div>
  }
}

export default Switch
