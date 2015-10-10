import React from 'react';

require('./index.css');


class Ziltag extends React.Component {
  render() {
    const { ziltag_id, map_id, x, y, actions } = this.props;
    const style = {
      top: y - ZILTAG_RADIUS,
      left: x - ZILTAG_RADIUS,
      zIndex: MAX_Z_INDEX - 3
    };

    return <div
      className='ziltag-ziltag'
      style={style}
      onClick={() => {
        actions.deactivate_ziltag_map();
        actions.activate_ziltag_reader(map_id, ziltag_id);
      }}
      onMouseEnter={() => actions.activate_ziltag_preview(map_id, ziltag_id)}
      onMouseLeave={actions.deactivate_ziltag_preview}
    ></div>;
  }
}

export default Ziltag;
