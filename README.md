# ember-codemod-blueprint

ember blueprints don't have a built in way to augment an existing blueprint.
Traditionally, you'd have to entirely replace the default blueprint and
manually keep them up to date as upstream changes occur.

ember-codemod-blueprint solves this by providing some utility functions
to modify upstream blueprints via codemod rather than entirely replace them.

## Example Codemod-Blueprint

in your addon's bluerpint's index.js,
e.g.: `<addon-root>/blueprints/<blueprint-name>/index.js`

or `ember g codemod-blueprint <blueprint-name>`

```js
const { codemodBlueprint } = require('ember-codemod-blueprint');

/**
 * Recommended:
 *   - create a transforms folder and follow codemod-cli
 *     conventions for tests
 *   - transforms should be idempotent, so that running them
 *     subsequent times causes no changes
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
    console.log({ options, projectRoot, args });

    await transformScript(scriptPath, transformA, transformB, transformC);
    // or inline
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

    await transformTemplate(templatePath, transformD, transformE, transformF);
    // on inline
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


```
