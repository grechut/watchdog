import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';
import firebase from './lib/firebase';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import DeviceList from './containers/DeviceList';
import Device from './containers/Device';
import DeviceOwner from './containers/DeviceOwner';
import DeviceNew from './containers/DeviceNew';

import DeviceActions from './actions/devices';

export default function routes(store) {
  const { dispatch } = store;

  return (
    <Route path="/" component={App} >
      <IndexRoute component={LandingPage} onEnter={requireNoAuth} />

      <Route path="devices" onEnter={requireAuth}>
        <IndexRoute component={DeviceList} />
        <Route path="new" component={DeviceNew} />
        <Route
          path=":deviceId"
          component={Device}
          onEnter={fetchDevice}
        />
        <Route
          path=":deviceId/owner"
          component={DeviceOwner}
          onEnter={fetchDevice}
        />
      </Route>

      <Redirect from="*" to="/" />
    </Route>
  );

  function requireAuth(nextState, replace, callback) {
    const url = nextState.location.pathname;

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();

      if (!user) {
        replace({
          pathname: '/',
          query: { 'return-to': encodeURIComponent(url) },
          state: { nextPathname: url },
        });
      }
      callback();
    });
  }

  function requireNoAuth(nextState, replace, callback) {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();

      if (user) {
        replace({
          pathname: '/devices',
          state: { nextPathname: nextState.location.pathname },
        });
      }
      callback();
    });
  }

  function fetchDevice(nextState, replace, callback) {
    const { deviceId } = nextState.params;
    const isOwner = deviceId === localStorage.getItem('WATCHDOG_OWNED_DEVICE_ID');

    const deviceListenerPath = `/devices/${deviceId}`;
    const deviceOwnerPath = `/devices/${deviceId}/owner`;
    const { pathname } = nextState.location;

    if (isOwner && pathname === deviceListenerPath) {
      replace({ pathname: deviceOwnerPath });
    } else if (!isOwner && pathname === deviceOwnerPath) {
      replace({ pathname: deviceListenerPath });
    }

    let deviceFetch = dispatch(DeviceActions.fetchDevice(deviceId));

    if (isOwner) {
      // if user cheats for being owner, then we redirect him
      deviceFetch = deviceFetch.then(() => verifyOwner(deviceId))
        .catch(() => replace({ pathname: '/' }));
    }

    deviceFetch.then(() => callback());
  }

  /* TODO
    1. Find better place, but where? It's not an action..
    2. Do we still need such "security"?
  */
  function verifyOwner(deviceId) {
    fetch('/api/devices/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId,
        secretToken: localStorage.getItem('WATCHDOG_OWNED_DEVICE_SECRET_TOKEN'),
      }),
    });
  }
}

export function deviceUrl(deviceId) {
  return `${window.location.origin}/devices/${deviceId}`;
}
