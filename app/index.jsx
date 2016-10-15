import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from './routes';
import firebase from './lib/firebase';
import Constants from './constants';
import configureStore from './store/configureStore';
import installServiceWorker from './lib/install-sw-push-notifications';

require('../node_modules/react-mdl/extra/material.js');
require('../node_modules/react-mdl/extra/material.css');
require('./styles/main.css');

const store = configureStore(window.__INITIAL_STATE__ || {});

installServiceWorker(store.dispatch);

// Check if user is signed in before displaying the app
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch({
      type: Constants.AUTH_SIGN_IN,
      payload: { user },
    });
  }

  // Stop listening for auth state changes
  unsubscribe();

  // Replace splash screen with the app
  render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes(store)} />
    </Provider>,
    document.getElementById('root')
  );
});
