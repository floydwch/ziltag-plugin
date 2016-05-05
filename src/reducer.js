import { combineReducers } from 'redux'


function ziltag_map(state={}, action) {
  switch (action.type) {
    case 'ZILTAG_MAP_ACTIVATED':
      return action.payload
    case 'DEACTIVATE_ZILTAG_MAP':
      return {}
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
  ziltag_map,
  ziltag_preview,
  ziltag_reader
})

export default ZiltagAppReducer
