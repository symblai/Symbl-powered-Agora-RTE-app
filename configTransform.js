let jsonFile = require('./config.json');
let PREFIX = '$config';
let config = {};
Object.keys(jsonFile).map((key) => {
  config[`${PREFIX}.${key}`] = jsonFile[key];
});
module.exports = config;
