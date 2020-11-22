'use strict';

const { codemodBlueprint } = require('ember-codemod-blueprint');

/**
 * Recommended:
 *   - create a transforms folder and follow codemod-cli
 *     conventions for tests
 */
// const { addJSDoc, addTypeArgs } = require('./transforms');

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
  transform(options, helpers) {
    let { transformTemplate, transformScript } = helpers;
    let { project, args } = options;
    let projectRoot = project.root;

    // TODO: provide:
    //       - generated file paths, if any
    //       - helpers for transforming JS, TS, and HBS
    console.log({ options, projectRoot, args });

    await transformScript(
      // [String] path to JS or TS file
      scriptPath,
      // [AST] root
      // [jscodeshift] j
      ({ root, j }) => {
        return root
          .find(j.Identifier)
          .forEach(path => {
            // do something with path
          });
      }
    );

    await transformTemplate(
      // [String] path to template
      componentPath,
      // [Object]
      //    ember-template-recast's transform's plugin callback
      //    https://github.com/ember-template-lint/ember-template-recast#transform
      //
      // NOTE: this transform is synchronous
      (env) => {
        let { builders: b } = env.syntax;

        return {
          MustacheStatement() {
            return b.mustache(b.path('replaced-statement'));
          }
        }
      }
    );
  },
});
