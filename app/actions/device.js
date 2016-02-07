import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import VideoStreamActions from '../actions/video-stream';
import firebase from '../lib/firebase';

const Actions = {
  fetchDevice(deviceId) {
    return (dispatch, getState) => {
      const deviceRef = firebase.child(`/devices/${deviceId}`);

      deviceRef.on('value', (snapshot) => {
        const device = snapshot.val();

        dispatch(receiveDevice(device));

        // TODO:
        // - run this code only on inital load, not on updates
        // - stop video/detectos when leaving device page as owner
        if (getState().device.isOwner) {
          dispatch(VideoStreamActions.getLocalVideoStream());
        }
      });
    };
  },

  createDevice() {
    return (dispatch, getState) => {
      dispatch({ type: Constants.DEVICE_CREATE });

      // Create device in /devices
      const deviceRef = firebase.child(`/devices`).push();
      const deviceId = deviceRef.key();
      deviceRef.set({
        uid: deviceId,
        name: 'Living room',
      });

      // Create association with current user
      const auth = getState().auth;
      const userDeviceRef = firebase.child(`/users/${auth.uid}/devices/${deviceId}`);
      userDeviceRef.set({ uid: deviceId });

      // TODO: figure out how to do it better
      localStorage.setItem(`dummyOwner_${deviceId}`, true);

      dispatch(routeActions.push(`/devices/${deviceId}`));
    };
  },
};

function receiveDevice(device) {
  return {
    type: Constants.DEVICE_RECEIVE,
    payload: {
      device,
    },
  };
}

export default Actions;
