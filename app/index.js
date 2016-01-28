import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, browserHistory } from 'react-router';

require('../node_modules/react-mdl/extra/material.css');
require('../node_modules/react-mdl/extra/material.js');
require('./styles/main.css');

import App from './containers/App';
import NewDevice from './containers/NewDevice';
import Device from './containers/Device';
import configureStore from './store/configureStore';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="devices/new" />
      <Route path="/" component={App}>
        <Route path="devices/new" component={NewDevice} />
        <Route path="devices/:deviceUuid" component={Device} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
