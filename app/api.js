const _ = require('lodash');
const webPush = require('web-push');
const fetch = require('node-fetch');
const uuid = require('uuid');
const Firebase = require('firebase');

const firebaseRef = new Firebase(process.env.FIREBASE_URL);

webPush.setGCMAPIKey(process.env.GCM_API_KEY);


module.exports = (app) => {

  app.post('/api/devices/create', (req, res) => {
    const peerId = req.body.peerId,
      authUid = req.body.authUid,
      name = req.body.name;

    const deviceRef = firebaseRef.child('/devices').push();
    const deviceId = deviceRef.key();
    deviceRef.set({
      uid: deviceId,
      name: name,
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

  app.post('/api/devices/:deviceId/notify', (req, res) => {
    const deviceId = req.params.deviceId;
    const payload = req.body.payload;
    const secretToken = req.body.secretToken;
    const ownerEndpointUrl = req.body.ownerEndpointUrl;
    const TTL = 60 * 60;
    const endpointsUrl =
      `${process.env.FIREBASE_URL}/devices/${deviceId}/push_notification_endpoints.json`;

    // TODO: simplify by changing data structure stored in Firebase
    verifyOwnership(deviceId, secretToken)
      .then(() => fetch(endpointsUrl))
      .then((response) => response.json())
      // If there are no subscribed devices, json will be null
      .then((json) => (json ? Object.keys(json) : []))
      .then((userIds) => _(userIds).uniq().map((userId) =>
        `${process.env.FIREBASE_URL}/users/${userId}/push_notification_endpoints.json`
      ))
      .then((userUrls) =>
        Promise.all(userUrls.map(fetch))
      )
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((jsons) =>
        // Mapping from Firebase strange data structure to plain array of endpoint urls
        _(jsons)
          .map((endpoint) => _.values(endpoint))
          .flatten()
          .filter((e) => e.url !== ownerEndpointUrl)
          .uniqBy('url')
      )
      .then((subscriptions) => {
        const notifications = subscriptions.map((subscription) => {
          const userPublicKey = subscription.publicKey;
          const userAuth = subscription.authSecret;

          return webPush.sendNotification(subscription.url, {
            TTL,
            userPublicKey,
            userAuth,
            payload: JSON.stringify(payload),
          });
        });

        return Promise.all(notifications);
      })
      .then(
        () => res.sendStatus(204),
        (error) => {
          console.log(`Error when sending notifications: ${error}`);
          return res.status(500).send(error);
        }
      );
  });

  app.post('/api/devices/verify', (req, res) => {
    const deviceId = req.body.deviceId;
    const secretToken = req.body.secretToken;

    verifyOwnership(deviceId, secretToken)
      .then(() => res.sendStatus(200));
  });
}


function verifyOwnership(deviceId, secretToken) {
  const secretTokenEndpoint = `${process.env.FIREBASE_URL}/secretTokens/${deviceId}.json`;
  return fetch(secretTokenEndpoint)
    .then((response) => response.json())
    .then((json) => {
      if (json.token !== secretToken) {
        throw new Error('Invalid device secret token');
      }
      return true;
    });
}
