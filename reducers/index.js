import { combineReducers } from 'redux';
import {
  REQUEST_DEVICE, RECEIVE_DEVICE
} from '../actions';

function device(state = {
  isFetching: false,
  info: null
}, action) {
  switch (action.type) {
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

const rootReducer = combineReducers({
  device,
});

export default rootReducer;
