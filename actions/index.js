import axios from 'axios';
import uuid from 'uuid';

import { updatePath } from 'redux-simple-router';

export const CREATE_DEVICE = 'CREATE_DEVICE';
export const REQUEST_DEVICE = 'REQUEST_DEVICE';
export const RECEIVE_DEVICE = 'RECEIVE_DEVICE';

export function createDevice() {
    return dispatch => {
        dispatch({type: CREATE_DEVICE});
        let newUuid = uuid.v4();
        return axios.post('/api/device/create', { uuid: newUuid })
            .then(response => dispatch(updatePath(`/device/${newUuid}`)));
    }
}

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