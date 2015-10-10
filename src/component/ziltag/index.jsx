import React from 'react';

import ZiltagPreview from '../ziltag-preview';

require('./index.css');


class Ziltag extends React.Component {
  render() {
    const { ziltag_id, map_id, x, y, preview, usr, preview_direction, is_focused, actions } = this.props;
    const radius = 12;
    const style = {
      top: y - radius,
      left: x - radius,
      zIndex: MAX_Z_INDEX - 3
    };

    return <div
      className='ziltag-ziltag'
      style={style}
      onClick={() => {
          actions.deactivate_ziltag_map();
          actions.activate_ziltag_reader(map_id, ziltag_id);
        }
      }
      onMouseEnter={() => actions.activate_ziltag_preview(map_id, ziltag_id)}
      onMouseLeave={actions.deactivate_ziltag_preview}
    >
      {is_focused && <ZiltagPreview
        direction={preview_direction}
        content={preview}
        usr={usr}
      />}
    </div>;
  }
}

export default Ziltag;
