import axios from 'axios';
import uuid from 'uuid';
import { routeActions } from 'react-router-redux';
import Rx from 'rxjs/Rx';
import moment from 'moment';
import detectors from '../lib/detectors';
import MotionDetector from '../lib/detectors/motion';
import Constants from '../constants';

// FETCH_DEVICE -> REQUEST_DEVICE -> RECEIVE_DEVICE -> ...
// if isOwner then VIDEO_STREAM_GET_LOCAL -> START MOTION/NOISE DETECTION
// else then VIDEO_STREAM_GET_REMOTE (once "Live" tab is clicked)

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

export function createDevice() {
  return (dispatch) => {
    dispatch({ type: Constants.CREATE_DEVICE });

    const deviceUuid = uuid.v4();
    localStorage.setItem(`dummyOwner_${deviceUuid}`, true);

    return axios.post('/api/device/create', { deviceUuid })
      .then(() =>
        dispatch(routeActions.push(`/devices/${deviceUuid}`))
      );
  };
}

export function addDeviceListener() {
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
        dispatch(fetchDevice(deviceUuid));
      });
  };
}

export function notify(message) {
  return (dispatch, getState) => {
    dispatch({ type: Constants.NOTIFY });

    const deviceUuid = getState().device.owner;

    return axios.post('/api/notify', {
      deviceUuid,
      message,
    });
    // TODO shall we react to post in any way ? Maybe error display ?
  };
}

export function getLocalVideoStream() {
  return (dispatch) => {
    const constraints = { video: true, audio: true };
    const gotStream = function (stream) {
      dispatch({
        type: Constants.VIDEO_STREAM_GET_LOCAL,
        stream,
      });

      // TODO: move it somewhere else and dispatch action to update state
      const motionDetector = new MotionDetector(stream);
      const source = new Rx.Subject();
      const windowDuration = 30000; // 30 seconds

      // Notify when motion has started
      const next = source
        .debounceTime(windowDuration)
        .switchMap(() => source.take(1));

      Rx.Observable.merge(source.take(1), next)
        .subscribe((data) => {
          const message = `Motion started at ${time(data.triggeredAt)}`;
          console.log(message);
          dispatch(notify(message));
        });

      // Notify when motion has stopped
      source
        .debounceTime(windowDuration)
        .subscribe((data) => {
          const message = `Motion stopped at ${time(data.triggeredAt)}`;
          console.log(message);
          dispatch(notify(message));
        });

      // Proxy events to source observable when motion is detected
      motionDetector.onEvent = (data) => {
        data.triggeredAt = Date.now();
        source.next(data);
        console.log('motion detected', data);
      };

      motionDetector.start();
      detectors.motion = motionDetector;

      function time(timestamp) {
        return moment(timestamp).format('hh:mm:ss.SS');
      }

      dispatch({
        type: Constants.CHANGE_DETECTOR,
      });
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

export function startMotionDetection() {
  return (dispatch) => {
    // TODO: initialize and start motion detection (figure out how to pass custom config)
    // TODO: set detectors object - "motion" and "noise"
    // TODO: toggle isDetectingMotion flag

    dispatch({
      type: Constants.START_MOTION_DETECTION,
    });
  };
}

export function updateTitle(title) {
  return (dispatch) => {
    dispatch({
      type: Constants.UPDATE_TITLE,
      payload: {
        title,
      },
    });
  };
}
