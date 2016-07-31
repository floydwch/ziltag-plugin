import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

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
      load_ziltag,
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
            onTouchStart={() => {
              load_ziltag_map({id: map_id})
              ziltags.forEach(ziltag => {
                load_ziltag({id: ziltag.id})
              })
            }}
          />
        )
      }
    })

    const activated = !!ziltag_reader.map_id

    var reader_cover_style = {
      zIndex: MAX_Z_INDEX
    }

    var reader_cover_style = {
      ...reader_cover_style,
      display: is_mobile || activated ? 'block' : 'none',
      pointerEvents: activated ? 'auto' : 'none'
    }

    return <div>
      {
        ziltag_map_components
      }
      {
        <div
          className={classNames(
            'ziltag-ziltag-reader-cover', {
              'ziltag-ziltag-reader-cover--mobile': is_mobile
            }
          )}
          style={reader_cover_style}
          onClick={() => {
            if (!is_mobile) {
              deactivate_ziltag_reader({is_mobile})
            }
          }}
        >
          <ZiltagReader
            actors={actors}
            client_state={client_state}
            map_id={ziltag_reader.map_id}
            ziltag_id={ziltag_reader.ziltag_id}
            activated={activated}
          />
        </div>
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
  const {client_state, ziltag_maps, ziltag_preview, ziltag_reader} = state
  return {
    client_state,
    ziltag_maps,
    ziltag_preview,
    ziltag_reader
  }
}

export default connect(mapStateToProps)(ZiltagApp)
