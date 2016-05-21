import React from 'react'

require('./index.css')


class Switch extends React.Component {
  render() {
    const {map_id, x, y, actors} = this.props
    const style = { top: y, left: x, zIndex: MAX_Z_INDEX - 1 }

    return <div
      style={style}
      className='ziltag-switch'
      onClick={() => actors.activate_ziltag_reader({map_id})}
      onMouseLeave={
        (e) => {
          if (e.nativeEvent.relatedTarget.nodeName != 'IMG') {
            actors.deactivate_ziltag_map()
          }
        }
      }
    >
    </div>
  }
}

export default Switch
