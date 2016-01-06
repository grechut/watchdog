import axios from 'axios';
import uuid from 'uuid';
import { updatePath } from 'redux-simple-router';
import detectors from '../lib/detectors';
import MotionDetector from '../lib/detectors/motion';


// FETCH_DEVICE -> REQUEST_DEVICE -> RECEIVE_DEVICE -> ...
// if isOwner then GET_LOCAL_VIDEO_STREAM -> START MOTION/NOISE DETECTION
// else then GET_REMOTE_VIDEO_STREAM (once "Live" tab is clicked)

// TODO shall we switch here to 3 step actions ? start/success/error ?
export function fetchDevice(deviceUuid) {
  return (dispatch, getState) => {
    dispatch(requestDevice(deviceUuid));

    return axios.get(`/api/device/${deviceUuid}`)
      .then((response) => {
        dispatch(receiveDevice(response.data));

        // At this point isOwner should already be set
        const isOwner = getState().device.isOwner;
        if (isOwner) {
          dispatch(getLocalVideoStream());
        }
      });
  };
}

export const REQUEST_DEVICE = 'REQUEST_DEVICE';
function requestDevice(deviceUuid) {
  return {
    type: REQUEST_DEVICE,
    deviceUuid,
  };
}

export const RECEIVE_DEVICE = 'RECEIVE_DEVICE';
function receiveDevice(deviceInfo) {
  return {
    type: RECEIVE_DEVICE,
    deviceInfo,
  };
}

export const CREATE_DEVICE = 'CREATE_DEVICE';
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

export const ADD_DEVICE_LISTENER = 'ADD_DEVICE_LISTENER';
export function addDeviceListener() {
  return (dispatch, getState) => {
    dispatch({ type: ADD_DEVICE_LISTENER });

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
        dispatch(fetchDevice(deviceUuid));
      });
  };
}

export const NOTIFY = 'NOTIFY';
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

export const GET_LOCAL_VIDEO_STREAM = 'GET_LOCAL_VIDEO_STREAM';
export function getLocalVideoStream() {
  return (dispatch) => {
    const constraints = { video: true, audio: true };
    const gotStream = function (stream) {
      dispatch({
        type: GET_LOCAL_VIDEO_STREAM,
        stream,
      });

      // TODO: move it somewhere else and dispatch actin to update state
      const motionDetector = new MotionDetector(stream);
      motionDetector.onEvent = () => {
        console.warn('Motion detected!');
      };
      motionDetector.start();
      detectors.motion = motionDetector;
    };
    const gotError = function (error) {
      console.error(error);
    };
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;

    return navigator.getUserMedia(constraints, gotStream, gotError);
  };
}

export const START_MOTION_DETECTION = 'START_MOTION_DETECTION';
export function startMotionDetection() {
  return (dispatch) => {
    // TODO: initialize and start motion detection (figure out how to pass custom config)
    // TODO: set detectors object - "motion" and "noise"
    // TODO: toggle isDetectingMotion flag

    dispatch({
      type: START_MOTION_DETECTION,
    });
  };
}
