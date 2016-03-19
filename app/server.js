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

if (process.env.NODE_ENV === 'production') {
  // TODO temporary and ugly solution
  app.get(['/static/bundle.js'], (req, res) => {
    res.sendFile(`${__dirname}/static/bundle.js`);
  });
} else {
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
}

// API
app.post('/api/devices/create', (req, res) => {
  const peerId = req.body.peerId;
  const authUid = req.body.authUid;

  const deviceRef = firebaseRef.child('/devices').push();
  const deviceId = deviceRef.key();
  deviceRef.set({
    uid: deviceId,
    name: 'Living room',
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
  const ttl = 60 * 60;
  const endpointsUrl =
    `${process.env.FIREBASE_URL}/devices/${deviceId}/push_notification_endpoints.json`;

  console.log('Sending push notification: ');
  console.log('\tdevice id:\t', deviceId);
  console.log('\tpayload:\t', payload);
  console.log('\tttl:\t\t', ttl);

  // TODO: simplify by changing data structure stored in Firebase
  verifyOwnership(deviceId, secretToken)
    .then(() => fetch(endpointsUrl))
    .then((response) => response.json())
    .then((json) => Object.keys(json))
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
        .uniqBy('url')
    )
    .then((endpoints) => {
      const notifications = endpoints.map((endpoint) => {
        if (endpoint.key) {
          console.log(
            `Sending push notification with payload to
            url: ${endpoint.url}
            key: ${endpoint.key}
            payload: ${payload}`
          );
          return webPush.sendNotification(endpoint.url, ttl, endpoint.key, JSON.stringify(payload));
        }

        console.log(
          `Sending push notification without payload to
          url: ${endpoint.url}`
        );
        return webPush.sendNotification(endpoint.url, ttl);
      });

      return Promise.all(notifications);
    })
    .then(
      () => res.sendStatus(204),
      (err) => {
        console.log(`Error when sending notifications: ${err}`);
        return res.sendStatus(500);
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
// LOGIC
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
