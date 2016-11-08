import React from 'react'

import Ziltag, {meta_class_name as ziltag_class_name} from '../ziltag'
import CoDiv from '../CoDiv'
import ZiltagPreview from '../ZiltagPreview'
import Switch from '../switch'

require('./index.css')


export const meta_class_name = 'ziltag-ziltag-map'

class ZiltagMap extends React.Component {
  render() {
    const {
      x, y, width, height, img_id, map_id, enable_switch, autoplay, switch_activated,
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
      load_ziltag_map,
      activate_ziltag_reader,
      activate_ziltag_preview,
      deactivate_ziltag_preview,
      deactivate_ziltag_map_ziltags,
      deactivate_ziltag_map_switch
    } = actors

    const style = {
      top: y,
      left: x,
      zIndex: MAX_Z_INDEX - 3,
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
            zIndex: MAX_Z_INDEX - 2
          }}
          onClick={() => {
            if (is_mobile) {
              load_ziltag({id: ziltag_id})
            }
            if (!(is_mobile || autoplay)) {
              deactivate_ziltag_map_ziltags({img_id})
            }
            activate_ziltag_reader({img_id, map_id, ziltag_id, is_mobile})
          }}
          onMouseEnter={() => {
            load_ziltag({id: ziltag_id})
            if (!is_mobile) {
              activate_ziltag_preview({img_id, ziltag_id})
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
        zIndex: MAX_Z_INDEX - 1
      }

      if (direction == 'left') {
        co_div_style.right = width - ziltag.x * width + x_offset
      } else if (direction == 'right') {
        co_div_style.left = ziltag.x * width + x_offset
      }

      if (
        ziltag.id &&
        ziltag_preview.ziltag_id === ziltag.id &&
        ziltag_preview.img_id === img_id
      ) {
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
        <Switch
          img_id={img_id}
          map_id={map_id}
          style={{top: 0, left: width - switch_width, zIndex: MAX_Z_INDEX - 1}}
          onClick={() => activate_ziltag_reader({img_id, map_id})}
          onMouseEnter={() => load_ziltag_map({id: map_id})}
          onMouseOut={e => {
            const not_on_img = !(
              e.relatedTarget &&
              e.relatedTarget.dataset &&
              e.relatedTarget.dataset.ziltagImgId === img_id
            )
            const not_on_ziltag = !e.relatedTarget.classList.contains(
              ziltag_class_name
            )

            if (not_on_img && not_on_ziltag) {
              deactivate_ziltag_map_switch({img_id})
              if (!autoplay) {
                deactivate_ziltag_map_ziltags({img_id})
              }
            }
          }}
        />
      }
        {tag_ziltags}
        {tag_ziltag_preview}
      </div>
    )
  }
}

export default ZiltagMap
