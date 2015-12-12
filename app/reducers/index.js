import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {
  REQUEST_DEVICE, RECEIVE_DEVICE,
  CREATE_DEVICE, ADD_DEVICE_LISTENER,
  NOTIFY
} from '../actions';

function device(state = {
  isFetching: false,
  owner: null,
  listeners: [],
  isOwner: false
}, action) {
  switch (action.type) {
      case REQUEST_DEVICE:
      return Object.assign({}, state, {
          isFetching: true
      });
      case RECEIVE_DEVICE:
      return Object.assign({},
        state, {
          isFetching: false,
          isOwner: localStorage.getItem(`dummyOwner_${action.deviceInfo.owner}`)
        },
        action.deviceInfo);
      case CREATE_DEVICE: return state;
      case ADD_DEVICE_LISTENER: return state;
      case NOTIFY: return state;
      default:
      return state;
  }
}

const rootReducer = combineReducers(Object.assign({}, { device }, { routing: routeReducer }));

export default rootReducer;
