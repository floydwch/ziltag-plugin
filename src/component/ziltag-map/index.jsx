import React from 'react';

import Ziltag from '../ziltag';
import Switch from '../switch';

require('./index.css');


class ZiltagMap extends React.Component {
  render() {
    const {
      x, y, width, height, map_id,
      ziltags: raw_ziltags,
      working_ziltag_map,
      working_ziltag_preview,
      actions
    } = this.props;

    const style = {
      top: y,
      left: x,
      width,
      height
    };

    const is_working = map_id && working_ziltag_map.map_id == map_id;

    let ziltags = [];
    for (let i = 0; i < (raw_ziltags || []).length; ++i) {
      const raw_ziltag = raw_ziltags[i];

      if (working_ziltag_preview.map_id == map_id &&
          working_ziltag_preview.ziltag_id == raw_ziltag.id
      ) {
        var is_focused = true;
      } else {
        var is_focused = false;
      }

      ziltags.push(
        <Ziltag
          key={i}
          actions={actions}
          ziltag_id={raw_ziltag.id}
          map_id={map_id}
          x={raw_ziltag.x * width}
          y={raw_ziltag.y * height}
          preview={raw_ziltag.preview}
          usr={raw_ziltag.usr}
          preview_direction={raw_ziltag.x >= 0.5 ? 'left' : 'right'}
          is_focused={is_focused}
        />
      );
    }

    return <div
      style={style}
      className='ziltag-ziltag-map'
      onMouseEnter={() => actions.activate_ziltag_map(map_id)}
      onMouseLeave={actions.deactivate_ziltag_map}
    >
      {is_working && <Switch map_id={map_id} actions={actions}/>}
      {is_working && ziltags}
    </div>;
  }
}

export default ZiltagMap;
