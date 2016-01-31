import axios from 'axios';
import uuid from 'uuid';
import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import VideoStreamActions from '../actions/video-stream';

const Actions = {
  // TODO shall we switch here to 3 step actions ? start/success/error ?
  fetchDevice(deviceId) {
    return (dispatch, getState) => {
      dispatch(requestDevice(deviceId));

      return axios.get(`/api/devices/${deviceId}`)
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

      const deviceId = uuid.v4();
      localStorage.setItem(`dummyOwner_${deviceId}`, true);

      return axios.post('/api/devices', { deviceId })
        .then(() =>
          dispatch(routeActions.push(`/devices/${deviceId}`))
        );
    };
  },
};

function requestDevice(deviceId) {
  return {
    type: Constants.REQUEST_DEVICE,
    deviceId,
  };
}

function receiveDevice(device) {
  return {
    type: Constants.RECEIVE_DEVICE,
    device,
  };
}

export default Actions;
