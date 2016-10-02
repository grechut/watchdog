/* eslint import/no-extraneous-dependencies: "off" */

require('dotenv').load();

const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'dev';

function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join(`app/${dest}`); }

const config = module.exports = {
  entry: [
    web('index'),
  ],

  output: {
    path: web('static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  resolve: {
    root: web(''),
    extensions: ['', '.jsx', '.js'],
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        FIREBASE_AUTH_DOMAIN: `"${process.env.FIREBASE_AUTH_DOMAIN}"`,
        FIREBASE_DATABASE_URL: `"${process.env.FIREBASE_DATABASE_URL}"`,
        FIREBASE_API_KEY: `"${process.env.FIREBASE_API_KEY}"`,
      },
    }),
  ],

  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    }],
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
      },
      exclude: /node_modules/,
      include: __dirname,
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
};

const initializeEnv = {
  dev: () => {
    config.devtool = 'cheap-eval-source-map';
    config.entry.push('webpack-hot-middleware/client');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  },

  production: () => {
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ minimize: true })
    );
  },
};

initializeEnv[env](config);
