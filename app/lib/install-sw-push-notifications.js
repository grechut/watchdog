import PushNotificationActions from 'actions/push-notification';

export default function install(dispatch) {
  if ('serviceWorker' in navigator) {
    console.log('Service workers are supported');

    navigator
      .serviceWorker
      .register('/sw-push-notifications.js')
      .then(initializeState);
  } else {
    console.warn('Service workers are not supported');
    dispatch(PushNotificationActions.setSupported(false));
  }

  function initializeState() {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      console.warn('Notifications aren\'t supported.');
      dispatch(PushNotificationActions.setSupported(false));
      return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      console.warn('The user has blocked notifications.');
      dispatch(PushNotificationActions.setDenied(true));
      return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      console.warn('Push messaging isn\'t supported.');
      dispatch(PushNotificationActions.setSupported(false));
      return;
    }

    // We need the service worker registration to check for a subscription
    navigator
      .serviceWorker
      .ready
      .then((serviceWorkerRegistration) => {
        // Check we have a subscription
        serviceWorkerRegistration
          .pushManager
          .getSubscription()
          .then((subscription) => {
            // Enable any UI which subscribes / unsubscribes from
            // push messages.
            dispatch(PushNotificationActions.setSupported(true));
            dispatch(PushNotificationActions.setDenied(false));

            if (!subscription) {
              // We aren't subscribed to push, so set UI
              // to allow the user to enable push
              dispatch(PushNotificationActions.setSubscription(null));
              return;
            }

            // Keep your server in sync with the latest subscriptionId
            // sendSubscriptionToServer(subscription);

            // Set your UI to show they have subscribed for
            // push messages
            dispatch(PushNotificationActions.setSubscription(subscription));
          })
          .catch((error) => {
            console.warn('Error during getSubscription()', error);
          });
      });
  }
}

// function sendSubscriptionToServer() {
// }
