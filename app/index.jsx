import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

require('../node_modules/react-mdl/extra/material.css');
require('../node_modules/react-mdl/extra/material.js');

require('./styles/main.css');

// TODO: set initial state on the server (?)
window.__INITIAL_STATE__ = {};
import configureStore from './store/configureStore';
const store = configureStore(window.__INITIAL_STATE__);

import installServiceWorker from './lib/install-sw-push-notifications';
installServiceWorker(store.dispatch);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes(store)} />
  </Provider>,
  document.getElementById('root')
);
