require('dotenv').load();

const env = process.env.NODE_ENV || 'dev';

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

const initializeEnv = {
  dev: () => {
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
  },

  production: () => {
    app.get(['/static/bundle.js'], (req, res) => {
      res.sendFile(`${__dirname}/static/bundle.js`);
    });
  },
};

initializeEnv[env](app);

require('./api')(app);

// HTML
app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Running on http://localhost:${port}/`);
  }
});
