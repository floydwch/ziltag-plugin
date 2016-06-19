import React from 'react'

require('./index.css')


class Switch extends React.Component {
  render() {
    const {map_id, x, y, actors} = this.props
    const {
      activate_ziltag_reader,
      deactivate_ziltag_map,
      load_ziltag_map
    } = actors
    const style = {top: y, left: x, zIndex: MAX_Z_INDEX - 1}

    return <div
      style={style}
      className='ziltag-switch'
      onClick={() => activate_ziltag_reader({map_id})}
      onMouseEnter={() => load_ziltag_map({id: map_id})}
      onMouseLeave={
        (e) => {
          if (e.nativeEvent.relatedTarget.nodeName != 'IMG') {
            deactivate_ziltag_map()
          }
        }
      }
    >
    </div>
  }
}

export default Switch
