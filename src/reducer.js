import { combineReducers } from 'redux'


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
      for (let id in state) {
        if (state[id].activated) {
          return {
            ...state,
            [state[id].map_id]: {
              ...state[id],
              activated: false
            }
          }
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

const ZiltagAppReducer = combineReducers({
  ziltag_maps,
  ziltag_preview,
  ziltag_reader
})

export default ZiltagAppReducer
