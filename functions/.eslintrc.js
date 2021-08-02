module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google', 'plugin:react/recommended'],
  rules: {
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'max-len': ['error', { code: 180 }],
    'object-curly-spacing': [
      1,
      'always',
      {
        objectsInObjects: false,
        arraysInObjects: false,
      },
    ],
    'require-jsdoc': 0,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
