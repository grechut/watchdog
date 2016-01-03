const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
  ],
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    }],
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: __dirname,
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
};
