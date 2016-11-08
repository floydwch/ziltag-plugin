import React, {Component} from 'react'
import classNames from 'classnames'

require('./index.css')


export const meta_class_name = 'ziltag-ziltag-reader'

class ZiltagReader extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const {
      activated,
      client_state
    } = this.props

    const {
      is_mobile
    } = client_state

    const src = `${SERVER_ADDRESS}/reader`

    return (
      <iframe
        className={
          classNames(meta_class_name, {
            'ziltag-ziltag-reader--mobile': is_mobile,
            'ziltag-ziltag-reader--activated': activated
          })
        }
        src={src}
      >
      </iframe>
    )
  }
}

export default ZiltagReader
