const configVars = require('./configTransform');
// This file is read only by react native for IOS & Android. Doesn't apply to electron, Web targets
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['transform-define', configVars]],
};
