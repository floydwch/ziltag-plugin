import 'custom-event-polyfill'

import {takeLatest, takeEvery, delay, eventChannel} from 'redux-saga'
import {call, put, take, select, race, fork} from 'redux-saga/effects'
import Hashids from 'hashids'

import {meta_class_name as ziltag_class_name} from './component/ziltag'
import {meta_class_name as co_div_class_name} from './component/CoDiv'
import {meta_class_name as preview_class_name} from './component/ZiltagPreview'
import {meta_class_name as switch_class_name} from './component/switch'
import {meta_class_name as map_class_name} from './component/ziltag-map'
import {meta_class_name as reader_class_name} from './component/ziltag-reader'

import {
  ziltag_map_fetched,
  ziltag_reader_activated,
  ziltag_reader_deactivated,
  activate_ziltag_map_ziltags,
  deactivate_ziltag_map_ziltags,
  activate_ziltag_map_switch,
  deactivate_ziltag_map_switch,
  me_fetched,
  init_ziltag_map,
  set_ziltag_map_meta,
  set_ziltag_map_size,
  set_ziltag_map_position,
  delete_ziltag_map,
  load_ziltag_map,
  fetch_me
} from './actor'


function is_qualified_img(img) {
  const {clientWidth: width, clientHeight: height} = img

  /*
  const
    switch_width = 52,
    switch_height = 59,
    ziltag_radius = 6,
    ziltag_max_radius = 23,
    ziltag_preview_margin = 2,
    ziltag_preview_width = 172,
    ziltag_preview_height = 60

  const theoretic_min_width = 2 * (ziltag_radius +
    ziltag_preview_margin + ziltag_preview_width)

  theoretic_min_width == 372

  const theoretic_min_height = ziltag_max_radius +
    ziltag_preview_height

  theoretic_min_height == 83

  */

  const
    min_width = 200,
    min_height = 100

  if (width < min_width || height < min_height) {
    return false
  }

  return true
}

function is_on_img(relatedTarget) {
  if (relatedTarget === null) {
    return true
  } else {
    const img_children_names = [
      switch_class_name,
      ziltag_class_name,
      preview_class_name
    ]
    return !img_children_names.some(name => relatedTarget.classList.contains(name))
  }
}

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
    window.removeEventListener('message', handler)
  }
})

const createMutationChannel = options => eventChannel(emitter => {
  const ignored_classes = [
    ziltag_class_name,
    co_div_class_name,
    preview_class_name,
    switch_class_name,
    map_class_name,
    reader_class_name,
    'ziltag-ziltag-reader-cover'
  ]

  const observer = new MutationObserver(mutations => {
    const should_emit = !ignored_classes.some(
      name => mutations.some(
        mutation => mutation.target.classList.contains(name)
      )
    )

    if (should_emit) {
      emitter(mutations)
    }
  })

  observer.observe(document, options)

  return () => {
    observer.disconnect()
  }
})

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

  return {
    map_id,
    ziltags
  }
}

function* fetch_me_saga(action) {
  const {
    token
  } = action.payload

  const {
    usr: user,
    permissions,
    error
  } = yield call(() => fetch(`${API_ADDRESS}/api/v1/me?token=${token}`, {credentials: 'include'}).then(resp => resp.json()))

  if (error) {
    console.error(error)
    return
  }

  yield put(me_fetched({...user, permissions}))
}

function* watch_fetch_ziltag_map() {
  const action = yield take('FETCH_ZILTAG_MAP')
  const ziltag_map = yield call(fetch_ziltag_map, action)
  yield put(ziltag_map_fetched(ziltag_map))
}

