import React from 'react'

import Ziltag from '../ziltag'
import ZiltagPreview from '../ziltag-preview'
import Switch from '../switch'

require('./index.css')


class ZiltagMap extends React.Component {
  render() {
    const {
      x, y, width, height, map_id, enable_switch, autoplay, ziltags_activated, switch_activated,
      ziltags,
      ziltag_preview,
      user,
      client_state,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      actors
    } = this.props

    const {
      load_ziltag,
      activate_ziltag_reader,
      activate_ziltag_preview,
      deactivate_ziltag_preview,
      deactivate_ziltag_map_ziltags,
      deactivate_ziltag_map_switch
    } = actors

    const style = {
      top: y,
      left: x,
      zIndex: MAX_Z_INDEX - 4,
      width,
      height
    }

    const {
      is_mobile
    } = client_state

    const radius = 12

    const tag_ziltags = []
    for (let i = 0; i < (ziltags || []).length; ++i) {
      const ziltag = ziltags[i]
      const ziltag_id = ziltag.id

      tag_ziltags.push(
        <Ziltag
          key={`ziltag-${ziltag_id}`}
          style={{
            top: ziltag.y * height - radius,
            left: ziltag.x * width - radius,
            zIndex: MAX_Z_INDEX - 3
          }}
          onClick={() => {
            if (is_mobile) {
              load_ziltag({id: ziltag_id})
            }
            if (!(is_mobile || autoplay)) {
              deactivate_ziltag_map_ziltags({map_id})
            }
            deactivate_ziltag_map_switch({map_id})
            activate_ziltag_reader({map_id, ziltag_id, is_mobile})
          }}
          onMouseEnter={() => {
            load_ziltag({id: ziltag_id})
            if (!is_mobile) {
              activate_ziltag_preview({map_id, ziltag_id})
            }
          }}
          onMouseLeave={deactivate_ziltag_preview}
        />
      )

      if (ziltag.x >= 0.5) {
        var side = 'right'
      } else {
        var side = 'left'
      }

      if (ziltag.y * height < 30) {
        side = 'upper-' + side
      } else if (height - ziltag.y * height < 30) {
        side = 'lower-' + side
      }

      if (ziltag.id && ziltag_preview.ziltag_id == ziltag.id) {
        var tag_ziltag_preview = <ZiltagPreview
          x={ziltag.x * width}
          y={ziltag.y * height}
          side={side}
          content={ziltag.content}
          usr={ziltag.usr}
        />
      }
    }

    const switch_width = 52

    const boo = !is_mobile &&
        user.permissions && user.permissions.includes('create_ziltag') &&
        ziltags_activated &&
        enable_switch

    return <div
      style={style}
      className='ziltag-ziltag-map'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
    >
      {
        !is_mobile &&
        user.permissions && user.permissions.includes('create_ziltag') &&
        enable_switch &&
        switch_activated &&
        <Switch map_id={map_id} x={width - switch_width} y={0} actors={actors}/>
      }
      {tag_ziltags}
      {tag_ziltag_preview}
    </div>
  }
}

export default ZiltagMap
