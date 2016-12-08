import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import MobileDetect from 'mobile-detect'
import bowser from 'bowser'
import Hashids from 'hashids'

import ZiltagApp from './app'
import ZiltagAppReducer from './reducer'
import {
  update_client_state,
  deactivate_ziltag_reader,
  init_ziltag_map,
  fetch_me,
  ziltag_app_mounted
} from './actor'
import root_saga from './saga'


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

const roboto_font_link = document.createElement('link')
roboto_font_link.rel = 'stylesheet'
roboto_font_link.href = '//fonts.googleapis.com/css?family=Roboto:300,400,500'
roboto_font_link.type = 'text/css'

document.head.appendChild(roboto_font_link)

document.addEventListener('DOMContentLoaded', async () => {
  const sagaMiddleware = createSagaMiddleware()
  let store;

  if (process.env.NODE_ENV != 'production') {
    const persistState = require('redux-devtools').persistState
    const DevTools = require('./devtool').default

    const getDebugSessionKey = () => {
      const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
      return (matches && matches.length > 0) ? matches[1] : null
    }
    store = createStore(
      ZiltagAppReducer,
      {},
      compose(
        applyMiddleware(sagaMiddleware),
        DevTools.instrument(),
        persistState(getDebugSessionKey())
      )
    )
  } else {
    store = applyMiddleware(sagaMiddleware)(createStore)(ZiltagAppReducer)
  }

  sagaMiddleware.run(root_saga)

  const is_mobile = !!new MobileDetect(window.navigator.userAgent).mobile()

  const imgs = document.getElementsByTagName('img')
  const scripts = document.getElementsByTagName('script')
  const metas = document.getElementsByTagName('meta')

  const is_responsive = !![].find.call(metas, (meta) => {
    return meta.name === 'viewport'
  })

  if (is_mobile && !is_responsive) {
    return
  }

  for (let i = 0; i < scripts.length; ++i) {
    const script = scripts[i]
    if (script.dataset.ziltag) {
      var token = script.dataset.ziltag
    }
  }

  if (!token) {
    console.error('Must give a token to setup Ziltag.')
  }

  store.dispatch(update_client_state({is_mobile, bowser, token, href: location.href}))

  store.dispatch(
    fetch_me({
      token
    })
  )

  const hashids = new Hashids(`${token}-${Math.random()}`, 10, 'abcdefghijklmnopqrstuvwxyz0123456789')

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i]
    const enable_switch = img.dataset.ziltagSwitch !== undefined
      ? JSON.parse(img.dataset.ziltagSwitch)
      : true
    const autoplay = img.dataset.ziltagAutoplay !== undefined
      ? JSON.parse(img.dataset.ziltagAutoplay)
      : true

    await delay(1)
    const img_id = hashids.encode(Date.now())
    img.dataset.ziltagImgId = img_id

    const setup_ziltag_map = () => {
      store.dispatch(
        init_ziltag_map({
          token,
          href: location.href,
          img,
          img_id,
          meta: {
            enable_switch,
            autoplay
          }
        })
      )
    }

    if (img.dataset.ziltag !== 'false') {
      if (img.complete && img.naturalWidth && is_qualified_img(img)) {
        setup_ziltag_map()
      }
      else {
        img.addEventListener('load', () => {
          if (is_qualified_img(img)) {
            setup_ziltag_map()
          }
        })
      }
    }
  }

  window.addEventListener('message', ({data}) => {
    if (data === 'deactivate_ziltag_reader') {
      store.dispatch(deactivate_ziltag_reader({is_mobile}))
    }
  })

  const mount_node = document.createElement('div')
  document.body.appendChild(mount_node)

  ReactDOM.render(
    <Provider store={store}>
      <ZiltagApp />
    </Provider>,
    mount_node
  )

  store.dispatch(ziltag_app_mounted())

  if (module.hot) {
    module.hot.accept('./app', () => {
      const NextZiltagApp = require('./app').default
      ReactDOM.render(
        <Provider store={store}>
          <NextZiltagApp />
        </Provider>,
        mount_node
      )
    })

    module.hot.accept('./reducer', () => {
      const next_reducer = require('./reducer').default
      store.replaceReducer(next_reducer)
    })
  }
})
