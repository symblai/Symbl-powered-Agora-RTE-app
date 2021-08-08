module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // 'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    quotes: [2, 'single'],
  },
};
