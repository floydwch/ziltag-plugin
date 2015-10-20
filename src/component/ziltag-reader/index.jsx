import React from 'react';

require('./index.css');


class ZiltagReader extends React.Component {
  componentWillMount() {
    if (document && document.body) {
      this.setState({
        ori_body_overflow: document.body.style.overflow
      });
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    if (document && document.body) {
      document.body.style.overflow = this.state.ori_body_overflow;
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
