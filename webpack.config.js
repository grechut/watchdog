/* eslint import/no-extraneous-dependencies: ["error", { devDependencies: true}] */

require('dotenv').config({ silent: true });

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join(`app/${dest}`); }

const config = module.exports = {
  entry: {
    app: [web('index.jsx')],
    vendor: [
      'classnames',
      'firebase',
      'lodash',
      'moment',
      'react',
      'react-dom',
      'react-mdl',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-logger',
      'redux-thunk',
      'resemblejs',
      'rxjs',
      'simple-peer',
      'uuid',
    ],
  },

  output: {
    path: web('../dist'),
    filename: 'js/[name]-[hash].js',
    publicPath: '/',
  },

  resolve: {
    root: web(''),
    extensions: ['', '.jsx', '.js'],
  },

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
    }, {
      test: /manifest.json$/,
      loader: 'file-loader',
      query: {
        name: 'manifest.json',
      },
    }, {
      test: /manifest.json$/,
      loader: 'string-replace-loader',
      query: {
        search: '$process.env.FIREBASE_MESSAGING_SENDER_ID',
        replace: process.env.FIREBASE_MESSAGING_SENDER_ID,
      },
    }],
  },

  plugins: [
    new CleanPlugin(['dist']),

    new HtmlWebpackPlugin({
      template: web('index.html'),
      cache: true,
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
        FIREBASE_AUTH_DOMAIN: `'${process.env.FIREBASE_AUTH_DOMAIN}'`,
        FIREBASE_DATABASE_URL: `'${process.env.FIREBASE_DATABASE_URL}'`,
        FIREBASE_API_KEY: `'${process.env.FIREBASE_API_KEY}'`,
        FIREBASE_MESSAGING_SENDER_ID: `'${process.env.FIREBASE_MESSAGING_SENDER_ID}'`,
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),

  ],
};

const initializeEnv = {
  development: () => {
    config.devtool = 'inline-source-map';

    // Inline CSS in HTML
    config.module.loaders.push({
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    });
    config.entry.app.push('webpack-hot-middleware/client');
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  },

  production: () => {
    // Extract CSS to separate file
    config.module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    });

    config.plugins.push(
      new ExtractTextPlugin('css/[name]-[hash].css'),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ minimize: true })
    );
  },
};

initializeEnv[env](config);
