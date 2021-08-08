const {projectName} = require('./config.json');
module.exports = {
  appId: `com.${projectName.toLowerCase()}`,
  productName: projectName,
  directories: {
    output: './out',
    app: './.electron',
  },
  linux: {
    target: ['AppImage'],
  },
  mac: {
    target: ['dmg'],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['ia32'],
      },
    ],
  },
  afterSign: './notarize.js',
};
