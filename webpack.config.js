const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = process.env.NODE_ENV;

const webpackConfig = {
  mode: env,
  entry: {
    app: './src/index',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        include: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './node_modules/latlon-geohash'),
          path.resolve(__dirname, './node_modules/lodash/last'),
        ],
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization : {
    minimizer: [new UglifyJsPlugin()],
  },
};

module.exports = webpackConfig;
