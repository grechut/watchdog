import fetch from 'isomorphic-fetch';

export const REQUEST_DEVICE = 'REQUEST_DEVICE';
export const RECEIVE_DEVICE = 'RECEIVE_DEVICE';

function requestDevice(deviceId) {
    return {
        type: REQUEST_DEVICE,
        deviceId
    };
}

function receiveDevice(device) {
    return {
        type: RECEIVE_DEVICE,
        device: device
    };
}

export function fetchDevice(deviceId) {
    return dispatch => {
        dispatch(requestDevice(deviceId));
        return fetch(`http://127.0.0.1:3000/device/${deviceId}`)
            .then(response => response.json())
            .then(json => dispatch(receiveDevice(json)));
    };
}