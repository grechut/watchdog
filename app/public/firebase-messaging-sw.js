/* eslint-env serviceworker */
/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

// TODO use FIREBASE_MESSAGING_SENDER_ID constant here and replace it during build process
firebase.initializeApp({
  messagingSenderId: '382623650950',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
