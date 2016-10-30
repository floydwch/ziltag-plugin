import React from 'react'

import Ziltag from '../ziltag'
import CoDiv from '../CoDiv'
import ZiltagPreview from '../ZiltagPreview'
import Switch from '../switch'

require('./index.css')


export const meta_class_name = 'ziltag-ziltag-map'

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
      deactivate_ziltag_map_ziltags
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

    const radius = 10

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

      const direction = ziltag.x < 0.5 ? 'right' : 'left'
      const x_offset = 30
      const y_offset = -30

      const co_div_style = {
        top: ziltag.y * height + y_offset,
        zIndex: MAX_Z_INDEX - 2
      }

      if (direction == 'left') {
        co_div_style.right = width - ziltag.x * width + x_offset
      } else if (direction == 'right') {
        co_div_style.left = ziltag.x * width + x_offset
      }

      if (ziltag.id && ziltag_preview.ziltag_id === ziltag.id) {
        var tag_ziltag_preview = (
          <CoDiv
            className='ziltag-ziltag-map__co-div'
            style={co_div_style}
            direction={direction}
          >
            <ZiltagPreview
              content={ziltag.content}
              author={ziltag.usr.name}
            />
          </CoDiv>
        )
      }
    }

    const switch_width = 52

    return (
      <div
        style={style}
        className={meta_class_name}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
      > {
        !is_mobile &&
        user.permissions && user.permissions.includes('create_ziltag') &&
        enable_switch &&
        switch_activated &&
        <Switch map_id={map_id} x={width - switch_width} y={0} actors={actors}/>
      }
        {tag_ziltags}
        {tag_ziltag_preview}
      </div>
    )
  }
}

export default ZiltagMap
