import fetch from 'isomorphic-fetch';

export const REQUEST_DEVICE = 'REQUEST_DEVICE';
export const RECEIVE_DEVICE = 'RECEIVE_DEVICE';

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
        return fetch(`http://127.0.0.1:3000/api/device/${deviceUuid}`)
            .then(response => response.json())
            .then(json => dispatch(receiveDevice(json)));
    };
}