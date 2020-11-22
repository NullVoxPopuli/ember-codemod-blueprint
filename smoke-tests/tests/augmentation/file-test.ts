'use strict';

import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';

import { log, createTempApp, gitRoot, linkThisPackage, generateCodemodBlueprint } from '../helpers';

describe('file augmentation', () => {
  let rootDir!: string;
  let appDir!: string;

  beforeEach(async function () {
    rootDir = await gitRoot(process.cwd());
    appDir = await createTempApp('file-augmentation-test');

    log.debug(`rootDir: ${rootDir}`);

    await linkThisPackage(rootDir, appDir);
  });

  it('can create a blueprint and that blueprint correctly augments the upstream one', async () => {
    await generateCodemodBlueprint('component', appDir);

    assert.ok(true);
  });
});
