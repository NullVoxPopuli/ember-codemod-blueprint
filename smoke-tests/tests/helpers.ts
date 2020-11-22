'use strict';

const fs = require('fs').promises;

import path from 'path';
import execa from 'execa';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import pino from 'pino';

export const log = pino({ level: process.env.LOG_LEVEL || 'info' });

const isVerbose = process.env.LOG_LEVEL === 'trace';

export async function generateCodemodBlueprint(name: string, cwd: string) {
  await run('ember', ['generate', 'ember-codemod-blueprint', name], { cwd });
}

export async function createTempApp(name: string) {
  let tempDir = path.join(os.tmpdir(), uuidv4());

  await fs.mkdir(tempDir);

  return await createApp(name, tempDir);
}

export async function createApp(name: string, cwd: string) {
  log.debug(`createApp: ${name} @ ${cwd}`);

  await run('ember', ['new', name, '--skip-git', '--yarn'], { cwd });

  return path.join(cwd, name);
}

/**
 * The git root is the root of the library / addon
 * that these tests are smoke testing
 */
export async function gitRoot(cwd: string) {
  log.debug(`gitRoot: ${cwd}`);

  let { stdout } = await run('git', ['rev-parse', '--show-toplevel'], { cwd });

  return stdout;
}

export async function linkThisPackage(rootDir: string, targetDir: string) {
  log.debug(`linkThisPackage: ${rootDir} <- ${targetDir}`);

  let packageName = require(path.join(rootDir, 'package.json')).name;

  await run('yarn', ['link'], { cwd: rootDir });

  // package has to first be listed in the package.json before linking will work
  await run('yarn', ['add', '--dev', packageName], { cwd: targetDir });
  await run('yarn', ['link', packageName], { cwd: targetDir });
}

export async function run(command: string, args: unknown[], options: Record<string, unknown>) {
  if (isVerbose) {
    log.trace(`${command} ${args.join(' ')}`);

    options = {
      ...options,
      env: { FORCE_COLOR: true },
    };
  }

  let subprocess = execa(command, args, options);

  if (isVerbose) {
    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
  }

  return await subprocess;
}
