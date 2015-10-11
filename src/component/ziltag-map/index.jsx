import React from 'react';

import Ziltag from '../ziltag';
import ZiltagPreview from '../ziltag-preview';
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
          is_focused={ziltag.id && ziltag_preview.ziltag_id == ziltag.id}
        />
      );

      if (ziltag.x >= 0.5) {
        var side = 'right';
      } else {
        var side = 'left';
      }

      if (ziltag.y * height < 30) {
        side = 'upper-' + side;
      } else if (height - ziltag.y * height < 30) {
        side = 'lower-' + side;
      }

      if (ziltag.id && ziltag_preview.ziltag_id == ziltag.id) {
        var tag_ziltag_preview = <ZiltagPreview
          x={ziltag.x * width}
          y={ziltag.y * height}
          side={side}
          content={ziltag.preview}
          usr={ziltag.usr}
        />;
      }
    }

    const switch_width = 52;

    return <div
      style={style}
      className='ziltag-ziltag-map'
    >
      <Switch map_id={map_id} x={width - switch_width} y={0} actions={actions}/>
      {tag_ziltags}
      {tag_ziltag_preview}
    </div>;
  }
}

export default ZiltagMap;
