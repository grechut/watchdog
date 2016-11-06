import _ from 'lodash';
import firebase, { rootRef } from '../lib/firebase';
import Constants from '../constants';

const messaging = firebase.messaging();

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

  setSubscription(token) {
    return (dispatch, getState) => {
      const { auth } = getState();

      if (token) {
        // Add endpoint data to user's record unless it already exists
        const endpointsPath = `/users/${auth.uid}/push_notification_endpoints`;
        const endpointsRef = rootRef.child(endpointsPath);

        endpointsRef.once('value', (snapshot) => {
          const tokenExists = _(snapshot.val())
            .values()
            .includes(token);

          if (!tokenExists) {
            endpointsRef.push(token);
          }
        });
      }

      dispatch({
        type: Constants.PUSH_NOTIFICATION_SET_SUBSCRIPTION,
        payload: { token },
      });

      return token;
    };
  },

  subscribe() {
    return (dispatch) => {
      // TODO Figure out where it should be, if here on in subscribeToDevice.
      // TODO Remember to stop listening to token refreshes once it's no longer needed
      messaging.onTokenRefresh(() => {
        messaging.getToken()
          .then((refreshedToken) => {
            console.log('Push notification: Token refreshed.');
            dispatch(this.setSubscription(refreshedToken));
          })
          .catch((err) => {
            console.log('Push notification: Unable to retrieve refreshed token ', err);
          });
      });

      return messaging.requestPermission()
        .then(() =>
          messaging.getToken()
            .then(
              (currentToken) => {
                if (currentToken) {
                  // Send token to server
                  dispatch(this.setSubscription(currentToken));
                } else {
                  dispatch(this.setSubscription(null));
                }

                return currentToken || null;
              },
              (err) => {
                console.log('Push notification: An error occurred while retrieving token. ', err);
                dispatch(this.setSubscription(null));
              }
            )
            .catch((err) => {
              console.log('Push notification: Error while setting subscription token. ', err);
              dispatch(this.setSubscription(null));
            })
        )
        .catch((err) => {
          console.log('Push notification: Unable to get permission to notify. ', err);
        });
    };
  },

  subscribeToDevice(deviceId) {
    return (dispatch, getState) => {
      const auth = getState().auth;

      dispatch({ type: Constants.PUSH_NOTIFICATION_SUBSCRIBE_TO_DEVICE_REQUEST_PENDING });

      return dispatch(this.subscribe())
        .then((pushToken) => {
          if (pushToken) {
            // Add user id to device
            const deviceRef = rootRef.child(`/devices/${deviceId}/push_notification_endpoints`);
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
      const deviceRef = rootRef.child(`/devices/${deviceId}`);
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

  send(deviceId, payload) {
    return (dispatch, getState) => {
      const state = getState();

      // TODO: can't we figure it out from the data in the database?
      // Send owner's push token to prevent server from sending notifications to the owner.
      const pushToken = state.pushNotification.token;
      const secretToken = localStorage.getItem('WATCHDOG_OWNED_DEVICE_SECRET_TOKEN');

      const url = `${window.location.origin}/devices/${deviceId}`;
      const incidentRef = rootRef.child(`incidents/${deviceId}`).push();
      incidentRef.set(payload);

      fetch(`/api/devices/${deviceId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secretToken,
          pushToken,
          payload: { ...payload, url },
        }),
      });

      return dispatch({
        type: Constants.PUSH_NOTIFICATION_SEND,
      });
    };
  },
};

export default Actions;
