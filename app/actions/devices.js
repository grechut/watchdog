import { routeActions } from 'react-router-redux';

import firebase from 'lib/firebase';

import Constants from 'constants';

const Actions = {
  createDevice(name) {
    return (dispatch, getState) => {
      dispatch({ type: Constants.DEVICE_CREATE });

      // Create a new device in /devices
      const { peer } = getState();

      // Create association with current user
      const auth = getState().auth;

      fetch('/api/devices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          peerId: peer.id,
          authUid: auth.uid,
          name,
        }),
      })
      .then((res) => res.json())
      .then((json) => {
        const { deviceId, secretToken } = json;

        localStorage.setItem('WATCHDOG_OWNED_DEVICE_ID', deviceId);
        localStorage.setItem('WATCHDOG_OWNED_DEVICE_SECRET_TOKEN', secretToken);

        dispatch(routeActions.push(`/devices/${deviceId}/device`));
      });
    };
  },

  bindToDevices() {
    return (dispatch, getState) => {
      const { auth } = getState();
      const devicesRef = firebase.child(`users/${auth.uid}/devices`);

      // TODO: listen to child_removed, child_changed as well?
      devicesRef.on('child_added', (deviceIdSnapshot) => {
        const deviceId = deviceIdSnapshot.key();
        const deviceRef = firebase.child(`devices/${deviceId}`);

        deviceRef.once('value', (deviceSnapshot) => {
          const device = deviceSnapshot.val();
          console.log('Received device:', device);
          dispatch(this.receiveDevice(device));
        });
      });
    };
  },

  unbindFromDevices() {
    return (dispatch, getState) => {
      const { auth } = getState();
      const devicesRef = firebase.child(`users/${auth.uid}/devices`);

      devicesRef.off('child_added');
    };
  },

  fetchDevice(deviceId) {
    return (dispatch) => {
      const deviceRef = firebase.child(`/devices/${deviceId}`);

      // Return a promise
      return deviceRef.once('value', (snapshot) => {
        const device = snapshot.val();
        dispatch(this.receiveDevice(device));
      });
    };
  },

  bindToDevice(deviceId) {
    return (dispatch) => {
      const deviceRef = firebase.child(`/devices/${deviceId}`);

      deviceRef.on('value', (snapshot) => {
        const device = snapshot.val();
        dispatch(this.receiveDevice(device));
      });

      // Return a ref, so it's possible to call off() on it
      return deviceRef;
    };
  },

  unbindFromDevice(deviceId) {
    const deviceRef = firebase.child(`/devices/${deviceId}`);
    deviceRef.off('value');
  },

  syncOnlineStatus(deviceId) {
    return () => {
      const connectedRef = firebase.child('.info/connected');
      const deviceRef = firebase.child(`/devices/${deviceId}`);

      connectedRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          deviceRef.update({ online: true });
          deviceRef.onDisconnect().update({ online: false });
        } else {
          deviceRef.update({ online: false });
        }
      });
    };
  },

  receiveDevice(device) {
    return {
      type: Constants.DEVICE_RECEIVE,
      payload: {
        device,
      },
    };
  },
};

export default Actions;
