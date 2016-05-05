import {createAction} from 'redux-actions'


export const activate_ziltag_map = createAction('ACTIVATE_ZILTAG_MAP')
export const deactivate_ziltag_map = createAction('DEACTIVATE_ZILTAG_MAP')
export const ziltag_map_activated = createAction('ZILTAG_MAP_ACTIVATED')
export const activate_ziltag_preview = createAction('ACTIVATE_ZILTAG_PREVIEW')
export const deactivate_ziltag_preview = createAction('DEACTIVATE_ZILTAG_PREVIEW')
export const activate_ziltag_reader = createAction('ACTIVATE_ZILTAG_READER')
export const deactivate_ziltag_reader = createAction('DEACTIVATE_ZILTAG_READER')
export const ziltag_reader_activated = createAction('ZILTAG_READER_ACTIVATED')
export const ziltag_reader_deactivated = createAction('ZILTAG_READER_DEACTIVATED')
