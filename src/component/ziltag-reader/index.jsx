import React from 'react';

require('./index.css');


class ZiltagReader extends React.Component {
  componentWillMount() {
    if (document && document.body) {
      document.body.classList.add('ziltag-ziltag-reader-activated');
    }
  }

  componentWillUnmount() {
    if (document && document.body) {
      document.body.classList.remove('ziltag-ziltag-reader-activated');
    }
  }

  render() {
    const { map_id, ziltag_id, actions } = this.props;
    const src = `${SERVER_ADDRESS}/ziltags/` +
    `${map_id}/${ziltag_id || ''}`;
    const style = { zIndex: MAX_Z_INDEX };

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
