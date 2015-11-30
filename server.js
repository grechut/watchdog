var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get(["/", "/device/:deviceUuid"], function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});


var devices = {};

app.get("/api/device/:deviceUuid", function(req, res) {
  return res.send(devices[req.params.deviceUuid]);
});

app.post('/api/device/create', function (req, res) {
  if (!devices[req.body.uuid]) {
    devices[req.body.uuid] = {
      owner: req.body.uuid, listeners: []
    };
  }
  res.send('OK');
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
