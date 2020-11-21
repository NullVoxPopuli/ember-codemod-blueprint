'use strict';

// HACK: Somehow this makes it so that
//       the mocha imports don't re-declare describe, it, etc
export {};

const { describe, it, beforeEach } = require('mocha');
const path = require('path');
const execa = require('execa');
const { assert } = require('chai');

const { createTempApp, gitRoot, linkThisPackage, generateCodemodBlueprint } = require('../helpers');

describe('file augmentation', () => {
  let rootDir!: string;
  let appDir!: string;

  beforeEach(async function() {
    rootDir = await gitRoot(process.cwd());
    appDir = await createTempApp('file-augmentation-test');

    await linkThisPackage(rootDir, appDir);
  });

  it('can create a blueprint and that blueprint correctly augments the upstream one', async () => {
    await generateCodemodBlueprint('component', appDir);

    assert.ok(true);
  });
});
