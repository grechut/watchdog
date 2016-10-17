require('dotenv').load();

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const history = require('connect-history-api-fallback');
const morgan = require('morgan');
const path = require('path');
const requireHTTPS = require('./requireHTTPS');

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

app.use(requireHTTPS);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));

const initializeEnv = {
  development: () => {
    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.config');
    /* eslint-enable global-require, import/no-extraneous-dependencies */

    const compiler = webpack(config);
    const devMiddleware = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    });
    const hotMiddleware = webpackHotMiddleware(compiler);

    // Handle HTML history API - rewrite urls to /index.html
    app.use(history({ verbose: true }));

    // Serve files generated by webpack from memory
    app.use(devMiddleware);
    app.use(hotMiddleware);

    // Serve index.html from memory
    app.get('/index.html', (req, res) => {
      const index = devMiddleware.fileSystem.readFileSync(
        path.join(config.output.path, 'index.html')
      );
      res.end(index);
    });
  },

  production: () => {
    // Handle HTML history API - rewrite urls to /index.html
    app.use(history());

    // Serve files generated by webpack (including index.html) from filesystem.
    app.use(express.static(path.resolve(__dirname, '../dist')));
  },
};

// API
require('./api')(app);

// HTML/JS/CSS
initializeEnv[env]();

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Running in ${env} env on http://localhost:${port}/`);
    console.log('Using the following Firebase configuration:');
    console.log('FIREBASE_AUTH_DOMAIN:\t\t', process.env.FIREBASE_AUTH_DOMAIN);
    console.log('FIREBASE_DATABASE_URL:\t\t', process.env.FIREBASE_DATABASE_URL);
    console.log('FIREBASE_API_KEY:\t\t', process.env.FIREBASE_API_KEY);
    console.log('FIREBASE_SERVER_KEY:\t\t', process.env.FIREBASE_SERVER_KEY);
    console.log('FIREBASE_MESSAGING_SENDER_ID:\t', process.env.FIREBASE_MESSAGING_SENDER_ID);
  }
});
