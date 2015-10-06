export function activate_ziltag_map(x, y, width, height, src, href) {
  const dev_token = 'd3d4b9';
  return dispatch => {
    return fetch(
      `http://staging.ziltag.com/api/v1/ziltags/` +
      `?token=${dev_token}&src=${src}&href=${href}`)
      .then(resp => resp.json())
      .then(json => {
        const { map: map_id, ziltags } = json;
        const action = {
          type: 'ACTIVATE_ZILTAG_MAP',
          x,
          y,
          width,
          height,
          map_id,
          ziltags
        };
        dispatch(action);
      });
  };
}

export function deactivate_ziltag_map() {
  return { type: 'DEACTIVATE_ZILTAG_MAP' };
}

export function activate_ziltag_preview(map_id, ziltag_id) {
  return { type: 'ACTIVATE_ZILTAG_PREVIEW', map_id, ziltag_id };
}

export function deactivate_ziltag_preview() {
  return { type: 'DEACTIVATE_ZILTAG_PREVIEW' };
}

export function activate_ziltag_reader(map_id, ziltag_id) {
  return { type: 'ACTIVATE_ZILTAG_READER', map_id, ziltag_id };
}

export function deactivate_ziltag_reader() {
  return { type: 'DEACTIVATE_ZILTAG_READER' };
}
