import axios from 'axios';
import firebase from '../lib/firebase';
import _ from 'lodash';
import Constants from '../constants';

const Actions = {
  setSupported(flag) {
    return (dispatch) => {
      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_SUPPORTED,
        payload: {
          supported: flag,
        },
      });
    };
  },

  setDenied(flag) {
    return (dispatch) => {
      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_DENIED,
        payload: {
          denied: flag,
        },
      });
    };
  },

  setSubscription(subscription) {
    return (dispatch) => {
      const endpoint = subscription ? subscription.endpoint : null;
      let key = null;

      if (subscription) {
        const rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
      }

      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION,
        payload: {
          endpoint,
          key,
        },
      });

      return subscription;
    };
  },

  subscribe() {
    return (dispatch) =>
      navigator.serviceWorker.getRegistration().then((registration) =>
        registration.pushManager.getSubscription().then((existingSubscription) => {
          // Check if we need to subscribe
          if (existingSubscription) {
            return dispatch(this.setSubscription(existingSubscription));
          }

          return registration.pushManager.subscribe({ userVisibleOnly: true })
            .then((subscription) =>
              dispatch(this.setSubscription(subscription))
            )
            .catch((error) => {
              if (Notification.permission === 'denied') {
                dispatch(this.setDenied(true));
                console.log('Push Notification: permission denied', error);
              } else {
                console.log('Push Notification: error during subscribe', error);
              }

              return dispatch(this.setSubscription(null));
            });
        })
      );
  },

  unsubscribe() {
    return (dispatch) =>
      navigator.serviceWorker.getRegistration().then((registration) =>
        registration.pushManager.getSubscription().then((subscription) => {
          // Check if need to unsubscribe
          if (!subscription) {
            return dispatch(this.setSubscription(null));
          }

          return subscription.unsubscribe().then(() =>
            dispatch(this.setSubscription(null))
          );
        })
      );
  },

  subscribeToDevice(deviceId) {
    return (dispatch) => {
      dispatch({ type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_PENDING });

      return dispatch(this.subscribe())
        .then((subscription) => {
          if (subscription) {
            const deviceRef = firebase.child(`/devices/${deviceId}`);
            const endpointRef = deviceRef.child('/push_notification_endpoints').push();
            endpointRef.set({ value: subscription.endpoint }, (error) => {
              if (error) return;

              dispatch({
                type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS,
                payload: {
                  // TODO: figure out payload
                },
              });
            });
          }
        });
    };
  },

  unsubscribeFromDevice(deviceId) {
    return (dispatch, getState) => {
      dispatch({ type: Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_PENDING });

      const { pushNotification } = getState();
      const endpoint = pushNotification.endpoint;

      axios.post(`/api/devices/${deviceId}/unsubscribe`, {
        pushNotificationEndpoint: endpoint,
      })
      .then((response) =>
        dispatch({
          type: Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS,
          payload: response.data,
        })
      );
    };
  },

  toggleSubscriptionForDevice(deviceId) {
    return (dispatch, getState) => {
      const { device, pushNotification } = getState();
      const isSubscribed = _.includes(
        device.listeners.pushNotificationEndpoints,
        pushNotification.endpoint
      );
      const action = isSubscribed ? 'unsubscribeFromDevice' : 'subscribeToDevice';

      return dispatch(this[action](deviceId));
    };
  },

  send(deviceId, key, payload) {
    return (dispatch) => {
      dispatch({
        type: Constants.PUSH_NOTIFICATION_SEND,
        payload: { deviceId, key, payload },
      });

      // TODO: make sure that only owner can send notifications
      return axios.post(`/api/devices/${deviceId}/notify`, {
        key,
        payload,
      });
    };
  },
};

export default Actions;
