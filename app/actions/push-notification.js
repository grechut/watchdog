import axios from 'axios';
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
      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION,
        payload: {
          endpoint: subscription ? subscription.endpoint : null,
        },
      });

      return subscription;
    };
  },

  subscribe() {
    return (dispatch) => {
      return navigator.serviceWorker.getRegistration().then((registration) => {
        return registration.pushManager.getSubscription().then((existingSubscription) => {
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
        });
      });
    };
  },

  unsubscribe() {
    return (dispatch) => {
      return navigator.serviceWorker.getRegistration().then((registration) => {
        return registration.pushManager.getSubscription().then((subscription) => {
          // Check if need to unsubscribe
          if (!subscription) {
            return dispatch(this.setSubscription(null));
          }

          return subscription.unsubscribe().then(() =>
            dispatch(this.setSubscription(null))
          );
        });
      });
    };
  },

  subscribeToDevice(deviceId) {
    return (dispatch) => {
      return dispatch(this.subscribe())
        .then((subscription) => {
          if (subscription) {
            axios.post(`/api/devices/${deviceId}/subscribe`, {
              listenerEndpoint: subscription.endpoint,
            })
            .then(() =>
              dispatch({
                type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE,
                payload: { deviceId },
              })
            );
          }
        });
    };
  },

  unsubscribeFromDevice(deviceId) {
    return (dispatch, getState) => {
      const { pushNotification } = getState();
      const endpoint = pushNotification.endpoint;

      axios.post(`/api/devices/${deviceId}/unsubscribe`, {
        listenerEndpoint: endpoint,
      })
      .then(() =>
        dispatch({
          type: Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE,
          payload: { deviceId },
        })
      );
    };
  },

  toggleSubscriptionForDevice(deviceId) {
    return (dispatch, getState) => {
      const { pushNotification } = getState();
      const isSubscribed = _.includes(pushNotification.devices, deviceId);
      const action = isSubscribed ? 'unsubscribeFromDevice' : 'subscribeToDevice';

      return dispatch(this[action](deviceId));
    };
  },

  send(deviceId, message) {
    return (dispatch) => {
      dispatch({ type: Constants.PUSH_NOTIFICATION_SEND });

      // TODO: make sure that only owner can send notifications
      return axios.post(`/api/devices/${deviceId}/notify`, {
        message,
      });
    };
  },
};

export default Actions;
