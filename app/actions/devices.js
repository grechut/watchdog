import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import firebase from '../lib/firebase';
import axios from 'axios';

const Actions = {
  createDevice() {
    return (dispatch, getState) => {
      dispatch({ type: Constants.DEVICE_CREATE });

      // Create a new device in /devices
      const { peer } = getState();

      // Create association with current user
      const auth = getState().auth;

      axios.post('/api/devices/create', {
        peerId: peer.id,
        authUid: auth.uid,
      }).then((res) => {
        const { deviceId } = res.data;

        localStorage.setItem('WATCHDOG_OWNED_DEVICE_ID', deviceId);

        // // TODO generate on server this secret token,
        // // save in safe collection on Firebase and return to frontend
        // localStorage.setItem('WATCHDOG_OWNED_DEVICE_SECTET_TOKEN', 'todo_secret');
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
