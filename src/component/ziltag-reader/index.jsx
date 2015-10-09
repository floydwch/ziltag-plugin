import React from 'react';

require('./index.css');


class ZiltagReader extends React.Component {
  render() {
    const { map_id, ziltag_id, actions } = this.props;
    const src = `${SERVER_ADDRESS}/ziltags/` +
    `${map_id}/${ziltag_id || ''}`;
    const style = { zIndex: 1003 };

    return  <div
      style={style}
      className='ziltag-ziltag-reader__cover'
      onClick={actions.deactivate_ziltag_reader}
    >
      <iframe className='ziltag-ziltag-reader' src={src}></iframe>
    </div>;
  }
}

export default ZiltagReader;
