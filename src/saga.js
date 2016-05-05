import {takeLatest} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {
  ziltag_map_activated,
  ziltag_reader_activated,
  ziltag_reader_deactivated
} from './actor'


function* fetch_ziltag_map(action) {
  const {
    x, y, width, height, token, src, href
  } = action.payload

  const target = `${API_ADDRESS}/api/v1/ziltags/` +
    `?token=${token}` +
    `&src=${encodeURIComponent(src)}` +
    `&href=${encodeURIComponent(href)}` +
    `&width=${width}` +
    `&height=${height}`

  const {
    id: map_id,
    ziltags
  } = yield call(() => fetch(target).then(resp => resp.json()))

  yield put(ziltag_map_activated({map_id, x, y, width, height, ziltags}))
}

function* ziltag_map() {
  const action = yield* takeLatest('ACTIVATE_ZILTAG_MAP', fetch_ziltag_map)
}

function* activate_ziltag_reader(action) {
  const {
    map_id,
    ziltag_id
  } = action.payload

  yield call(() => {
    document.body.classList.add('ziltag-ziltag-reader-activated')
  })
  yield put(ziltag_reader_activated({map_id, ziltag_id}))
}

function* deactivate_ziltag_reader() {
  yield call(() => {
    document.body.classList.remove('ziltag-ziltag-reader-activated')
  })
  yield put(ziltag_reader_deactivated())
}

function* watch_activate_ziltag_reader() {
  yield* takeLatest('ACTIVATE_ZILTAG_READER', activate_ziltag_reader)
}

function* watch_deactivate_ziltag_reader() {
  yield* takeLatest('DEACTIVATE_ZILTAG_READER', deactivate_ziltag_reader)
}

export default function* root_saga() {
  yield [
    ziltag_map(),
    watch_activate_ziltag_reader(),
    watch_deactivate_ziltag_reader()
  ]
}
