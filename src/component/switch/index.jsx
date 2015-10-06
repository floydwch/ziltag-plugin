import React from 'react';

require('./index.css');


class Switch extends React.Component {
  render() {
    const { map_id, x, y, actions } = this.props;
    const style = { top: y, left: x };
    return <div
      style={style}
      className='ziltag-switch'
      onClick={() => actions.open_ziltag_reader(map_id)}
    >
    </div>;
  }
}

export default Switch;
