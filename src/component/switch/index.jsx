import React from 'react';

require('./index.css');


class Switch extends React.Component {
  render() {
    const { map_id, x, y, actions } = this.props;
    const style = { top: y, left: x, zIndex: 1003 };
    return <div
      style={style}
      className='ziltag-switch'
      onClick={() => actions.activate_ziltag_reader(map_id)}
      onMouseLeave={
        (e) => {
          if (e.nativeEvent.relatedTarget.nodeName != 'IMG') {
            actions.deactivate_ziltag_map();
          }
        }
      }
    >
    </div>;
  }
}

export default Switch;
