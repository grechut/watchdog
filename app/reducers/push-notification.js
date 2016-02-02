import Constants from '../constants';

// TODO: use Reselect for derived data (http://rackt.org/redux/docs/recipes/ComputingDerivedData.html)
const initialState = {
  supported: false,
  denied: false,
  pending: false,
  enabled: true,
  subscribed: false,
  endpoint: null,
  key: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.PUSH_NOTIFICATION_SET_SUPPORTED:
      return {
        ...state,
        supported: action.payload.supported,
        enabled: action.payload.supported && !state.denied && !state.pending,
      };
    case Constants.PUSH_NOTIFICATION_SET_DENIED:
      return {
        ...state,
        denied: action.payload.denied,
        enabled: state.supported && !action.payload.denied && !state.pending,
      };
    case Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION:
      return {
        ...state,
        subscribed: !!action.payload.endpoint,
        endpoint: action.payload.endpoint,
        key: action.payload.key,
        enabled: state.supported && !state.denied,
      };
    case Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_PENDING:
    case Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_PENDING:
      return {
        ...state,
        pending: true,
        enabled: false,
      };
    case Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS:
      return {
        ...state,
        pending: false,
        enabled: state.supported && !state.denied,
      };
    case Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS:
      return {
        ...state,
        pending: false,
        enabled: state.supported && !state.denied,
      };
    case Constants.PUSH_NOTIFICATION_SEND:
      return state;
    default:
      return state;
  }
}
