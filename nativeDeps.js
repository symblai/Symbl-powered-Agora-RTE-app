const os = require('os');

module.exports.default = [
  os.platform() !== 'linux' ? 'agora-electron-sdk' : false,
].filter(Boolean);
