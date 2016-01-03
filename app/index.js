import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';

import NewDevice from './containers/NewDevice';
import Device from './containers/Device';

import configureStore from './store/configureStore';

require('./styles/main.css');

const store = configureStore();
const history = createBrowserHistory();

syncReduxAndRouter(history, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={NewDevice} />
      <Route path="/devices/:deviceUuid" component={Device} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
