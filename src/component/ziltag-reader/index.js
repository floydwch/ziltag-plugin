import React, {Component} from 'react'
import classNames from 'classnames'

require('./index.css')


class ZiltagReader extends Component {
  shouldComponentUpdate(next_props, next_state) {
    return false
  }

  render() {
    const {
      actors,
      client_state
    } = this.props

    const {
      deactivate_ziltag_reader
    } = actors

    const {
      is_mobile
    } = client_state

    const src = `${SERVER_ADDRESS}/reader`
    const style = {
      zIndex: MAX_Z_INDEX,
    }

    // TODO: eliminated the cover div
    return  <div
      style={style}
      className='ziltag-ziltag-reader-cover'
      onClick={deactivate_ziltag_reader}
    >
      <iframe
        className={
          classNames('ziltag-ziltag-reader', {
            'ziltag-ziltag-reader--mobile': is_mobile
          })
        }
        src={src}
      >
      </iframe>
    </div>
  }
}

export default ZiltagReader
