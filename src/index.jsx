import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ZiltagApp from './app';
import ZiltagAppReducer from './reducer';
import { activate_ziltag_map, deactivate_ziltag_map } from './action';


document.addEventListener('DOMContentLoaded', () => {
  const store = applyMiddleware(thunk)(createStore)(ZiltagAppReducer);
  const imgs = document.getElementsByTagName('img');

  function is_outside(relatedTarget) {
    if (relatedTarget == null) {
      return true;
    } else {
      const check_names = [
        'ziltag-switch',
        'ziltag-ziltag',
        'ziltag-ziltag-preview'
      ];
      for (const check_name of check_names) {
        if (relatedTarget.className.indexOf(check_name) != -1) {
          return false;
        }
      }
      return true;
    }
  }

  window.addEventListener('resize', () => {
    store.dispatch(deactivate_ziltag_map());
  });

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i];

    img.addEventListener('mouseenter', (e) => {
      const { offsetLeft, offsetTop, width, height, src } = img;
      if (is_outside(e.relatedTarget)) {
        store.dispatch(
          activate_ziltag_map(
            offsetLeft, offsetTop, width, height, src, location.href)
        );
      }
    });
    img.addEventListener('mouseleave', (e) => {
      if (is_outside(e.relatedTarget)) {
        store.dispatch(deactivate_ziltag_map());
      }
    });
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer');
      store.replaceReducer(nextReducer);
    });
  }

  const mount_node = document.createElement('div');
  document.body.appendChild(mount_node);

  React.render(
    // The child must be wrapped in a function
    // to work around an issue in React 0.13.
    <Provider store={store}>
      {() => <ZiltagApp />}
    </Provider>,
    mount_node
  );
});
