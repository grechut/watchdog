require('dotenv').load();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));


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

require('./api')(app);

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
