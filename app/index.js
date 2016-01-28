import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';

require('../node_modules/react-mdl/extra/material.css');
require('../node_modules/react-mdl/extra/material.js');

import App from './containers/App';
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
      <Redirect from="/" to="devices/new" />
      <Route path="/" component={App}>
        <Route path="devices/new" component={NewDevice} />
        <Route path="devices/:deviceUuid" component={Device} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
