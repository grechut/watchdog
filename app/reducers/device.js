import Constants from '../constants';

const initialState = {
  uid: null,
  name: null,

  isOwner: false,     // TODO: derived data
  remoteStream: null, // listener specific
  localStream: null,  // owner specific
  listeners: {
    pushNotificationEndpoints: [],
  },
  detectors: {},
  isFetching: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.DEVICE_CREATE:
      return state;

    case Constants.DEVICE_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case Constants.DEVICE_RECEIVE:
      return {
        ...state,
        isFetching: false,
        isOwner: localStorage.getItem(`dummyOwner_${action.payload.device.uid}`),
        ...action.payload.device,
      };

    case Constants.VIDEO_STREAM_GET_LOCAL:
      return {
        ...state,
        localStream: action.stream,
      };

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
