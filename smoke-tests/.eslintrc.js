'use strict';

const { configs, plugins, rules } = require('../config/lint');

const ts = {
  plugins: plugins.ts,
  extends: configs.ts,
  rules: {
    ...rules.base,
    ...rules.ts,
  },
};

module.exports = {
  root: true,
  rules: {},
  overrides: [
    // Tests
    {
      ...ts,
      files: ['tests/*.ts', 'tests/**/*.ts'],
      env: {
        browser: false,
        node: true,
        es6: true,
      },
      plugins: [...ts.plugins, 'node'],
      extends: [...ts.extends, 'plugin:node/recommended'],
      rules: {
        ...ts.rules,

        // This is node code. Of course we use require
        '@typescript-eslint/no-var-requires': 'off',

        // This appears buggy.
        // "execa" is not published... ha
        'node/no-unpublished-require': 'off',
      },
    },
    // Configs
    {
      files: ['.eslintrc.js'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node', 'prettier'],
      extends: ['plugin:node/recommended'],
      rules: {
        ...rules.base,

        // This appears buggy.
        // "ember-cli" is not published... ha
        'node/no-unpublished-require': 'off',
      },
    },
  ],
};
