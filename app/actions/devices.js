import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import firebase from '../lib/firebase';

const Actions = {
  createDevice() {
    return (dispatch, getState) => {
      dispatch({ type: Constants.DEVICE_CREATE });

      // Create a new device in /devices
      const { peer } = getState();
      const deviceRef = firebase.child('/devices').push();
      const deviceId = deviceRef.key();
      deviceRef.set({
        uid: deviceId,
        name: 'Living room',
        online: true,
        peerId: peer.id,
      });

      // Create association with current user
      const auth = getState().auth;
      const userDeviceRef = firebase.child(`/users/${auth.uid}/devices/${deviceId}`);
      userDeviceRef.set({ uid: deviceId });

      // TODO: figure out how to do it better
      localStorage.setItem(`dummyOwner_${deviceId}`, true);

      dispatch(routeActions.push(`/devices/${deviceId}/device`));
    };
  },

  bindToDevice(deviceId) {
    return (dispatch) => {
      const deviceRef = firebase.child(`/devices/${deviceId}`);

      deviceRef.on('value', (snapshot) => {
        const device = snapshot.val();
        dispatch(this.receiveDevice(device));
      });

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
