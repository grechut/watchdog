import _ from 'lodash';
import Constants from '../constants';

const initialState = {
  supported: false,
  denied: false,
  subscribed: false,
  endpoint: null,
  devices: [], // TODO: use Set instead?
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.PUSH_NOTIFICATION_SET_SUPPORTED:
      return Object.assign({}, state, {
        supported: action.payload.supported,
      });
    case Constants.PUSH_NOTIFICATION_SET_DENIED:
      return Object.assign({}, state, {
        denied: action.payload.denied,
      });
    case Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION:
      return Object.assign({}, state, {
        subscribed: !!action.payload.endpoint,
        endpoint: action.payload.endpoint,
      });
    case Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE:
      return Object.assign({}, state, {
        devices: _.uniq([...state.devices, action.payload.deviceId]),
      });
    case Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE:
      return Object.assign({}, state, {
        devices: _.without(state.devices, action.payload.deviceId),
      });
    case Constants.PUSH_NOTIFICATION_SEND:
      return state;
    default:
      return state;
  }
}
