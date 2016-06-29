import React from 'react'

import Ziltag from '../ziltag'
import ZiltagPreview from '../ziltag-preview'
import Switch from '../switch'

require('./index.css')


class ZiltagMap extends React.Component {
  render() {
    const {
      x, y, width, height, map_id,
      ziltags,
      ziltag_preview,
      client_state,
      onMouseEnter,
      onMouseLeave,
      actors
    } = this.props

    const style = {
      top: y,
      left: x,
      width,
      height
    }

    const {
      is_mobile
    } = client_state

    const tag_ziltags = []
    for (let i = 0; i < (ziltags || []).length; ++i) {
      const ziltag = ziltags[i]

      tag_ziltags.push(
        <Ziltag
          key={i}
          actors={actors}
          ziltag_id={ziltag.id}
          map_id={map_id}
          x={ziltag.x * width}
          y={ziltag.y * height}
          is_focused={ziltag.id && ziltag_preview.ziltag_id == ziltag.id}
          client_state={client_state}
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

    return <div
      style={style}
      className='ziltag-ziltag-map'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
    {
      !is_mobile &&
      <Switch map_id={map_id} x={width - switch_width} y={0} actors={actors}/>
    }
      {tag_ziltags}
      {tag_ziltag_preview}
    </div>
  }
}

export default ZiltagMap
