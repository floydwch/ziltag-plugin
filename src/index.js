import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import MobileDetect from 'mobile-detect'

import ZiltagApp from './app'
import ZiltagAppReducer from './reducer'
import {update_client_state, activate_ziltag_map, deactivate_ziltag_map, deactivate_ziltag_reader, fetch_ziltag_map} from './actor'
import root_saga from './saga'


const roboto_font_link = document.createElement('link')
roboto_font_link.rel = 'stylesheet'
roboto_font_link.href = '//fonts.googleapis.com/css?family=Roboto:300,400,500'
roboto_font_link.type = 'text/css'

document.head.appendChild(roboto_font_link)

document.addEventListener('DOMContentLoaded', () => {
  const sagaMiddleware = createSagaMiddleware()

  if (process.env.NODE_ENV != 'production') {
    const persistState = require('redux-devtools').persistState
    const DevTools = require('./devtool').default

    function getDebugSessionKey() {
      const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
      return (matches && matches.length > 0) ? matches[1] : null
    }
    var store = createStore(
      ZiltagAppReducer,
      {},
      compose(
        applyMiddleware(sagaMiddleware),
        DevTools.instrument(),
        persistState(getDebugSessionKey())
      )
    )
  } else {
    var store = applyMiddleware(sagaMiddleware)(createStore)(ZiltagAppReducer)
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

  function is_outside(relatedTarget) {
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

  function _activate_ziltag_map(img, {is_mobile}) {
    const {clientWidth: width, clientHeight: height, src} = img
    const rect = img.getBoundingClientRect()
    const x = rect.left + document.documentElement.scrollLeft + document.body.scrollLeft
    const y = rect.top + document.documentElement.scrollTop + document.body.scrollTop

    if (is_mobile) {
      store.dispatch(
        fetch_ziltag_map({
          token: ziltag_token,
          href: location.href,
          src,
          is_mobile,
          x,
          y,
          width,
          height
        })
      )
    }
    else {
      store.dispatch(
        activate_ziltag_map({
          token: ziltag_token,
          href: location.href,
          src,
          x,
          y,
          width,
          height
        })
      )
      store.dispatch(
        fetch_ziltag_map({
          token: ziltag_token,
          href: location.href,
          src
        })
      )
    }
  }

  for (let i = 0; i < scripts.length; ++i) {
    const script = scripts[i]
    if (script.dataset.ziltag) {
      var ziltag_token = script.dataset.ziltag
    }
  }

  if (!ziltag_token) {
    console.error('Must give a token to setup Ziltag.')
  }

  store.dispatch(update_client_state({is_mobile}))

  if (!is_mobile) {
    window.addEventListener('resize', () => {
      store.dispatch(deactivate_ziltag_map())
    })
  } else {
    window.addEventListener('resize', () => {
      store.dispatch(deactivate_ziltag_map())
      for (let i = 0; i < imgs.length; ++i) {
        const img = imgs[i]
        if (img.dataset.ziltag == 'false') {
          continue
        }
        _activate_ziltag_map(img, {is_mobile})
      }
    })
  }

  window.addEventListener('message', ({data}) => {
    if (data == 'deactivate_ziltag_reader') {
      store.dispatch(deactivate_ziltag_reader({is_mobile}))
    }
  })

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i]

    if (img.dataset.ziltag == 'false') {
      continue
    }

    if (!is_mobile) {
      store.dispatch(
        fetch_ziltag_map({
          token: ziltag_token,
          src: img.src,
          href: location.href
        })
      )

      img.addEventListener('mouseenter', (e) => {
        if (is_qualified_img(img) && is_outside(e.relatedTarget)) {
          _activate_ziltag_map(img, {is_mobile})
        }
      })
    }
    else {
      if (img.complete && img.naturalWidth) {
        _activate_ziltag_map(img, {is_mobile})
      }
      else {
        img.addEventListener('load', () => _activate_ziltag_map(img, {is_mobile}))
      }
    }
  }

  const mount_node = document.createElement('div')
  document.body.appendChild(mount_node)

  ReactDOM.render(
    <Provider store={store}>
      <ZiltagApp />
    </Provider>,
    mount_node
  )

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
