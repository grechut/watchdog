import Constants from '../constants';

const initialState = {
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.DEVICE_CREATE:
      return state;

    case Constants.DEVICE_REQUEST:
      return state;

    case Constants.DEVICE_RECEIVE: {
      const device = action.payload.device;

      return {
        ...state,
        [device.uid]: {
          ...state[device.uid],
          uid: device.uid,
          name: device.name,

          pushNotificationEndpoints: Object.keys(device.push_notification_endpoints || {}),
          isOwner: !!localStorage.getItem(`dummyOwner_${device.uid}`),
        },
      };
    }
    case Constants.VIDEO_STREAM_GET_LOCAL: {
      const { deviceId, stream } = action.payload;
      return {
        ...state,
        [deviceId]: {
          ...state[deviceId],
          localStream: stream,
        },
      };
    }

    case Constants.START_DETECTOR:
      action.detector.start();

      return {
        ...state,
        detectors: Object.assign({}, state.detectors, action.detector),
      };

    case Constants.STOP_DETECTOR:
      action.detector.stop();

      return {
        ...state,
        detectors: Object.assign({}, state.detectors, action.detector),
      };

    case Constants.CHANGE_DETECTOR:
      // TODO this is hacky, put here detector's info
      return {
        ...state,
      };

    case Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
