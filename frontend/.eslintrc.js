module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 4],
    'comma-dangle': ['error', 'never'],
    'import/no-unresolved': 'off',
    'import/extensions': ['error', { vue: 'never' }]
  },
  parserOptions: {
    parser: 'babel-eslint',
    plugins: 'vue'
  },
  /*
  settings: {
    'import/resolver': {
        'babel-module': {}
    }
  }
  */
};
