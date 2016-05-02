const path = require('path');
const webpack = require('webpack');
const shrinkwrapCheck = require('./shrinkwrap-check');

shrinkwrapCheck();

function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join(`app/${dest}`); }

const config = module.exports = {
  // our app's entry points
  entry: [
    'webpack-hot-middleware/client',
    web('index'),
  ],

  // where webpack should output our files
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        FIREBASE_URL: `"${process.env.FIREBASE_URL}"`,
      },
    }),
    // new webpack.NoErrorsPlugin(),
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

if (process.env.NODE_ENV === 'dev') {
  config.devtool = 'cheap-eval-source-map';
}

// Minify files with uglifyjs in production
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}
