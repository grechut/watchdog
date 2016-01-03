import axios from 'axios';
import uuid from 'uuid';

import { updatePath } from 'redux-simple-router';

export const REQUEST_DEVICE = 'REQUEST_DEVICE';
export const RECEIVE_DEVICE = 'RECEIVE_DEVICE';
// TODO shall we switch here to 3 step actions ? start/success/error ?
export const CREATE_DEVICE = 'CREATE_DEVICE';
export const ADD_DEVICE_LISTENER = 'ADD_DEVICE_LISTENER';
export const NOTIFY = 'NOTIFY';

function requestDevice(deviceUuid) {
  return {
    type: REQUEST_DEVICE,
    deviceUuid,
  };
}

function receiveDevice(deviceInfo) {
  return {
    type: RECEIVE_DEVICE,
    deviceInfo,
  };
}

export function fetchDevice(deviceUuid) {
  return (dispatch) => {
    dispatch(requestDevice(deviceUuid));
    return axios.get(`/api/device/${deviceUuid}`)
      .then((response) => {
        dispatch(receiveDevice(response.data));
      });
  };
}

export function createDevice() {
  return (dispatch) => {
    dispatch({ type: CREATE_DEVICE });

    const deviceUuid = uuid.v4();
    localStorage.setItem(`dummyOwner_${deviceUuid}`, true);

    return axios.post('/api/device/create', { deviceUuid })
      .then(() =>
        dispatch(updatePath(`/devices/${deviceUuid}`))
      );
  };
}

export function addDeviceListener() {
  return (dispatch, getState) => {
    dispatch({ type: ADD_DEVICE_LISTENER });

    const deviceUuid = getState().device.owner;

    navigator.serviceWorker.getRegistration()
      .then((reg) => {
        return reg.pushManager.subscribe({ userVisibleOnly: true });
      })
      .then((pushSubscription) => {
        console.log(pushSubscription.endpoint);

        return axios.post('/api/device/listen', {
          deviceUuid,
          listenerEndpoint: pushSubscription.endpoint,
        });
      })
      .then(() => {
        dispatch(fetchDevice(deviceUuid));
      });
  };
}

export function notify(message) {
  return (dispatch, getState) => {
    dispatch({ type: NOTIFY });

    const deviceUuid = getState().device.owner;

    return axios.post('/api/notify', {
      deviceUuid,
      message,
    });
    // TODO shall we react to post in any way ? Maybe error display ?
  };
}
