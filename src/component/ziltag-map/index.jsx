import React from 'react';

import Ziltag from '../ziltag';
import Switch from '../switch';

require('./index.css');


class ZiltagMap extends React.Component {
  render() {
    const {
      x, y, width, height, map_id,
      ziltags,
      ziltag_preview,
      actions
    } = this.props;

    const style = {
      top: y,
      left: x
    };

    const tag_ziltags = [];
    for (let i = 0; i < (ziltags || []).length; ++i) {
      const ziltag = ziltags[i];

      tag_ziltags.push(
        <Ziltag
          key={i}
          actions={actions}
          ziltag_id={ziltag.id}
          map_id={map_id}
          x={ziltag.x * width}
          y={ziltag.y * height}
          preview={ziltag.preview}
          usr={ziltag.usr}
          preview_direction={ziltag.x >= 0.5 ? 'left' : 'right'}
          is_focused={ziltag.id && ziltag_preview.ziltag_id == ziltag.id}
        />
      );
    }

    const switch_width = 52;

    return <div
      style={style}
      className='ziltag-ziltag-map'
    >
      <Switch map_id={map_id} x={width - switch_width} y={0} actions={actions}/>
      {tag_ziltags}
    </div>;
  }
}

export default ZiltagMap;
