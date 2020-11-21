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
    {
      ...ts,
      files: [
        'smoke-tests/**/*.ts',
      ],
      env: {
        browser: false,
        node: true,
      },
      plugins: [...ts.plugins, 'node'],
      extends: [...ts.extends, 'plugin:node/recommended'],
      rules: {
        ...ts.rules,

      }
    },

  ]
}
