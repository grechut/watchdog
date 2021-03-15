const dotenvConf = require('dotenv').load();

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const history = require('connect-history-api-fallback');
const morgan = require('morgan');
const path = require('path');
const requireHTTPS = require('./middlewares/requireHTTPS');
const routes = require('./routes');

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

app.use(requireHTTPS);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'client', 'public')));

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
app.use('/', routes);

// HTML/JS/CSS
initializeEnv[env]();

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Running in ${env} env on http://localhost:${port}/`);
    console.info('Using the following configuration:');
    console.info({ dotenvConf });
  }
});