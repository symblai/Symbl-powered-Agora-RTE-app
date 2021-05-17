// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const webpack = require('webpack');
module.exports = {
  // Main entry point for the web application
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: path.resolve(__dirname, 'electron/main/index.js'),
  },
  node: {
    __dirname: false,
  },
  target: 'electron-main',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '.electron'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.TARGET': JSON.stringify(process.env.TARGET),
    }),
  ],
};
