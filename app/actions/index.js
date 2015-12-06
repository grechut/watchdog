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
        deviceUuid
    };
}

function receiveDevice(deviceInfo) {
    return {
        type: RECEIVE_DEVICE,
        deviceInfo: deviceInfo
    };
}

export function fetchDevice(deviceUuid) {
    return dispatch => {
        dispatch(requestDevice(deviceUuid));
        return axios.get(`/api/device/${deviceUuid}`)
            .then(response => dispatch(receiveDevice(response.data)));
    };
}

export function createDevice() {
    return dispatch => {
        dispatch({type: CREATE_DEVICE});
        let deviceUuid = uuid.v4();
        return axios.post('/api/device/create', { deviceUuid: deviceUuid })
            .then(response => dispatch(updatePath(`/device/${deviceUuid}`)));
    }
}

export function addDeviceListener() {
    /* TODO handle subscribing only once. Push API will help */
    return (dispatch, getState) => {
        dispatch({type: ADD_DEVICE_LISTENER});

        let deviceUuid = getState().device.info.owner,
            listenerUuid = uuid.v4();
        return axios.post('/api/device/listen', {
                deviceUuid: deviceUuid,
                listenerUuid: listenerUuid
                /* TODO here would go push API subscription */
            })
            .then(response => dispatch(fetchDevice(deviceUuid)));
    }
}

export function notify(message) {
    return (dispatch, getState) => {
        dispatch({type: NOTIFY});

        let deviceUuid = getState().device.info.owner;
        return axios.post('/api/notify', {
                deviceUuid: deviceUuid,
                message: message
             });
        // TODO shall we react to post in any way ? Maybe error display ?
    }
}