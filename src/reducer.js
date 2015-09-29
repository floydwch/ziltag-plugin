import { combineReducers } from 'redux';


function ziltag_maps(state={}, action) {
  const bind_id = Object.keys(action.map || {})[0];
  let next_state = Object.assign({}, state);

  next_state[bind_id] = next_state[bind_id] || {};

  switch (action.type) {
    case 'INIT_ZILTAG_MAP':
      next_state[bind_id].x = action.map[bind_id].x;
      next_state[bind_id].y = action.map[bind_id].y;
      next_state[bind_id].width = action.map[bind_id].width;
      next_state[bind_id].height = action.map[bind_id].height;
      return next_state;
    case 'FETCH_ZILTAGS':
      next_state[bind_id].map_id = action.map[bind_id].map_id;
      next_state[bind_id].ziltags = action.map[bind_id].ziltags;
      return next_state;
    default:
      return state;
  }
}

function working_ziltag_map(state={}, action) {
  switch (action.type) {
    case 'ACTIVATE_ZILTAG_MAP':
      const { map_id } = action;
      return { map_id };
    case 'DEACTIVATE_ZILTAG_MAP':
      return {};
    default:
      return state;
  }
}

function working_ziltag_preview(state={}, action) {
  switch (action.type) {
    case 'OPEN_ZILTAG_PREVIEW':
      const { map_id, ziltag_id } = action;
      return { map_id, ziltag_id };
    case 'CLOSE_ZILTAG_PREVIEW':
      return {};
    default:
      return state;
  }
}

function ziltag_reader(state={}, action) {
  switch (action.type) {
    case 'OPEN_ZILTAG_READER':
      const { map_id, ziltag_id } = action;
      return { map_id, ziltag_id };
    case 'CLOSE_ZILTAG_READER':
      return {};
    default:
      return state;
  }
}

const ZiltagAppReducer = combineReducers({
  ziltag_maps,
  working_ziltag_map,
  working_ziltag_preview,
  ziltag_reader
});

export default ZiltagAppReducer;
