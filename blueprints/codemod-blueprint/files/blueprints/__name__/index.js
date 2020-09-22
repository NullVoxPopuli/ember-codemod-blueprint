'use strict';

const { codemodBlueprint } = require('ember-codemod-blueprint');

/**
 * codemodBlueprint wraps a normal ember-cli blueprint
 * with additional functionality and helpers
 */
module.exports = codemodBlueprint({
  /**
   * this is optional
   * see: https://ember-cli.com/api/classes/blueprint
   */
  upstream: 'ember-source/blueprints/component',

  /**
   * shown in ember g --help
   */
  description: 'My codemod transform',

  /**
   * runs after the upstream blueprint is installed
   */
  transform(options) {
    let { project, args } = options;
    let projectRoot = project.root;

    // TODO: provide:
    //       - generated file paths, if any
    //       - helpers for transforming JS, TS, and HBS
    console.log({ options, projectRoot, args });
  },
});
