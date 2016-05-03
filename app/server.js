require('dotenv').load();

const _ = require('lodash');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const webPush = require('web-push');
const fetch = require('node-fetch');
const uuid = require('uuid');
const Firebase = require('firebase');

const firebaseRef = new Firebase(process.env.FIREBASE_URL);

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

// TODO temporary and ugly solution
if (process.env.NODE_ENV === 'dev') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  // TODO temporary and ugly solution
  app.get(['/static/bundle.js'], (req, res) => {
    res.sendFile(`${__dirname}/static/bundle.js`);
  });
}

// API
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

  console.log('Sending push notification: ');
  console.log('\tdevice id:\t', deviceId);
  console.log('\tpayload:\t', payload);
  console.log('\TTL:\t\t', TTL);

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

        console.log(
          `Sending push notification with payload to
          url: ${subscription.url}
          publicKey: ${userPublicKey}
          auth: ${userAuth}
          payload: ${JSON.stringify(payload)}`
        );

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

// HTML
app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

// TODO where to put it ?
// Helper functions
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
