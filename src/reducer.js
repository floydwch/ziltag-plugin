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
      return {
        ...state,
        [action.payload.map_id]: {
          ...state[action.payload.map_id],
          ...action.payload
        }
      }
    case 'ACTIVATE_ZILTAG_MAP':
      for (let id in state) {
        if (state[id].src == action.payload.src) {
          return {
            ...state,
            [state[id].map_id]: {
              ...state[id],
              ...action.payload,
              activated: true
            }
          }
        }
      }
    case 'DEACTIVATE_ZILTAG_MAP':
      const deactivated_ziltag_maps = {...state}
      for (let id in state) {
        if (state[id].activated) {
          deactivated_ziltag_maps[id].activated = false
        }
      }
      return deactivated_ziltag_maps
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
      return action.payload.user
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
