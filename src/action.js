export function init_ziltag_map(bind_id, x, y, width, height) {
  const action = { type: 'INIT_ZILTAG_MAP', map: {} };
  action.map[bind_id] = {
    x,
    y,
    width,
    height
  };
  return action;
}

export function fetch_ziltags(bind_id, src) {
  return dispatch => {
    return fetch(`http://staging.ziltag.com/api/v1/ziltags/?src=${src}`)
      .then(resp => resp.json())
      .then(json => {
        const action = { type: 'FETCH_ZILTAGS', map: {} };
        action.map[bind_id] = {
          map_id: json.map,
          ziltags: json.ziltags
        };
        dispatch(action);
      });
  };
}

export function activate_ziltag_map(map_id) {
  return { type: 'ACTIVATE_ZILTAG_MAP', map_id };
}

export function deactivate_ziltag_map() {
  return { type: 'DEACTIVATE_ZILTAG_MAP' };
}

export function open_ziltag_preview(map_id, ziltag_id) {
  return { type: 'OPEN_ZILTAG_PREVIEW', map_id, ziltag_id };
}

export function close_ziltag_preview() {
  return { type: 'CLOSE_ZILTAG_PREVIEW' };
}

export function open_ziltag_reader(map_id, ziltag_id) {
  return { type: 'OPEN_ZILTAG_READER', map_id, ziltag_id };
}

export function close_ziltag_reader() {
  return { type: 'CLOSE_ZILTAG_READER' };
}
