'use strict';

// It's possible that all test files are concatted....
// @ts-ignore
const { describe, it, beforeEach } = require('mocha');

const path = require('path');
const execa = require('execa');
const { assert } = require('chai');

const { log, createTempApp, gitRoot, linkThisPackage, generateCodemodBlueprint } = require('../helpers');

describe('file augmentation', () => {
  let rootDir!: string;
  let appDir!: string;

  beforeEach(async function() {
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
