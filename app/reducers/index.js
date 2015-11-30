import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import {
  CREATE_DEVICE, REQUEST_DEVICE, RECEIVE_DEVICE
} from '../actions';

function device(state = {
  isFetching: false,
  info: null
}, action) {
  switch (action.type) {
      case CREATE_DEVICE: return state;
      case REQUEST_DEVICE:
      return Object.assign({}, state, {
          isFetching: true
      });
      case RECEIVE_DEVICE:
      return Object.assign({}, state, {
          isFetching: false,
          info: action.deviceInfo
      });
      default:
      return state;
  }
}

const rootReducer = combineReducers(Object.assign({}, { device }, { routing: routeReducer }));

export default rootReducer;
