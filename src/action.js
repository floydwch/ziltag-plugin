export function activate_ziltag_map(x, y, width, height, token, src, href) {
  return dispatch => {
    return fetch(`${SERVER_ADDRESS}/api/v1/ziltags/` +
      `?token=${token}` +
      `&src=${encodeURIComponent(src)}` +
      `&href=${encodeURIComponent(href)}` +
      `&width=${width}` +
      `&height=${height}`
    )
    .then(resp => resp.json())
    .then(json => {
      const { id: map_id, ziltags } = json;
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
  if (document && document.body) {
    document.body.classList.add('ziltag-ziltag-reader-activated');
  }
  return { type: 'ACTIVATE_ZILTAG_READER', map_id, ziltag_id };
}

export function deactivate_ziltag_reader() {
  if (document && document.body) {
    document.body.classList.remove('ziltag-ziltag-reader-activated');
  }
  return { type: 'DEACTIVATE_ZILTAG_READER' };
}
