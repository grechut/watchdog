require('dotenv').load();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const webPush = require('web-push');
const redisClient = require('./redisClient')();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(__dirname + '/public'));

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

if (process.env.NODE_ENV === 'production') {
  // TODO temporary and ugly solution
  app.get(['/static/bundle.js'], function (req, res) {
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

app.get(['/', '/devices/:deviceUuid'], function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/device/:deviceUuid', function (req, res) {
  redisClient.get(req.params.deviceUuid, function (err, reply) {
    const result = JSON.parse(reply);

    res.send({
      owner: result.owner,
      listenersCount: result.listenerEndpoints.length,
    });
  });
});

app.post('/api/device/create', function (req, res) {
  const deviceUuid = req.body.deviceUuid;
  const device = {
    owner: deviceUuid,
    listenerEndpoints: [],
  };

  redisClient.set(deviceUuid, JSON.stringify(device));
  res.sendStatus(200);
});

app.post('/api/device/listen', function (req, res) {
  const deviceUuid = req.body.deviceUuid;
  const listenerEndpoint = req.body.listenerEndpoint;

  redisClient.get(deviceUuid, function (err, reply) {
    const device = JSON.parse(reply);

    if (device.listenerEndpoints.indexOf(listenerEndpoint) === -1) {
      device.listenerEndpoints.push(listenerEndpoint);
    }

    redisClient.set(deviceUuid, JSON.stringify(device));
    res.sendStatus(200);
  });
});

app.post('/api/notify', function (req, res) {
  const deviceUuid = req.body.deviceUuid;
  // const message = req.body.message;

  redisClient.get(deviceUuid, function (err, reply) {
    const device = JSON.parse(reply);
    const notifications = device.listenerEndpoints.map((endpoint) =>
      webPush.sendNotification(endpoint, 60 * 60)
    );
    Promise.all(notifications)
      .then(() => res.sendStatus(200));
  });

  res.sendStatus(200);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
