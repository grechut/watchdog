const _ = require('lodash');
const FCM = require('fcm-node');
const fetch = require('node-fetch');
const firebase = require('firebase');
const routes = require('express').Router();
const uuid = require('uuid');

// Firebase stuff
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const firebaseRef = firebase.database().ref();
const fcm = new FCM(process.env.FIREBASE_SERVER_KEY);

// Routes
routes.post('/api/devices/create', (req, res) => {
  const peerId = req.body.peerId;
  const authUid = req.body.authUid;
  const name = req.body.name;

  const deviceRef = firebaseRef.child('/devices').push();
  const deviceId = deviceRef.key;
  deviceRef.set({
    uid: deviceId,
    name,
    online: true,
    peerId,
  });

  const userDeviceRef = firebaseRef.child(`/users/${authUid}/devices/${deviceId}`);
  userDeviceRef.set({ uid: deviceId });

  const secretToken = uuid();
  const secretTokensRef = firebaseRef.child(`/secretTokens/${deviceId}`);
  secretTokensRef.set({ token: secretToken });

  res.send({
    deviceId,
    secretToken,
  });
});

routes.post('/api/devices/verify', (req, res) => {
  const deviceId = req.body.deviceId;
  const secretToken = req.body.secretToken;

  verifyOwnership(deviceId, secretToken)
  .then(() => res.sendStatus(200));
});

// Create a notification and send it to all listeners
routes.post('/api/devices/:deviceId/notify', (req, res) => {
  const deviceId = req.params.deviceId;
  const payload = req.body.payload;
  const secretToken = req.body.secretToken;
  const ownerPushToken = req.body.pushToken;

  const endpointsUrl =
    `${process.env.FIREBASE_DATABASE_URL}/devices/${deviceId}/push_notification_endpoints.json`;

  // TODO: simplify by changing data structure stored in Firebase
  verifyOwnership(deviceId, secretToken)
    .then(() => fetch(endpointsUrl))
    .then(response => response.json())
    // If there are no subscribed devices, json will be null
    .then(json => (json ? Object.keys(json) : []))
    .then(userIds => _(userIds).uniq().map(userId =>
      `${process.env.FIREBASE_DATABASE_URL}/users/${userId}/push_notification_endpoints.json`
    ))
    .then(userUrls =>
      Promise.all(userUrls.map(fetch))
    )
    .then(responses =>
      Promise.all(responses.map(response => response.json()))
    )
    .then(jsons =>
      _(jsons)
        .map(_.values)
        .flatten()
        .without(ownerPushToken)
        .uniq()
        .value()
    )
    .then((pushTokens) => {
      const notifications = pushTokens.map(pushToken =>
        new Promise((resolve, reject) => {
          fcm.send({
            to: pushToken,
            data: payload,
            notification: {
              title: 'Watchdog alert!',
              body: payload.message,
              icon: '/images/stolen-temporary-logo.jpg',
              click_action: payload.url,
            },
            priority: 'high',
            collapse_key: `/cameras/${deviceId}`,
          }, (error, response) => {
            if (error) { return reject(error); }
            return resolve(response);
          });
        })
      );

      console.log('Sending notifications to:', pushTokens);

      return Promise.all(notifications);
    })
    .then((responses) => {
      console.log(`Sent notifications: ${JSON.stringify(responses, null, 2)}`);
      res.status(200).send(responses);
    })
    .catch((error) => {
      console.log(`Error when sending notifications: ${JSON.stringify(error, null, 2)}`);
      return res.status(500).send(error);
    });
});

function verifyOwnership(deviceId, secretToken) {
  const secretTokenEndpoint = `${process.env.FIREBASE_DATABASE_URL}/secretTokens/${deviceId}.json`;
  return fetch(secretTokenEndpoint)
    .then(response => response.json())
    .then((json) => {
      if (json.token !== secretToken) {
        throw new Error('Invalid device secret token');
      }
      return true;
    });
}

module.exports = routes;
