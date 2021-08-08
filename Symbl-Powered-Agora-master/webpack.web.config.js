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
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
      verbose: true,
      rewrites: [
        {
          from: '/wps',
          to: context => context.parsedUrl.pathname,
        },
        {
          from: /\.(?!html)/,
          to: context => context.parsedUrl.pathname,
        },
      ],

    },
     // Support for react-router
    contentBase: './',
    disableHostCheck: true //for ngrok
  },
});
