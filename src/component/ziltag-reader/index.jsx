import React from 'react';

require('./index.css');


class ZiltagReader extends React.Component {
  render() {
    let src = 'http://staging.ziltag.com/ziltags/';
    const { map_id, ziltag_id, actions } = this.props;

    if (map_id) {
      src = src + map_id + '/';

      if (ziltag_id) {
        src = src + ziltag_id;
      }

      return  <div
        onClick={actions.close_ziltag_reader}
        className='ziltag-ziltag-reader__cover'
      >
        <iframe className='ziltag-ziltag-reader' src={src}></iframe>
      </div>;

    } else {
      return <div></div>;
    }
  }
}

export default ZiltagReader;
