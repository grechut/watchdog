var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../webpack.config');

var app = new (require('express'))();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get(["/", "/device/:deviceUuid"], function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var redis = require("redis"),
    redisClient = redis.createClient({
        prefix: 'watchdog:'
    });

app.get("/api/device/:deviceUuid", function(req, res) {
    redisClient.get(req.params.deviceUuid, function(err, reply) {
        res.send(JSON.parse(reply));
    });
});

app.post('/api/device/create', function(req, res) {
    var deviceUuid = req.body.deviceUuid,
        device = {
            owner: deviceUuid,
            listeners: []
        };

    redisClient.set(deviceUuid, JSON.stringify(device));
    res.send(200);
});

app.post('/api/device/listen', function(req, res) {
    var deviceUuid = req.body.deviceUuid,
        listenerUuid = req.body.listenerUuid;

    redisClient.get(deviceUuid, function(err, reply) {
        var device = JSON.parse(reply);
        device.listeners.push(listenerUuid);
        redisClient.set(deviceUuid, JSON.stringify(device));
        res.sendStatus(200);
    });
});

app.post('/api/notify', function(req, res) {
    var deviceUuid = req.body.deviceUuid,
        message = req.body.message;

    // TODO send notification via push API
    console.log('Notificaiton: ', message);

    res.sendStatus(200);
});

app.listen(port, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
    }
});