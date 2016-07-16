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
      client_state,
      dispatch
    } = this.props

    const actors = bindActionCreators(app_actors, dispatch)
    const {
      load_ziltag_map,
      deactivate_ziltag_map,
      deactivate_ziltag_reader
    } = actors

    const {
      is_mobile
    } = client_state

    if (process.env.NODE_ENV != 'production') {
      var DevTools = require('./devtool').default
    }

    const ziltag_map_components = Object.keys(ziltag_maps).map(id => {
      const {
        activated,
        map_id,
        x,
        y,
        width,
        height,
        ziltags
      } = ziltag_maps[id]

      if (activated) {
        return (
          <ZiltagMap
            key={map_id}
            actors={actors}
            map_id={map_id}
            x={x}
            y={y}
            width={width}
            height={height}
            ziltags={ziltags}
            ziltag_preview={ziltag_preview}
            client_state={client_state}
            onMouseEnter={() => load_ziltag_map({id: map_id})}
            onMouseLeave={() => {
              if (!is_mobile) {
                deactivate_ziltag_map({is_mobile})
              }
            }}
          />
        )
      }
    })

    var reader_cover_style = {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: ziltag_reader.map_id ? 'block' : 'none',
      position: 'fixed'
    }

    if (is_mobile) {
      var reader_cover_style = {
        ...reader_cover_style,
        overflow: 'scroll',
        background: 'white',
        zIndex: MAX_Z_INDEX
      }
    } else {
      var reader_cover_style = {
        ...reader_cover_style,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: MAX_Z_INDEX
      }
    }

    return <div>
      {
        ziltag_map_components
      }
      {
        <div
          className='ziltag-ziltag-reader-cover'
          style={reader_cover_style}
          onClick={() => {
            if (!is_mobile) {
              deactivate_ziltag_reader()
            }
          }}
        >
          <ZiltagReader
            actors={actors}
            client_state={client_state}
            map_id={ziltag_reader.map_id}
            ziltag_id={ziltag_reader.ziltag_id}
          />
        </div>
      }
    </div>
  }
}

function mapStateToProps(state) {
  const {client_state, ziltag_maps, ziltag_preview, ziltag_reader} = state
  return {
    client_state,
    ziltag_maps,
    ziltag_preview,
    ziltag_reader
  }
}

export default connect(mapStateToProps)(ZiltagApp)
