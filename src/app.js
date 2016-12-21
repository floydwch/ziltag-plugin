import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import * as app_actors from './actor'
import ZiltagMap from './component/ziltag-map'
import ZiltagReader from './component/ziltag-reader'

import {ENABLE_DEVTOOL} from '../env'


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
      ziltags,
      ziltag_preview,
      ziltag_reader,
      user,
      client_state,
      dispatch
    } = this.props

    const actors = bindActionCreators(app_actors, dispatch)
    const {
      load_ziltag_map,
      load_ziltag,
      deactivate_ziltag_reader
    } = actors

    const {
      is_mobile,
      bowser
    } = client_state

    if (process.env.NODE_ENV != 'production' && ENABLE_DEVTOOL) {
      var DevTools = require('./devtool').default
    }

    const ziltag_map_components = Object.keys(ziltag_maps).map(id => {
      const {
        ziltags_activated,
        switch_activated,
        img_id,
        map_id,
        x,
        y,
        width,
        height,
        meta: {
          enable_switch,
          autoplay,
        }
      } = ziltag_maps[id]

      if (ziltags_activated) {
        return (
          <ZiltagMap
            key={img_id}
            actors={actors}
            img_id={img_id}
            map_id={map_id}
            x={x}
            y={y}
            width={width}
            height={height}
            ziltags_activated={ziltags_activated}
            switch_activated={switch_activated}
            enable_switch={enable_switch}
            autoplay={autoplay}
            ziltags={ziltags[map_id]}
            ziltag_preview={ziltag_preview}
            user={user}
            client_state={client_state}
            onTouchStart={() => {
              load_ziltag_map({id: map_id})
              ziltags[map_id].forEach(ziltag => {
                load_ziltag({id: ziltag.id})
              })
            }}
          />
        )
      }
    })

    const activated = !!ziltag_reader.map_id

    const reader_cover_style = {
      display: bowser.firefox || is_mobile || activated ? 'block' : 'none',
      visibility: is_mobile || activated ? 'visible' : 'hidden',
      pointerEvents: activated ? 'auto' : 'none',
      zIndex: MAX_Z_INDEX
    }

    return <div className='ziltag-app'>
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
        ziltag_map_components
      }
      {
        process.env.NODE_ENV != 'production' && ENABLE_DEVTOOL
        ? this.state.is_mounted && <DevTools/>
        : ''
      }
    </div>
  }
}

export default connect(state => state)(ZiltagApp)
