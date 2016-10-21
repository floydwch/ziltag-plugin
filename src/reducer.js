import { combineReducers } from 'redux'


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
    case 'ZILTAG_MAP_FETCHED':
    case 'SET_ZILTAG_MAP_SIZE':
    case 'SET_ZILTAG_MAP_POSITION':
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          ...action.payload
        }
      }
    case 'ACTIVATE_ZILTAG_MAP_ZILTAGS':
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          ziltags_activated: true
        }
      }
    case 'DEACTIVATE_ZILTAG_MAP_ZILTAGS':
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          ziltags_activated: false
        }
      }
    case 'ACTIVATE_ZILTAG_MAP_SWITCH':
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          switch_activated: true
        }
      }
    case 'DEACTIVATE_ZILTAG_MAP_SWITCH':
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          switch_activated: false
        }
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
  ziltag_preview,
  ziltag_reader,
  user
})

export default ZiltagAppReducer
