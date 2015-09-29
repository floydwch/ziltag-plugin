import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as app_actions from './action';
import ZiltagMap from './component/ziltag-map';
import ZiltagReader from './component/ziltag-reader';


class ZiltagApp extends Component {
  render() {
    const {
      ziltag_maps: raw_ziltag_maps,
      working_ziltag_map,
      working_ziltag_preview,
      ziltag_reader,
      dispatch
    } = this.props;

    const actions = bindActionCreators(app_actions, dispatch);

    const ziltag_maps = [];
    for (const bind_id of Object.keys(raw_ziltag_maps || {})) {
      const raw_ziltag_map = raw_ziltag_maps[bind_id];

      const ziltag_map = <ZiltagMap
        key={bind_id}
        actions={actions}
        map_id={raw_ziltag_map.map_id}
        x={raw_ziltag_map.x}
        y={raw_ziltag_map.y}
        width={raw_ziltag_map.width}
        height={raw_ziltag_map.height}
        ziltags={raw_ziltag_map.ziltags}
        working_ziltag_map={working_ziltag_map}
        working_ziltag_preview={working_ziltag_preview}
      />;

      ziltag_maps.push(ziltag_map);
    }

    return (
      <div>
        {ziltag_maps}
        <ZiltagReader
          actions={actions}
          map_id={ziltag_reader.map_id}
          ziltag_id={ziltag_reader.ziltag_id}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { ziltag_maps, working_ziltag_map, working_ziltag_preview, ziltag_reader } = state;
  return {
    ziltag_maps,
    working_ziltag_map,
    working_ziltag_preview,
    ziltag_reader
  };
}

export default connect(mapStateToProps)(ZiltagApp);
