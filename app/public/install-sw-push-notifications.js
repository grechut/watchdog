if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');

  navigator.serviceWorker.register('/sw-push-notifications.js')
    .then(() =>
      navigator.serviceWorker.ready
    )
    .then((serviceWorkerRegistration) =>
      console.log('Service Worker is ready', serviceWorkerRegistration)
    )
    .catch((error) =>
      console.log('Service Worker Error', error)
    );
}
