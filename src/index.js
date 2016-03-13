import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import ZiltagApp from './app'
import ZiltagAppReducer from './reducer'
import { activate_ziltag_map, deactivate_ziltag_map, deactivate_ziltag_reader } from './action'


document.addEventListener('DOMContentLoaded', () => {
  const store = applyMiddleware(thunk)(createStore)(ZiltagAppReducer)
  const imgs = document.getElementsByTagName('img')
  const scripts = document.getElementsByTagName('script')

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

  function is_enabled(img) {
    const { width, height } = img

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

    if (img.dataset.ziltag == 'false') {
      return false
    }

    if (width < min_width || height < min_height) {
      return false
    }

    return true
  }

  window.addEventListener('resize', () => {
    store.dispatch(deactivate_ziltag_map())
  })

  window.addEventListener('message', ({data}) => {
    if (data == 'deactivate_ziltag_reader') {
      store.dispatch(deactivate_ziltag_reader())
    }
  })

  for (let i = 0; i < scripts.length; ++i) {
    const script = scripts[i]
    if (script.dataset.ziltag) {
      var ziltag_token = script.dataset.ziltag
    }
  }

  if (!ziltag_token) {
    console.error('Must give a token to setup Ziltag.')
  }

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i]

    img.addEventListener('mouseenter', (e) => {
      if (!is_enabled(img)) {
        return
      }

      const { width, height, src } = img
      const rect = img.getBoundingClientRect()
      const left = rect.left + document.body.scrollLeft
      const top = rect.top + document.body.scrollTop

      if (is_outside(e.relatedTarget)) {
        store.dispatch(
          activate_ziltag_map(
            left, top, width, height,
            ziltag_token, src, location.href
          )
        )
      }
    })
    img.addEventListener('mouseleave', (e) => {
      if (!is_enabled(img)) {
        return
      }

      if (is_outside(e.relatedTarget)) {
        store.dispatch(deactivate_ziltag_map())
      }
    })
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer')
      store.replaceReducer(nextReducer)
    })
  }

  const mount_node = document.createElement('div')
  document.body.appendChild(mount_node)

  ReactDOM.render(
    <Provider store={store}>
      <ZiltagApp />
    </Provider>,
    mount_node
  )
})
