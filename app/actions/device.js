import axios from 'axios';
import uuid from 'uuid';
import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import VideoStreamActions from '../actions/video_stream';

const Actions = {
  // TODO shall we switch here to 3 step actions ? start/success/error ?
  fetchDevice(deviceUuid) {
    return (dispatch, getState) => {
      dispatch(requestDevice(deviceUuid));

      return axios.get(`/api/device/${deviceUuid}`)
        .then((response) => {
          dispatch(receiveDevice(response.data));

          // At this point isOwner should already be set
          const isOwner = getState().device.isOwner;
          if (isOwner) {
            dispatch(VideoStreamActions.getLocalVideoStream());
          }
        });
    };
  },

  createDevice() {
    return (dispatch) => {
      dispatch({ type: Constants.CREATE_DEVICE });

      const deviceUuid = uuid.v4();
      localStorage.setItem(`dummyOwner_${deviceUuid}`, true);

      return axios.post('/api/device/create', { deviceUuid })
        .then(() =>
          dispatch(routeActions.push(`/devices/${deviceUuid}`))
        );
    };
  },

  addDeviceListener() {
    return (dispatch, getState) => {
      dispatch({ type: Constants.ADD_DEVICE_LISTENER });

      const deviceUuid = getState().device.owner;

      navigator.serviceWorker.getRegistration()
        .then((registration) => {
          return registration.pushManager.subscribe({ userVisibleOnly: true });
        })
        .then((pushSubscription) => {
          console.log(pushSubscription.endpoint);

          return axios.post('/api/device/listen', {
            deviceUuid,
            listenerEndpoint: pushSubscription.endpoint,
          });
        })
        .then(() => {
          dispatch(this.fetchDevice(deviceUuid));
        });
    };
  },
};

function requestDevice(deviceUuid) {
  return {
    type: Constants.REQUEST_DEVICE,
    deviceUuid,
  };
}

function receiveDevice(deviceInfo) {
  return {
    type: Constants.RECEIVE_DEVICE,
    deviceInfo,
  };
}

export default Actions;
