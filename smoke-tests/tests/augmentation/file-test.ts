'use strict';

import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';

import { setupApp } from '../helpers';
import { ResolvedType } from '../type-helpers';

const BLUEPRINT_NAME = 'codemod-blueprint';

describe('file augmentation', () => {
  let projectEnv!: ResolvedType<ReturnType<typeof setupApp>>;

  beforeEach(async function () {
    projectEnv = await setupApp('file-augmentation-test');
  });

  it('can create a blueprint', async () => {
    await projectEnv.ember('generate', BLUEPRINT_NAME, 'component');

    let expectedPath = `${projectEnv.appDir}/blueprints/component/index.js`;

    assert.pathExists(expectedPath);
    assert.fileContentMatch(expectedPath, /ember-codemod-blueprint/);
    assert.fileContentMatch(expectedPath, /codemodBlueprint\(\{/);
    assert.fileContentMatch(expectedPath, /transform\(options, helpers\)/);
  });

  describe('can extend the upstream component blueprint', () => {
    beforeEach(async function () {
      await projectEnv.ember('generate', BLUEPRINT_NAME, 'component');

      let blueprintPath = `${projectEnv.appDir}/blueprints/component/index.js`;

      // TODO: make a TS augmentation
    });

    it('augments the upstream component blueprint', async () => {
      await projectEnv.ember('generate', 'component', 'my-component');
    });
  });
});
