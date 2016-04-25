import _ from 'lodash';

import firebase from 'lib/firebase';

import Constants from 'constants';

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
    return (dispatch, getState) => {
      const { auth } = getState();
      const url = subscription ? subscription.endpoint : null;
      const payload = { url };

      if (subscription) {
        // Retrieve browser's public key and auth used to encrypt payload of notifications
        // sent *to* this browser.
        const subscriptionData = subscription.toJSON();
        payload.authSecret = subscriptionData.keys.auth;
        payload.publicKey = subscriptionData.keys.p256dh;

        // Add endpoint data to user's record unless it already exists
        const endpointsPath = `/users/${auth.uid}/push_notification_endpoints`;
        const endpointsRef = firebase.child(endpointsPath);

        endpointsRef.once('value', (snapshot) => {
          const endpointExists = _(snapshot.val())
            .values()
            .some((endpoint) => endpoint.url === url);

          if (!endpointExists) {
            endpointsRef.push(payload);
          }
        });
      }

      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION,
        payload,
      });

      return subscription;
    };
  },

  subscribe() {
    return (dispatch) =>
      navigator
        .serviceWorker
        .getRegistration()
        .then((registration) =>
          registration
            .pushManager
            .getSubscription()
            .then((existingSubscription) => {
              // Check if we need to subscribe
              if (existingSubscription) {
                return dispatch(this.setSubscription(existingSubscription));
              }

              return registration
                .pushManager
                .subscribe({ userVisibleOnly: true })
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
      navigator
        .serviceWorker
        .getRegistration()
        .then((registration) =>
          registration
            .pushManager
            .getSubscription()
            .then((subscription) => {
              // Check if need to unsubscribe
              if (!subscription) {
                return dispatch(this.setSubscription(null));
              }

              return subscription.unsubscribe().then(() =>
                // TODO: remove subscription from Firebase
                dispatch(this.setSubscription(null))
              );
            })
      );
  },

  subscribeToDevice(deviceId) {
    return (dispatch, getState) => {
      const auth = getState().auth;

      dispatch({ type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_PENDING });

      return dispatch(this.subscribe())
        .then((subscription) => {
          if (subscription) {
            // Add user id to device
            const deviceRef = firebase.child(`/devices/${deviceId}/push_notification_endpoints`);
            deviceRef.update({ [auth.uid]: true }, onSet);
          }
        });

      function onSet(error) {
        if (error) return;

        dispatch({
          type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_SUCCESS,
          payload: {},
        });
      }
    };
  },

  unsubscribeFromDevice(deviceId) {
    return (dispatch, getState) => {
      dispatch({
        type: Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_PENDING,
      });

      const { auth } = getState();
      const deviceRef = firebase.child(`/devices/${deviceId}`);
      const endpointsRef = deviceRef.child(`/push_notification_endpoints/${auth.uid}`);
      endpointsRef.remove(onRemove);

      function onRemove(error) {
        if (error) return;

        dispatch({
          type: Constants.PUSH_NOTIFICATION_UNSUBSCRIBE_FROM_DEVICE_REQUEST_SUCCESS,
          payload: {
            // TODO: figure out payload
          },
        });
      }
    };
  },

  toggleSubscriptionForDevice(deviceId) {
    return (dispatch, getState) => {
      const { devices, auth } = getState();
      const device = devices[deviceId];
      const isSubscribed = _.includes(
        device.pushNotificationEndpoints,
        auth.uid
      );
      const action = isSubscribed ? 'unsubscribeFromDevice' : 'subscribeToDevice';

      return dispatch(this[action](deviceId));
    };
  },

  // TODO: make sure that only owner can send notifications
  send(deviceId, payload) {
    return (dispatch) => {
      dispatch({
        type: Constants.PUSH_NOTIFICATION_SEND,
        payload: { deviceId, payload },
      });

      const url = `${window.location.origin}/devices/${deviceId}`;
      const incidentRef = firebase.child(`incidents/${deviceId}`).push();
      incidentRef.set(payload);

      return fetch(`/api/devices/${deviceId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: { ...payload, url },
          secretToken: localStorage.getItem('WATCHDOG_OWNED_DEVICE_SECRET_TOKEN'),
        }),
      });
    };
  },
};

export default Actions;
