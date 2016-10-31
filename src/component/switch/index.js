import React from 'react'

require('./index.css')


export const meta_class_name = 'ziltag-switch'

class Switch extends React.Component {
  render() {
    const {img_id, map_id, x, y, actors} = this.props
    const {
      activate_ziltag_reader,
      load_ziltag_map
    } = actors
    const style = {top: y, left: x, zIndex: MAX_Z_INDEX - 1}

    return <div
      style={style}
      className={meta_class_name}
      onClick={() => activate_ziltag_reader({img_id, map_id})}
      onMouseEnter={() => load_ziltag_map({id: map_id})}
    >
    </div>
  }
}

export default Switch
