import keymirror from 'keymirror';

const Constants = keymirror({
  AUTH_SIGN_IN_PENDING: null,
  AUTH_SIGN_IN: null,
  AUTH_SIGN_IN_FAILURE: null,
  AUTH_SIGN_OUT: null,
  AUTH_SIGNED_IN: null,
  AUTH_SIGNED_OUT: null,

  DEVICE_REQUEST: null,
  DEVICE_RECEIVE: null,
  DEVICE_CREATE: null,

  INCIDENT_ADD: null,

  PUSH_NOTIFICATION_SET_SUPPORTED: null,
  PUSH_NOTIFICATION_SET_DENIED: null,
  PUSH_NOTIFICATION_SET_SUBSCRIPTION: null,
  PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_PENDING: null,
  PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_PENDING: null,
  PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS: null,
  PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS: null,
  PUSH_NOTIFICATION_SEND: null,

  ADD_DEVICE_LISTENER: null,

  VIDEO_STREAM_GET_LOCAL: null,

  START_MOTION_DETECTION: null,
  CHANGE_DETECTOR: null,

  UPDATE_TITLE: null,
});

export default Constants;
