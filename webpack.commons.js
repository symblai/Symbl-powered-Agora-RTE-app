/**
 * Common Webpack configuration to be used across web and electron's renderer process
 */

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const configVars = require('./configTransform');

const isElectron = ['linux', 'windows', 'mac'].includes(process.env.TARGET);

module.exports = {
  // Adds React Refresh webpack plugin for webpack dev server hmr
  plugins: [
    // Using html webpack plugin to utilize our index.html
    new HtmlWebpackPlugin({
      title: configVars['$config.displayName'],
      template: isElectron ? 'electron/index.html' : 'web/index.html',
    }),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Using react-native web to translate UI
      'react-native$': 'react-native-web',
      // Using rtm bridge to translate React Native RTM SDK calls to web SDK calls
      'agora-react-native-rtm': path.join(__dirname, 'bridge/rtm/web/index.ts'),
      // Using rtc bridge to translate React Native RTC SDK calls to web SDK calls for web and linux
      // Using rtc bridge to translate React Native RTC SDK calls to electron SDK calls for windows and mac
      'react-native-agora':
        process.env.TARGET === 'linux' || process.env.TARGET === 'web'
          ? path.join(__dirname, 'bridge/rtc/web/index.ts')
          : path.join(__dirname, 'bridge/rtc/electron/index.ts'),
    },
    // Adds platform specific extensions and OS specific extensions
    // .web.tsx works for web specific code
    // .electron.tsx works for electron specific code
    // .linux.tsx works for OS(linux) specific electron code
    extensions: [
      `.${process.env.TARGET}.tsx`,
      `.${process.env.TARGET}.ts`,
      isElectron && '.electron.tsx',
      isElectron && '.electron.ts',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.node',
    ].filter(Boolean),
  },
  // Enable source maps during development
  devtool: isDevelopment ? 'eval-source-map' : undefined,
  module: {
    rules: [
      {
        // Use babel to transpile all js, ts, jsx and tsx files
        test: /\.[jt]sx?$/,
        exclude: /node_modules/, // don't transpile the files under node_modules
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // enables caching in babel
            configFile: false,
            presets: [
              '@babel/preset-react', // transforms tsx into normal ts
              [
                '@babel/preset-typescript', // transforms ts into js
                {
                  allExtensions: true,
                  isTSX: true,
                },
              ],
              [
                '@babel/preset-env', // smartly transforms js into es5-es6
                isElectron && {
                  targets: {
                    node: 'current',
                  },
                },
              ].filter(Boolean),
            ],
            plugins: [
              // Adds support for class properties
              ['transform-define', configVars],
              '@babel/plugin-proposal-class-properties',
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
};
