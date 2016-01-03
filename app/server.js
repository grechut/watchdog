const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');

const app = new (require('express'))();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get(['/', '/devices/:deviceUuid'], function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// temporary solution
app.get(['/sw.js'], function (req, res) {
  res.sendFile(__dirname + '/sw.js');
});

app.get(['/manifest.json'], function (req, res) {
  res.sendFile(__dirname + '/manifest.json');
});

const redis = require('redis');
const redisClient = redis.createClient({
  prefix: 'watchdog:',
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
  // const deviceUuid = req.body.deviceUuid;
  const message = req.body.message;

  // TODO send notification via push API
  console.log('Notificaiton: ', message);

  res.sendStatus(200);
});

app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
