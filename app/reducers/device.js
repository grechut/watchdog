import Constants from '../constants';

const initialState = {
  owner: null,        // ? camera uuid ?
  isOwner: false,     //
  remoteStream: null, // listener specific
  localStream: null,  // owner specific
  listeners: {
    pushNotificationEndpoints: [],
  },
  detectors: {},      // owner specific (just a configuration of detector + its state, not actual instances)
  isFetching: false,
};

function device(state = initialState, action) {
  switch (action.type) {
    case Constants.CREATE_DEVICE:
      return state;

    case Constants.REQUEST_DEVICE:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case Constants.RECEIVE_DEVICE:
      return Object.assign({},
        state, {
          isFetching: false,
          isOwner: localStorage.getItem(`dummyOwner_${action.device.owner}`),
        },
        action.device
      );

    case Constants.VIDEO_STREAM_GET_LOCAL:
      return Object.assign({}, state, {
        localStream: action.stream,
      });

    case Constants.START_DETECTOR:
      action.detector.start();

      return Object.assign({}, state, {
        detectors: Object.assign({}, state.detectors, action.detector),
      });

    case Constants.STOP_DETECTOR:
      action.detector.stop();

      return Object.assign({}, state, {
        detectors: Object.assign({}, state.detectors, action.detector),
      });

    case Constants.CHANGE_DETECTOR:
      // TODO this is hacky, put here detector's info
      return Object.assign({}, state);

    case Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS:
      return Object.assign({}, state, action.payload);

    case Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}

export default device;
