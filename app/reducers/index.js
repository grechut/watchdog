import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_DEVICE, RECEIVE_DEVICE, CREATE_DEVICE,
  ADD_DEVICE_LISTENER, NOTIFY,
  GET_LOCAL_VIDEO_STREAM, // GET_REMOTE_VIDEO_STREAM
  START_DETECTOR, STOP_DETECTOR,
} from '../actions';

function device(state = {
  owner: null,        // ? camera uuid ?
  isOwner: false,     //
  remoteStream: null, // listener specific
  localStream: null,  // owner specific
  listeners: [],      // TODO: does a listener need to know about other listeners? is it owner specific?
  detectors: {},      // owner specific (just a configuration of detector + its state, not actual instances)
  isFetching: false,
}, action) {
  switch (action.type) {
    case REQUEST_DEVICE:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_DEVICE:
      return Object.assign({},
        state, {
          isFetching: false,
          isOwner: localStorage.getItem(`dummyOwner_${action.deviceInfo.owner}`),
        },
        action.deviceInfo
      );
    case GET_LOCAL_VIDEO_STREAM:
      return Object.assign({}, state, {
        localStream: action.stream,
      });
    case START_DETECTOR:
      action.detector.start();

      return Object.assign({}, state, {
        detectors: Object.assign({}, state.detectors, action.detector),
      });
    case STOP_DETECTOR:
      action.detector.stop();

      return Object.assign({}, state, {
        detectors: Object.assign({}, state.detectors, action.detector),
      });
    case CREATE_DEVICE: return state;
    case ADD_DEVICE_LISTENER: return state;
    case NOTIFY: return state;
    default: return state;
  }
}

const rootReducer = combineReducers(Object.assign({}, { device }, { routing: routeReducer }));

export default rootReducer;
