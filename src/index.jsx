import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import node_uuid from 'node-uuid';

import ZiltagApp from './app';
import ZiltagAppReducer from './reducer';
import { init_ziltag_map, fetch_ziltags } from './action';


document.addEventListener('DOMContentLoaded', () => {
  const store = applyMiddleware(thunk)(createStore)(ZiltagAppReducer);
  const imgs = document.getElementsByTagName('img');
  const API_ADDRESS = 'http://staging.ziltag.com/api/v1/ziltags?src=';

  for (let i = 0; i < imgs.length; ++i) {
    const img = imgs[i];
    const bind_id = node_uuid.v1();

    img.addEventListener('load', () => {
      store.dispatch(
        init_ziltag_map(
          bind_id, img.offsetLeft, img.offsetTop, img.width, img.height
        )
      );
    });

    store.dispatch(fetch_ziltags(bind_id, img.src));
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
