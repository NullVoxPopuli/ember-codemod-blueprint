// @ts-check
'use strict';

const path = require('path');
const fs = require('fs').promises;
const execa = require('execa');
const recast = require('ember-template-recast');
const jscodeshift = require('jscodeshift');

const Blueprint = require('ember-cli/lib/models/blueprint');
const mergeBlueprintOptions = require('ember-cli/lib/utilities/merge-blueprint-options');

/**
 * TODO: add an API to ember-cli to allow
 *       accessing what files are generated in afterInstall
 */
module.exports = {
  description: 'Codemod Base Blueprint',

  /**
   * Be sure to `this._super.call(this)` if overriding
   */
  async beforeInstall(options) {
    await this._installUpstreamBlueprint(options);
  },

  /**
   * Be sure to `this._super.call(this)` if overriding
   */
  async afterInstall(options) {
    if (!this.transform) {
      throw new Error('codemod-blueprint must define a `transform` hook');
    }

    return await this.transform.call(this, options, {
      /**
       * @param {String} filePath
       *
       * TODO: get ember-template-recast to export their types
       * @param {(env: TransformPluginEnv) => import('@glimmer/syntax').NodeVisitor} plugin
       */
      async transformTemplate(filePath, plugin) {
        let code = (await fs.readFile(filePath)).toString();

        let transformed = recast.transform({ code, plugin });

        await fs.writeFile(filePath, transformed);
      },

      /**
       * @param {String} filePath
       * @param {({ root: ReturnType<typeof j>, j: typeof j })} callback;
       * @returns void;
       */
      async transformScript(filePath, callback) {
        let code = (await fs.readFile(filePath)).toString();

        let j;

        if (path.extname(filePath).endsWith('ts')) {
          j = jscodeshift.withParser('ts');
        } else {
          j = jscodeshift.withParser('babel');
        }

        let root = j(code);

        let transformed = await callback({ root, j });

        if (typeof transformed !== 'string') {
          transformed = transformed.toSource();
        }

        await fs.writeFile(filePath, transformed);
      },
    });
  },

  beforeInstall(options) {
    let [, ...args] = options.args;
    let blueprint = this._upstreamBlueprintPath();

    mergeBlueprintOptions.call(this, [blueprint, ...args]);
  },

  async beforeUninstall(options) {
    await this._uninstallUpstreamBlueprint(options);
  },

  /**
   * @private - do not use outside of ember-codemod-blueprint
   */
  async _installUpstreamBlueprint(options) {
    let taskOptions = this._upstreamTaskOptions(options);

    // await this.taskFor('install-blueprint').run(taskOptions);
    await this.taskFor('generate-from-blueprint').run(taskOptions);
  },

  /**
   * @private - do not use outside of ember-codemod-blueprint
   */
  async _uninstallUpstreamBlueprint(options) {
    let taskOptions = this._upstreamTaskOptions(options);

    await this.taskFor('destroy-from-blueprint').run(taskOptions);
  },

  /**
   * @private - do not use outside of ember-codemod-blueprint
   */
  _upstreamTaskOptions(options) {
    let [, ...args] = options.args;
    let blueprint = this._upstreamBlueprintPath();

    let taskOptions = {
      // TODO: load blueprint options
      ...options.taskOptions,
      blueprint,
      args: [blueprint, ...args],
      originBlueprintName: blueprint,
    };

    return taskOptions;
  },

  _upstreamBlueprintPath() {
    // If this exists, it'll have the `index.js` at the end
    let blueprintIndex = require.resolve(this.upstream, { paths: [process.cwd()] });
    let blueprint = blueprintIndex.replace(/\/index\.js$/, '');

    return blueprint;
  },
};
