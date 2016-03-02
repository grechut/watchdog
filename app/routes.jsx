import React from 'react';
import { Route, IndexRoute } from 'react-router';
import firebase from './lib/firebase';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import LayoutContainer from './containers/LayoutContainer';
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

      <Route path="devices" component={LayoutContainer} onEnter={requireAuth}>
        <IndexRoute component={DeviceList} />
        <Route path="new" component={DeviceNew} />
        <Route path=":deviceId"
          component={Device}
          onEnter={fetchDevice /* requireNoOwnership */}
        />
        <Route
          path=":deviceId/device"
          component={DeviceOwner}
          onEnter={fetchDevice /* requireOwnership */}
        />
      </Route>
    </Route>
  );

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
        pathname: '/devices',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  function fetchDevice(nextState, replace, callback) {
    const { deviceId } = nextState.params;
    const isOwner = deviceId === localStorage.getItem('WATCHDOG_OWNER_UUID');
    const deviceOwnerPath = `/devices/${deviceId}/device`;

    if (isOwner && nextState.location.pathname !== deviceOwnerPath) {
      replace({ pathname: deviceOwnerPath });
    }

    dispatch(DeviceActions.fetchDevice(deviceId))
      .then(() => callback());

    // if (isOwner) {
    //   fetch = fetch.then(() => /*validate server-side device ownership using
    //   localStorage.getItem('WATCHDOG_SECTET_TOKEN') and secret tokens collection in Firebase */)
    // }
  }
}
