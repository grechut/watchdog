require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

const initializeEnv = {
  dev: () => {
    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.config');
    /* eslint-enable global-require, import/no-extraneous-dependencies */

    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
    }));
    app.use(webpackHotMiddleware(compiler));
  },

  production: () => {
    app.get(['/js/bundle.js'], (req, res) => {
      res.sendFile(`${__dirname}/../dist/js/bundle.js`);
    });
  },
};

initializeEnv[env](app);

require('./api')(app);

// HTML
app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/../dist/index.html`);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Running on http://localhost:${port}/`);
  }
});
