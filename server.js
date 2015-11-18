var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var devices = {
    'id1': { id: 'id1', mac: 'AA-BB-AA' },
    'id2': { id: 'id2', mac: 'AA-BB-CC' },
    'id3': { id: 'id3', mac: 'AA-BB-DD' }
};

app.get("/api/device/:deviceUuid", function(req, res) {
  return res.send(devices[req.params.deviceUuid]);
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
