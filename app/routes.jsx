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
          path=":deviceId/device"
          component={DeviceOwner}
          onEnter={fetchDevice}
        />
      </Route>

      <Redirect from="*" to="/" />
    </Route>
  );

  function requireAuth(nextState, replace) {
    console.log('requireAuth');
    const url = nextState.location.pathname;

    if (!firebase.auth().currentUser) {
      replace({
        pathname: '/',
        query: { 'return-to': encodeURIComponent(url) },
        state: { nextPathname: url },
      });
    }
  }

  function requireNoAuth(nextState, replace) {
    if (firebase.auth().currentUser) {
      replace({
        pathname: '/devices',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  function fetchDevice(nextState, replace, callback) {
    const { deviceId } = nextState.params;
    const isOwner = deviceId === localStorage.getItem('WATCHDOG_OWNED_DEVICE_ID');
    const deviceOwnerPath = `/devices/${deviceId}/device`;

    if (isOwner && nextState.location.pathname !== deviceOwnerPath) {
      replace({ pathname: deviceOwnerPath });
    }

    let deviceFetch = dispatch(DeviceActions.fetchDevice(deviceId));
    if (isOwner) {
      deviceFetch = deviceFetch.then(() =>
        fetch('/api/devices/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId,
            secretToken: localStorage.getItem('WATCHDOG_OWNED_DEVICE_SECRET_TOKEN'),
          }),
        }
      )).catch(() => replace({ pathname: '/' }));
    }
    deviceFetch.then(() => callback());
  }
}

export function deviceUrl(deviceId) {
  return `${window.location.origin}/devices/${deviceId}`;
}
