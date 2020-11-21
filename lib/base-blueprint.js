'use strict';

const execa = require('execa');
const Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = {
  description: 'Codemod Base Blueprint',

  async beforeInstall(options) {
    await this._installUpstreamBlueprint(options);
  },

  async afterInstall(options) {
    if (!this.transform) {
      throw new Error('codemod-blueprint must define a `transform` hook');
    }

    return await this.transform.call(this, options);
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
