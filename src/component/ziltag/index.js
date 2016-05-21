import React from 'react'

require('./index.css')


class Ziltag extends React.Component {
  render() {
    const {
      ziltag_id, map_id, x, y, client_state, actors
    } = this.props

    const {
      deactivate_ziltag_map,
      activate_ziltag_reader,
      activate_ziltag_preview,
      deactivate_ziltag_preview,
      goto_ziltag_page
    } = actors

    const radius = 12
    const style = {
      top: y - radius,
      left: x - radius,
      zIndex: MAX_Z_INDEX - 3
    }

    return <div
      className='ziltag-ziltag'
      style={style}
      onClick={() => {
        if (client_state.is_mobile) {
          goto_ziltag_page({id: ziltag_id})
        }
        else {
          deactivate_ziltag_map()
          activate_ziltag_reader({map_id, ziltag_id})
        }
      }}
      onMouseEnter={() => activate_ziltag_preview({map_id, ziltag_id})}
      onMouseLeave={deactivate_ziltag_preview}
    ></div>
  }
}

export default Ziltag
