'use strict';

const { configs, plugins, rules } = require('./config/lint');

const ts = {
  plugins: plugins.ts,
  extends: configs.ts,
  rules: {
    ...rules.base,
    ...rules.ts,
  },
};

const js = {
  plugins: plugins.js,
  extends: configs.js,
  rules: {
    ...rules.base,
    ...rules.js,
  },
};

module.exports = {
  root: true,
  rules: {},
  overrides: [
    // app
    {
      files: ['app/**/*.ts', 'types/**'],
      ...ts,
    },
    // addon
    {
      files: ['addon/**/*.ts', 'addon-test-support/**/*.ts'],
      ...ts,
    },
    // tests
    {
      files: ['tests/**/*.ts'],
      ...ts,
      rules: {
        ...ts.rules,

        // no-op functions are often used for stubbing / testing unrelated to the function things
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
    // app
    {
      files: ['app/**/*.js'],
      ...js,
    },
    // addon
    {
      files: ['addon/**/*.js', 'addon-test-support/**/*.js'],
      ...js,
    },
    // tests
    {
      files: ['tests/**/*.js'],
      ...js,
      rules: {
        ...js.rules,

        // no-op functions are often used for stubbing / testing unrelated to the function things
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: ['addon/**', 'addon-test-support/**', 'app/**', 'tests/dummy/app/**'],
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
    {
      files: ['tests/dummy/config/deprecation-workflow.js'],
      env: {
        browser: true,
        node: false,
      },
    },
  ],
};
