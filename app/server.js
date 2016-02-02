require('dotenv').load();

const express = require('express');
const app = express();
const _ = require('lodash');

const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const webPush = require('web-push');
const redis = require('./redisClient')();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

if (process.env.NODE_ENV === 'production') {
  // TODO temporary and ugly solution
  app.get(['/static/bundle.js'], (req, res) => {
    res.sendFile(__dirname + '/static/bundle.js');
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

// HTML
app.get(['/', '/devices/:deviceId'], (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API
app.post('/api/devices', (req, res) => {
  const deviceId = req.body.deviceId;
  const device = {
    owner: deviceId,
    listeners: {
      pushNotificationEndpoints: [],
    },
  };

  redis.set(deviceId, JSON.stringify(device));
  res.send({
    owner: device.owner,
    listeners: device.listeners,
  });
});

app.get('/api/devices/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  redis.get(deviceId, (err, result) => {
    if (err) { return res.sendStatus(404); }
    if (!result) { return res.sendStatus(404); }

    const device = JSON.parse(result);

    res.send({
      owner: device.owner,
      listeners: device.listeners,
    });
  });
});

app.post('/api/devices/:deviceId/subscribe', (req, res) => {
  const deviceId = req.params.deviceId;
  const endpoint = req.body.pushNotificationEndpoint;

  if (!endpoint) { return res.sendStatus(422); }

  redis.get(deviceId, function (err, result) {
    if (err) { return res.sendStatus(404); }
    if (!result) { return res.sendStatus(404); }

    const device = JSON.parse(result);
    const endpoints = device.listeners.pushNotificationEndpoints;

    if (!_.includes(endpoints, endpoint)) {
      endpoints.push(endpoint);
    }

    // Update device info
    redis.set(deviceId, JSON.stringify(device));
    res.send({
      owner: device.owner,
      listeners: device.listeners,
    });
  });
});

app.post('/api/devices/:deviceId/unsubscribe', (req, res) => {
  const deviceId = req.params.deviceId;
  const endpoint = req.body.pushNotificationEndpoint;

  if (!endpoint) { return res.sendStatus(422); }

  redis.get(deviceId, function (err, result) {
    if (err) { return res.sendStatus(404); }
    if (!result) { return res.sendStatus(404); }

    const device = JSON.parse(result);
    const endpoints = device.listeners.pushNotificationEndpoints;

    if (_.includes(endpoints, endpoint)) {
      _.pull(endpoints, endpoint);
    }

    // Update device info
    redis.set(deviceId, JSON.stringify(device));
    res.send({
      owner: device.owner,
      listeners: device.listeners,
    });
  });
});

app.post('/api/devices/:deviceId/notify', function (req, res) {
  const deviceId = req.params.deviceId;
  const key = req.body.key;
  const payload = req.body.payload;
  const ttl = 60 * 60;

  redis.get(deviceId, function (err, result) {
    if (err) { return res.sendStatus(404); }
    if (!result) { return res.sendStatus(404); }

    console.log('Sending push notification: ');
    console.log('\tdevice id:\t', deviceId);
    console.log('\tkey:\t\t', key);
    console.log('\tpayload:\t', payload);

    const device = JSON.parse(result);
    const endpoints = device.listeners.pushNotificationEndpoints;
    const notifications = endpoints.map((endpoint) =>
      webPush.sendNotification(endpoint, ttl) // key, payload
    );

    Promise.all(notifications)
      .then(() => res.sendStatus(204));
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
