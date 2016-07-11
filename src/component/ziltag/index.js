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
      goto_ziltag_page,
      load_ziltag
    } = actors

    const {
      is_mobile
    } = client_state

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
        if (!is_mobile) {
          deactivate_ziltag_map()
        }
        activate_ziltag_reader({map_id, ziltag_id})
      }}
      onMouseEnter={() => {
        load_ziltag({id: ziltag_id})
        if (!is_mobile) {
          activate_ziltag_preview({map_id, ziltag_id})
        }
      }}
      onMouseLeave={deactivate_ziltag_preview}
    ></div>
  }
}

export default Ziltag
