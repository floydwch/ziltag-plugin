import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as app_actors from './actor'
import ZiltagMap from './component/ziltag-map'
import ZiltagReader from './component/ziltag-reader'


class ZiltagApp extends Component {
  constructor(props) {
    super(props)
    this.state = {is_mounted: false}
  }

  componentDidMount() {
    this.setState({is_mounted: true})
  }

  render() {
    const {
      ziltag_maps,
      ziltag_preview,
      ziltag_reader,
      dispatch
    } = this.props

    const actions = bindActionCreators(app_actors, dispatch)

    if (process.env.NODE_ENV != 'production') {
      var DevTools = require('./devtool').default
    }

    const current_ziltag_map = ziltag_maps[Object.keys(ziltag_maps).find((id) => {
      return ziltag_maps[id].activated
    })] || {}

    return <div>
      {
        current_ziltag_map.map_id &&
        <ZiltagMap
          actions={actions}
          map_id={current_ziltag_map.map_id}
          x={current_ziltag_map.x}
          y={current_ziltag_map.y}
          width={current_ziltag_map.width}
          height={current_ziltag_map.height}
          ziltags={current_ziltag_map.ziltags}
          ziltag_preview={ziltag_preview}
        />
      }
      {
        ziltag_reader.map_id &&
        <ZiltagReader
          actions={actions}
          map_id={ziltag_reader.map_id}
          ziltag_id={ziltag_reader.ziltag_id}
        />
      }
      {
        process.env.NODE_ENV != 'production'
        ? this.state.is_mounted && <DevTools/>
        : ''
      }
    </div>
  }
}

function mapStateToProps(state) {
  const {ziltag_maps, ziltag_preview, ziltag_reader} = state
  return {
    ziltag_maps,
    ziltag_preview,
    ziltag_reader
  }
}

export default connect(mapStateToProps)(ZiltagApp)
