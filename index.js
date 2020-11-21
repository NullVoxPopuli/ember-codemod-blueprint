'use strict';

const base = require('./lib/base-blueprint');

function codemodBlueprint(config) {
  return {
    ...base,
    ...config,
  };
}

module.exports = {
  name: require('./package').name,
  codemodBlueprint,
};
