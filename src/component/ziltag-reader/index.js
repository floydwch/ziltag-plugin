import React, {Component} from 'react'

require('./index.css')


class ZiltagReader extends Component {
  shouldComponentUpdate(next_props, next_state) {
    return false
  }

  render() {
    const {deactivate_ziltag_reader} = this.props.actors
    const src = `${SERVER_ADDRESS}/reader`
    const style = {
      zIndex: MAX_Z_INDEX,
    }

    return  <div
      style={style}
      className='ziltag-ziltag-reader-cover'
      onClick={deactivate_ziltag_reader}
    >
      <iframe className='ziltag-ziltag-reader' src={src}></iframe>
    </div>
  }
}

export default ZiltagReader
