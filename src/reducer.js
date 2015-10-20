import { combineReducers } from 'redux';


function ziltag_map(state={}, action) {
  switch (action.type) {
    case 'ACTIVATE_ZILTAG_MAP':
      const { x, y, width, height, map_id, ziltags } = action;
      return { x, y, width, height, map_id, ziltags };
    case 'DEACTIVATE_ZILTAG_MAP':
      return {};
    default:
      return state;
  }
}

function ziltag_preview(state={}, action) {
  switch (action.type) {
    case 'ACTIVATE_ZILTAG_PREVIEW':
      const { map_id, ziltag_id } = action;
      return { map_id, ziltag_id };
    case 'DEACTIVATE_ZILTAG_PREVIEW':
      return {};
    default:
      return state;
  }
}

function ziltag_reader(state={}, action) {
  switch (action.type) {
    case 'ACTIVATE_ZILTAG_READER':
      const { map_id, ziltag_id } = action;
      return { map_id, ziltag_id };
    case 'DEACTIVATE_ZILTAG_READER':
      return {};
    default:
      return state;
  }
}

const ZiltagAppReducer = combineReducers({
  ziltag_map,
  ziltag_preview,
  ziltag_reader
});

export default ZiltagAppReducer;
