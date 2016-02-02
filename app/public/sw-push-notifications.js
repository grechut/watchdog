/* eslint-env serviceworker */

self.addEventListener('install', function (event) {
  self.skipWaiting();
  console.log('SW: installed', event);
});

self.addEventListener('activate', function (event) {
  console.log('SW: activated', event);
});

self.addEventListener('push', function (event) {
  console.log('SW: push notification received', event);

  const title = 'Watchdog Alert';
  const body = event.data ? event.data.body : 'Watchdog has detected something on one of your cameras';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      // icon: 'images/icon.png',
    }));
});

self.addEventListener('notificationclick', function (event) {
  console.log('SW: push notification clicked', event);
  const url = 'https://youtu.be/gYMkEMCHtJ4';

  event.notification.close();

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
    })
  );
});
