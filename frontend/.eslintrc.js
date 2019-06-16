module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      indent: ['error', 4],
      'comma-dangle': ['error', 'never']
  },

  parserOptions: {
    parser: 'babel-eslint',
  }
};
