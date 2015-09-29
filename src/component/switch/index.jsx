import React from 'react';

require('./index.css');


class Switch extends React.Component {
  render() {
    const { map_id, actions } = this.props;
    return <div
      className='ziltag-switch'
      onClick={() => actions.open_ziltag_reader(map_id)}
    >
    </div>;
  }
}

export default Switch;
