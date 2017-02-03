import { combineReducers } from 'redux'


function delete_key(state, key) {
  const key_deleted_state = {...state}
  delete key_deleted_state[key]
  return key_deleted_state
}

function client_state(state={}, action) {
  switch (action.type) {
    case 'UPDATE_CLIENT_STATE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

function ziltag_maps(state={}, action) {
  switch (action.type) {
    case 'SET_ZILTAG_MAP':
      return {
        ...state,
        [action.payload.img_id]: {
          ...state[action.payload.img_id],
          ...action.payload
        }
      }
    case 'ACTIVATE_ZILTAG_MAP_ZILTAGS':
      return {
        ...state,
        [action.payload.img_id]: {
          ...state[action.payload.img_id],
          ziltags_activated: true
        }
      }
    case 'DEACTIVATE_ZILTAG_MAP_ZILTAGS':
      return {
        ...state,
        [action.payload.img_id]: {
          ...state[action.payload.img_id],
          ziltags_activated: false
        }
      }
    case 'ACTIVATE_ZILTAG_MAP_SWITCH':
      return {
        ...state,
        [action.payload.img_id]: {
          ...state[action.payload.img_id],
          switch_activated: true
        }
      }
    case 'DEACTIVATE_ZILTAG_MAP_SWITCH':
      return {
        ...state,
        [action.payload.img_id]: {
          ...state[action.payload.img_id],
          switch_activated: false
        }
      }
    case 'DELETE_ZILTAG_MAP':
      return delete_key(state, action.payload.img_id)
    default:
      return state
  }
}

function ziltags(state={}, action) {
  switch (action.type) {
    case 'ZILTAG_MAP_FETCHED':
      return {
        ...state,
        [action.payload.map_id]: action.payload.ziltags
      }
    default:
      return state
  }
}

function ziltag_preview(state={}, action) {
  switch (action.type) {
    case 'ACTIVATE_ZILTAG_PREVIEW':
      return action.payload
    case 'DEACTIVATE_ZILTAG_PREVIEW':
    case 'ZILTAG_READER_ACTIVATED':
      return {}
    default:
      return state
  }
}

function ziltag_reader(state={}, action) {
  switch (action.type) {
    case 'ZILTAG_READER_ACTIVATED':
      return action.payload
    case 'ZILTAG_READER_DEACTIVATED':
      return {}
    default:
      return state
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case 'ME_FETCHED':
      return action.payload
    default:
      return state
  }
}

const ZiltagAppReducer = combineReducers({
  client_state,
  ziltag_maps,
  ziltags,
  ziltag_preview,
  ziltag_reader,
  user
})

export default ZiltagAppReducer
