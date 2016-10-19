import 'custom-event-polyfill'

import {takeLatest, takeEvery, delay, eventChannel} from 'redux-saga'
import {call, put, take, select, race, fork} from 'redux-saga/effects'

import {
  ziltag_map_fetched,
  ziltag_reader_activated,
  ziltag_reader_deactivated,
  activate_ziltag_map_ziltags,
  deactivate_ziltag_map_ziltags,
  activate_ziltag_map_switch,
  deactivate_ziltag_map_switch,
  me_fetched,
  set_ziltag_map_meta,
  set_ziltag_map_size,
  set_ziltag_map_position,
  load_ziltag_map
} from './actor'


const createChannel = (target, event_name, ...args) => eventChannel(emitter => {
  function handler(e) {
    emitter(e)
  }

  target.addEventListener(event_name, handler, ...args)

  return () => {
    target.removeEventListener(event_name, handler, ...args)
  }
})

const createMessageEventChannel = () => eventChannel(emitter => {
  function handler(e) {
    if (e.data.type === 'event') {
      emitter(e.data)
    }
  }

  window.addEventListener('message', handler)

  return () => {
    target.removeEventListener(message, handler)
  }
})

function is_on_img(relatedTarget) {
  if (relatedTarget == null) {
    return true
  } else {
    const check_names = [
      'ziltag-switch',
      'ziltag-ziltag',
      'ziltag-ziltag-preview'
    ]
    for (const check_name of check_names) {
      if (relatedTarget.className.indexOf(check_name) != -1) {
        return false
      }
    }
    return true
  }
}

function* fetch_ziltag_map(action) {
  const {
    token, src, href
  } = action.payload

  const target = `${API_ADDRESS}/api/v1/ziltags/` +
    `?token=${token}` +
    `&src=${encodeURIComponent(src)}` +
    `&href=${encodeURIComponent(href)}`

  const {
    id: map_id,
    ziltags,
    error
  } = yield call(() => fetch(target).then(resp => resp.json()))

  if (error) {
    console.error(error)
    return
  }

  yield put(ziltag_map_fetched({map_id, ziltags, meta: action.payload.meta}))

  return {
    map_id,
    ziltags
  }
}

function* fetch_me(action) {
  const {
    token
  } = action.payload

  const {
    usr: user,
    error
  } = yield call(() => fetch(`${API_ADDRESS}/api/v1/me?token=${token}`, {credentials: 'include'}).then(resp => resp.json()))

  if (error) {
    console.error(error)
    return
  }

  if (user) {
    yield put(me_fetched({user}))
  }
}

function* watch_fetch_ziltag_map() {
  const action = yield take('FETCH_ZILTAG_MAP')
  const ziltag_map = yield call(fetch_ziltag_map, action)
  yield put(ziltag_map_fetched(ziltag_map))
}

function* manage_ziltag_map(action) {
  const {
    width,
    height,
    x,
    y,
    img,
    meta
  } = action.payload

  const {
    enable_switch,
    autoplay
  } = meta

  const ziltag_map = yield call(fetch_ziltag_map, action)
  const {
    map_id
  } = ziltag_map

  yield put(set_ziltag_map_meta({
    map_id,
    meta
  }))

  yield put(set_ziltag_map_size({
    map_id,
    width,
    height
  }))

  yield put(set_ziltag_map_position({
    map_id,
    x,
    y
  }))

  if (autoplay) {
    yield put(activate_ziltag_map_ziltags({map_id}))
  }

  const mouseenter_channel = yield call(createChannel, img, 'mouseenter')
  const mouseleave_channel = yield call(createChannel, img, 'mouseleave')
  const resize_channel = yield call(createChannel, window, 'resize')
  const orientationchange_channel = yield call(createChannel, window, 'orientationchange')

  while (true) {
    const {mouseenter_event, mouseleave_event, resize_event, orientationchange_event} = yield race({
      mouseenter_event: take(mouseenter_channel),
      mouseleave_event: take(mouseleave_channel),
      resize_event: take(resize_channel),
      orientationchange_event: take(orientationchange_channel)
    })

    if (mouseenter_event) {
      yield put(load_ziltag_map({id: map_id}))

      if (enable_switch) {
        yield put(activate_ziltag_map_switch({map_id}))
      }

      if (!autoplay) {
        yield put(activate_ziltag_map_ziltags({map_id}))
      }

      yield fork(fetch_ziltag_map, action)
    }
    else if (mouseleave_event) {
      if (is_on_img(event.relatedTarget)) {
        if (!autoplay) {
          yield put(deactivate_ziltag_map_ziltags({map_id}))
        }
        yield put(deactivate_ziltag_map_switch({map_id}))
      }
    }
    else if (resize_event || orientationchange_event) {
      const {clientWidth: width, clientHeight: height, src} = img
      const rect = img.getBoundingClientRect()
      const x = rect.left + document.documentElement.scrollLeft + document.body.scrollLeft
      const y = rect.top + document.documentElement.scrollTop + document.body.scrollTop

      yield put(set_ziltag_map_size({
        map_id,
        width,
        height
      }))

      yield put(set_ziltag_map_position({
        map_id,
        x,
        y
      }))
    }
  }
}

