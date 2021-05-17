// No additional config is required for electron renderer process
// So just re-exporting the commons
// This file is bootstrapped from electron-webpack.json

const {merge} = require('webpack-merge');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const webpack = require('webpack');

const commons = require('./webpack.commons');
module.exports = merge(commons, {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: path.resolve(__dirname, 'electron/renderer/index.js'),
  },
  node: {
    __dirname: false,
  },
  externals: {
    'agora-electron-sdk': 'commonjs2 agora-electron-sdk',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '.electron'),
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(), // to enable HMR for webpack-dev-server
  ].filter(Boolean),
  devServer: {
    port: 9002,
    hot: true,
  },
});
