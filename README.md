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

module.exports = codemodBlueprint({
  // optional
  // see: https://ember-cli.com/api/classes/blueprint
  upstream: 'ember-source/blueprints/component',
  description: 'My transform',

  // runs after the upstream blueprint is installed
  transformFiles(filesFromUpstream = []) {
    console.log(filesFromUpstream);
  },
});
```
