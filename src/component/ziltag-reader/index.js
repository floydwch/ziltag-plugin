import React from 'react';

require('./index.css');


class ZiltagReader extends React.Component {
  render() {
    const { map_id, ziltag_id, actions } = this.props
    const path = ziltag_id ? `ziltags/${ziltag_id}` : `ziltag_maps/${map_id}`
    const src = `${SERVER_ADDRESS}/${path}`
    const style = { zIndex: MAX_Z_INDEX }

    return  <div
      style={style}
      className='ziltag-ziltag-reader-cover'
      onClick={actions.deactivate_ziltag_reader}
    >
      <iframe className='ziltag-ziltag-reader' src={src}></iframe>
    </div>;
  }
}

export default ZiltagReader;
