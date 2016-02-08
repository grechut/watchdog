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

  const title = 'Watchdog Alert';
  const defaultBody = 'Watchdog has detected something on one of your cameras';
  const body = event.data ? event.data.text() : defaultBody;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: 'icon.png',
    }));
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service worker: push notification clicked', event);
  const url = 'https://youtu.be/gYMkEMCHtJ4';

  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
    })
    .then((windowClients) => {
      for (var i = 0; i < windowClients.length; i++) {
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
