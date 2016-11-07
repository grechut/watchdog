import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from './routes';
import firebase from './lib/firebase';
import Constants from './constants';
import configureStore from './store/configureStore';
import PushNotificationActions from './actions/push-notification';

require('../node_modules/react-mdl/extra/material.js');
require('../node_modules/react-mdl/extra/material.css');
require('./styles/main.css');
require('./manifest.json');

const store = configureStore(window.__INITIAL_STATE__ || {});

// TODO Check if firebase.messaging already provides such info
// Check if push notifications are supported
if (('serviceWorker' in navigator) &&
    ('showNotification' in ServiceWorkerRegistration.prototype) &&
    ('PushManager' in window)) {
  store.dispatch(PushNotificationActions.setSupported(true));
}

// Check if user is signed in before displaying the app
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  // Stop listening for auth state changes
  unsubscribe();

  if (user) {
    store.dispatch({
      type: Constants.AUTH_SIGN_IN,
      payload: { user },
    });
  }

  // Replace splash screen with the app
  render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes(store)} />
    </Provider>,
    document.getElementById('root'),
  );
});
