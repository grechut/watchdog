/* eslint import/no-extraneous-dependencies: ["error", { devDependencies: true}] */

require('dotenv').config({ silent: true });

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

function web(dest = '') { return path.resolve(__dirname, `client/${dest}`); }

const config = {
  entry: {
    app: [web('index.jsx')],
  },

  output: {
    path: web('../dist'),
    filename: 'js/[name]-[hash].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      enforce: 'pre',
      use: {
        loader: 'eslint-loader',
      },
      exclude: /node_modules/,
    }, {
      test: /.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      exclude: /node_modules/,
    }, {
      test: /manifest.json$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'manifest.json',
        },
      },
    }, {
      test: /manifest.json$/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: '$process.env.FIREBASE_MESSAGING_SENDER_ID',
          replace: process.env.FIREBASE_MESSAGING_SENDER_ID,
        },
      },
    }],
  },

  plugins: [
    new CleanPlugin(['dist']),

    new HtmlWebpackPlugin({
      template: web('index.html'),
      cache: true,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
        FIREBASE_AUTH_DOMAIN: `'${process.env.FIREBASE_AUTH_DOMAIN}'`,
        FIREBASE_DATABASE_URL: `'${process.env.FIREBASE_DATABASE_URL}'`,
        FIREBASE_API_KEY: `'${process.env.FIREBASE_API_KEY}'`,
        FIREBASE_MESSAGING_SENDER_ID: `'${process.env.FIREBASE_MESSAGING_SENDER_ID}'`,
      },
    }),

    // Extract libraries used by "app" entry into "vendor" chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks(module) {
        // This assumes all our vendor imports exist in node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),

    // Enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

const initializeEnv = {
  development: () => {
    config.devtool = 'cheap-module-eval-source-map';

    // Inline CSS in HTML
    config.module.rules.push({
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }],
    });

    config.entry.app.push('webpack-hot-middleware/client');

    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    );
  },

  production: () => {
    config.devtool = 'source-map';

    // Extract CSS to separate file
    config.module.rules.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    });

    config.plugins.push(
      new ExtractTextPlugin('css/[name]-[hash].css'),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    );
  },
};

initializeEnv[env](config);

module.exports = config;
