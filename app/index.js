import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import firebase from './lib/firebase';

require('../node_modules/react-mdl/extra/material.css');
require('../node_modules/react-mdl/extra/material.js');

require('./styles/main.css');

import configureStore from './store/configureStore';
const store = configureStore();

import installServiceWorker from './lib/install-sw-push-notifications';
installServiceWorker(store.dispatch);

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import LayoutContainer from './containers/LayoutContainer';
import NewDevice from './containers/NewDevice';
import Device from './containers/Device';

function requireAuth(nextState, replace) {
  if (!firebase.getAuth()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

function requireNoAuth(nextState, replace) {
  if (firebase.getAuth()) {
    replace({
      pathname: '/devices/new',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={LandingPage} onEnter={requireNoAuth} />
        <Route component={LayoutContainer} onEnter={requireAuth}>
          <Route path="devices/new" component={NewDevice} />
          <Route path="devices/:deviceUuid" component={Device} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
