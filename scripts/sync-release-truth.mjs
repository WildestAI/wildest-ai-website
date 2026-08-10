#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'src/data/release-truth.json';
const publicPath = 'public/release-truth.json';
const source = await readFile(sourcePath, 'utf8');
JSON.parse(source);

if (process.argv.includes('--check')) {
  const published = await readFile(publicPath, 'utf8');
  assert.equal(published, source, `${publicPath} is stale; run node scripts/sync-release-truth.mjs`);
  console.log('Public release-truth manifest matches its typed landing-page source.');
} else {
  await writeFile(publicPath, source);
  console.log(`Synchronized ${publicPath} from ${sourcePath}.`);
}
