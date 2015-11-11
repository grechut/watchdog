import { combineReducers } from 'redux';
import {
  REQUEST_DEVICE, RECEIVE_DEVICE
} from '../actions';

function devices(state = {
  isFetching: false,
  device: null
}, action) {
  switch (action.type) {
      case REQUEST_DEVICE:
      return Object.assign({}, state, {
          isFetching: true
      });
      case RECEIVE_DEVICE:
      return Object.assign({}, state, {
          isFetching: false,
          device: action.device
      });
      default:
      return state;
  }
}

const rootReducer = combineReducers({
  devices,
});

export default rootReducer;
