const commons = require('./webpack.commons');
const {merge} = require('webpack-merge');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = merge(commons, {
  // Enable optimizations in production
  mode: isDevelopment ? 'development' : 'production',
  // Main entry point for the web application
  entry: {
    main: './index.web.js',
  },
  // Webpack dev server config
  devServer: {
    port: process.env.PORT || 3000,
    historyApiFallback: true, // Support for react-router
    contentBase: './',
    disableHostCheck: true //for ngrok
  },
});
