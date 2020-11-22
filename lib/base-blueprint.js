// @ts-check
'use strict';

const path = require('path');
const fs = require('fs').promises;
const execa = require('execa');
const Blueprint = require('ember-cli/lib/models/blueprint');
const recast = require('ember-template-recast');
const jscodeshift = require('jscodeshift');

module.exports = {
  description: 'Codemod Base Blueprint',

  async beforeInstall(options) {
    await this._installUpstreamBlueprint(options);
  },

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

  async _installUpstreamBlueprint(options) {
    let [, ...args] = options.args;

    // https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/install-blueprint.js
    let blueprint = 'component';

    let taskOptions = {
      ...options,
      blueprint,
      rawName: options.entity.name,
      args: [blueprint, ...args],
      taskOptions: {
        ...options.taskOptions,
        args: [blueprint, ...args],
      },
      rawArgs: [blueprint, ...args],
    };

    await this.taskFor('install-blueprint').run(taskOptions);
  },
};
