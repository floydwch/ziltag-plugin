import React from 'react';

import ZiltagPreview from '../ziltag-preview';

require('./index.css');


class Ziltag extends React.Component {
  render() {
    const { ziltag_id, map_id, x, y, preview, usr, preview_direction, is_focused, actions } = this.props;
    const style = {
      top: y - 12,
      left: x - 12
    };

    return <div
      className='ziltag-ziltag'
      style={style}
      onClick={() => actions.open_ziltag_reader(map_id, ziltag_id)}
      onMouseEnter={() => actions.open_ziltag_preview(map_id, ziltag_id)}
      onMouseLeave={actions.close_ziltag_preview}
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
