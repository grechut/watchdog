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
        FIREBASE_AUTH_DOMAIN: `"${process.env.FIREBASE_AUTH_DOMAIN}"`,
        FIREBASE_DATABASE_URL: `"${process.env.FIREBASE_DATABASE_URL}"`,
        FIREBASE_API_KEY: `"${process.env.FIREBASE_API_KEY}"`,
      },
    }),
  ],
};

const initializeEnv = {
  development: () => {
    config.devtool = 'cheap-eval-source-map';

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