function* manage_ziltag_map(action) {
  const {
    img,
    img_id,
    meta
  } = action.payload

  const {clientWidth: width, clientHeight: height, src} = img
  const rect = img.getBoundingClientRect()
  const x = rect.left + document.documentElement.scrollLeft + document.body.scrollLeft
  const y = rect.top + document.documentElement.scrollTop + document.body.scrollTop

  action.payload = {...action.payload, src, x, y}

  const {
    enable_switch,
    autoplay
  } = meta

  const ziltag_map = yield call(fetch_ziltag_map, action)

  const {
    map_id,
    ziltags
  } = ziltag_map

  const child_class_names = [ziltag_class_name, switch_class_name]

  yield put(set_ziltag_map_meta({
    img_id,
    map_id,
    meta
  }))

  yield put(set_ziltag_map_size({
    img_id,
    width,
    height
  }))

  yield put(set_ziltag_map_position({
    img_id,
    x,
    y
  }))

  if (autoplay) {
    yield put(activate_ziltag_map_ziltags({img_id}))
  }

  yield put(ziltag_map_fetched({map_id, ziltags}))

  const mouseenter_channel = yield call(createChannel, img, 'mouseenter')
  const mouseleave_channel = yield call(createChannel, img, 'mouseleave')
  const resize_channel = yield call(createChannel, window, 'resize')
  const orientationchange_channel = yield call(createChannel, window, 'orientationchange')
  const attr_mutation_channel = yield call(createMutationChannel, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['class', 'style']
  })

  while (true) {
    const {mouseenter_event, mouseleave_event, resize_event, orientationchange_event, attr_mutations, delete_ziltag_map_action} = yield race({
      mouseenter_event: take(mouseenter_channel),
      mouseleave_event: take(mouseleave_channel),
      resize_event: take(resize_channel),
      orientationchange_event: take(orientationchange_channel),
      attr_mutations: take(attr_mutation_channel),
      delete_ziltag_map_action: take('DELETE_ZILTAG_MAP')
    })

    if (delete_ziltag_map_action && delete_ziltag_map_action.payload.img_id === img_id) {
      break
    }

    if (mouseenter_event) {
      const should_handle = !child_class_names.some(name => {
        return mouseenter_event.relatedTarget && mouseenter_event.relatedTarget.classList.contains(name)
      })

      if (should_handle) {
        yield put(load_ziltag_map({id: map_id}))

        if (enable_switch) {
          yield put(activate_ziltag_map_switch({img_id}))
        }

        if (!autoplay) {
          yield put(activate_ziltag_map_ziltags({img_id}))
        }

        yield fork(refresh_ziltag_map, action, map_id)
      }
    }
    else if (mouseleave_event) {
      if (is_on_img(mouseleave_event.relatedTarget)) {
        if (!autoplay) {
          yield put(deactivate_ziltag_map_ziltags({img_id}))
        }
        yield put(deactivate_ziltag_map_switch({img_id}))
      }
    }
    else if (resize_event || orientationchange_event || attr_mutations) {
      const {clientWidth: width, clientHeight: height} = img
      const rect = img.getBoundingClientRect()
      const x = rect.left + document.documentElement.scrollLeft + document.body.scrollLeft
      const y = rect.top + document.documentElement.scrollTop + document.body.scrollTop

      yield put(set_ziltag_map_size({
        img_id,
        width,
        height
      }))

      yield put(set_ziltag_map_position({
        img_id,
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
    img_id,
    is_mobile
  } = action.payload

  const {autoplay} = yield select(state => state.ziltag_maps[img_id].meta)

  yield put(ziltag_reader_activated({
    map_id,
    ziltag_id,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }))

  yield put(deactivate_ziltag_map_switch({img_id}))

  if (!autoplay) {
    yield put(deactivate_ziltag_map_ziltags({img_id}))
  }

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
  yield* takeEvery('FETCH_ME', fetch_me_saga)
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

function* sync_auth() {
  const message_channel = yield call(createMessageEventChannel)

  yield take('ZILTAG_APP_MOUNTED')
  const token = yield select(state => state.client_state.token)

  while (true) {
    const message_event = yield take(message_channel)
    if (
      [
        'CURRENT_USER_SIGNED_OUT',
        'CURRENT_USER_SIGNED_IN'
      ].includes(message_event.payload.type)) {
      yield put(fetch_me({token}))
    }
  }
}

function* manage_all_ziltag_maps() {
  const child_mutation_channel = yield call(createMutationChannel, {
    childList: true,
    subtree: true
  })

  yield take('ZILTAG_APP_MOUNTED')

  const {
    token,
    href
  } = yield select(state => state.client_state)

  const hashids = new Hashids(`${token}-${Math.random()}`, 6, 'abcdefghijklmnopqrstuvwxyz0123456789')

  while (true) {
    const mutations = yield take(child_mutation_channel)
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === 'IMG') {
          const img = node
          const {clientWidth: width, clientHeight: height, src} = img
          const rect = img.getBoundingClientRect()
          const x = rect.left + document.documentElement.scrollLeft + document.body.scrollLeft
          const y = rect.top + document.documentElement.scrollTop + document.body.scrollTop

          const enable_switch = img.dataset.ziltagSwitch !== undefined
            ? JSON.parse(img.dataset.ziltagSwitch)
            : true
          const autoplay = img.dataset.ziltagAutoplay !== undefined
            ? JSON.parse(img.dataset.ziltagAutoplay)
            : true

          const current_index = yield select(state => Object.keys(state.ziltag_maps).length)
          const img_id = hashids.encode(current_index)
          img.dataset.ziltagImgId = img_id

          if (img.dataset.ziltag !== 'false') {
            if (!(img.complete && img.naturalWidth)) {
              const load_event_channel = yield call(createChannel, img, 'load')
              yield take(load_event_channel)
            }

            if (is_qualified_img(img)) {
              yield put(init_ziltag_map({
                token,
                src,
                href,
                width,
                height,
                x,
                y,
                img,
                img_id,
                meta: {
                  enable_switch,
                  autoplay
                }
              }))
            }
          }
        }
      }

      for (const node of mutation.removedNodes) {
        if (node.tagName === 'IMG') {
          const img = node
          const img_id = img.dataset.ziltagImgId
          const existed = yield select(state => Boolean(state.ziltag_maps[img_id]))
          if (existed) {
            yield put(delete_ziltag_map({img_id: img.dataset.ziltagImgId}))
          }
        }
      }
    }
  }
}

function* refresh_ziltag_map(action, map_id) {
  const {ziltags} = yield call(fetch_ziltag_map, action)
  yield put(ziltag_map_fetched({map_id, ziltags}))
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
    dispatch_event(),
    sync_auth(),
    manage_all_ziltag_maps()
  ]
}
