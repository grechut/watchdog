/* eslint-env serviceworker */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service worker: installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('Service worker: activated', event);
});

self.addEventListener('push', (event) => {
  console.log('Service worker: push notification received', event);

  const title = 'Watchdog alert';
  const defaultBody = 'Watchdog has detected something on one of your cameras';
  const payload = event.data && event.data.json() || {};
  const body = payload.message || defaultBody;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/images/stolen-temporary-logo.jpg',
      data: { url: payload.url },
    }));
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service worker: push notification clicked', event);
  const notification = event.notification;
  const payload = notification.data || {};
  const url = payload.url;

  notification.close();

  if (url) {
    event.waitUntil(
      clients.matchAll({
        type: 'window',
      })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];

          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }

        return undefined;
      })
    );
  }
});
