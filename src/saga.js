import {takeLatest, takeEvery} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {
  ziltag_map_fetched,
  ziltag_map_activated,
  ziltag_reader_activated,
  ziltag_reader_deactivated,
  activate_ziltag_map
} from './actor'


function* fetch_ziltag_map(action) {
  const {
    token, src, href, is_mobile, x, y, width, height
  } = action.payload

  const target = `${API_ADDRESS}/api/v1/ziltags/` +
    `?token=${token}` +
    `&src=${encodeURIComponent(src)}` +
    `&href=${encodeURIComponent(href)}`

  const {
    id: map_id,
    ziltags
  } = yield call(() => fetch(target).then(resp => resp.json()))

  yield put(ziltag_map_fetched({map_id, src, ziltags}))

  if (is_mobile) {
    yield put(
      activate_ziltag_map({
        x,
        y,
        width,
        height,
        token,
        src,
        href
      })
    )
  }
}

function* watch_fetch_ziltag_map() {
  const action = yield* takeEvery('FETCH_ZILTAG_MAP', fetch_ziltag_map)
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

function* goto_ziltag_page(action) {
  const {
    id
  } = action.payload

  yield call(() => {
    window.location.href = `${API_ADDRESS}/ziltags/${id}`
  })
}

function* watch_activate_ziltag_reader() {
  yield* takeLatest('ACTIVATE_ZILTAG_READER', activate_ziltag_reader)
}

function* watch_deactivate_ziltag_reader() {
  yield* takeLatest('DEACTIVATE_ZILTAG_READER', deactivate_ziltag_reader)
}

function* watch_goto_ziltag_page() {
  yield* takeEvery('GOTO_ZILTAG_PAGE', goto_ziltag_page)
}

export default function* root_saga() {
  yield [
    watch_fetch_ziltag_map(),
    watch_activate_ziltag_reader(),
    watch_deactivate_ziltag_reader(),
    watch_goto_ziltag_page()
  ]
}