function* watch_init_ziltag_map() {
  yield* takeEvery('INIT_ZILTAG_MAP', manage_ziltag_map)
}

function* activate_ziltag_reader(action) {
  const {
    map_id,
    ziltag_id,
    is_mobile
  } = action.payload

  yield put(ziltag_reader_activated({
    map_id,
    ziltag_id,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }))
  yield call(delay, 0)
  yield call(() => {
    document.body.classList.add('ziltag-ziltag-reader-activated')
    if (is_mobile) {
      document.body.classList.add('ziltag-ziltag-reader-activated--mobile')
      document.documentElement.classList.add('ziltag-ziltag-reader-activated--mobile')
    }
  })
}

function* deactivate_ziltag_reader(action) {
  const {
    is_mobile
  } = action.payload

  const ziltag_reader = yield select(state => state.ziltag_reader)

  yield call(() => {
    document.body.classList.remove('ziltag-ziltag-reader-activated')
    if (is_mobile) {
      window.scrollTo(ziltag_reader.scrollX, ziltag_reader.scrollY)
      document.body.classList.remove('ziltag-ziltag-reader-activated--mobile')
      document.documentElement.classList.remove('ziltag-ziltag-reader-activated--mobile')
    }
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

function* watch_fetch_me() {
  yield* takeEvery('FETCH_ME', fetch_me)
}

function* watch_load_ziltag() {
  while (true) {
    const action = yield take('LOAD_ZILTAG')
    document.querySelector('.ziltag-ziltag-reader')
      .contentWindow
      .postMessage(action, '*')
  }
}

function* watch_load_ziltag_map() {
  while (true) {
    const action = yield take('LOAD_ZILTAG_MAP')
    document.querySelector('.ziltag-ziltag-reader')
      .contentWindow
      .postMessage(action, '*')
  }
}

function* dispatch_event() {
  yield take('ZILTAG_APP_MOUNTED')

  const target = document.getElementsByClassName('ziltag-app')[0]
  const message_channel = yield call(createMessageEventChannel)

  while (true) {
    const {
      ziltag_map_switch_activated,
      ziltag_map_switch_deactivated,
      ziltag_reader_activated,
      ziltag_reader_deactivated,
      message_event
    } = yield race({
      ziltag_map_switch_activated: take('ACTIVATE_ZILTAG_MAP_SWITCH'),
      ziltag_map_switch_deactivated: take('DEACTIVATE_ZILTAG_MAP_SWITCH'),
      ziltag_reader_activated: take('ZILTAG_READER_ACTIVATED'),
      ziltag_reader_deactivated: take('ZILTAG_READER_DEACTIVATED'),
      message_event: take(message_channel)
    })

    const event = do {
      if (ziltag_map_switch_activated) {
        new CustomEvent('ZILTAG_MAP_SWITCH_ACTIVATED')
      } else if (ziltag_map_switch_deactivated) {
        new CustomEvent('ZILTAG_MAP_SWITCH_DEACTIVATED')
      } else if (ziltag_reader_activated) {
        new CustomEvent('ZILTAG_READER_ACTIVATED')
      } else if (ziltag_reader_deactivated) {
        new CustomEvent('ZILTAG_READER_DEACTIVATED')
      } else if (message_event) {
        new CustomEvent(message_event.payload.type)
      }
    }

    target.dispatchEvent(event)
  }
}

export default function* root_saga() {
  yield [
    watch_fetch_ziltag_map(),
    watch_activate_ziltag_reader(),
    watch_deactivate_ziltag_reader(),
    watch_goto_ziltag_page(),
    watch_fetch_me(),
    watch_load_ziltag(),
    watch_load_ziltag_map(),
    watch_init_ziltag_map(),
    dispatch_event()
  ]
}
