import {createAction} from 'redux-actions'


export const update_client_state = createAction('UPDATE_CLIENT_STATE')
export const activate_ziltag_map = createAction('ACTIVATE_ZILTAG_MAP')
export const deactivate_ziltag_map = createAction('DEACTIVATE_ZILTAG_MAP')
export const ziltag_map_activated = createAction('ZILTAG_MAP_ACTIVATED')
export const fetch_ziltag_map = createAction('FETCH_ZILTAG_MAP')
export const ziltag_map_fetched = createAction('ZILTAG_MAP_FETCHED')
export const activate_ziltag_preview = createAction('ACTIVATE_ZILTAG_PREVIEW')
export const deactivate_ziltag_preview = createAction('DEACTIVATE_ZILTAG_PREVIEW')
export const activate_ziltag_reader = createAction('ACTIVATE_ZILTAG_READER')
export const deactivate_ziltag_reader = createAction('DEACTIVATE_ZILTAG_READER')
export const ziltag_reader_activated = createAction('ZILTAG_READER_ACTIVATED')
export const ziltag_reader_deactivated = createAction('ZILTAG_READER_DEACTIVATED')
export const goto_ziltag_page = createAction('GOTO_ZILTAG_PAGE')
export const load_ziltag = createAction('LOAD_ZILTAG')
export const load_ziltag_map = createAction('LOAD_ZILTAG_MAP')
