#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourcePath = 'src/data/daily-driver-review-task.json';
const publicPath = 'public/examples/daily-driver-review-task.json';
const source = await readFile(sourcePath, 'utf8');
const published = await readFile(publicPath, 'utf8');
assert.equal(published, source, `${publicPath} is stale; copy the canonical protocol from ${sourcePath}`);

const protocol = JSON.parse(source);
assert.equal(protocol.schemaVersion, 1, 'unsupported reviewer-task protocol schema');
assert.match(protocol.protocolVersion, /^\d{4}-\d{2}-\d{2}\.\d+$/, 'protocolVersion must be date-versioned');
assert.equal(protocol.status, 'protocol-not-run', 'published protocol must not claim an unmeasured reviewer outcome');
assert.match(protocol.purpose, /not a measurement result/i, 'protocol must distinguish instructions from results');
assert.equal(protocol.setup.network, 'not required', 'protocol must retain a static/no-network fallback');
assert.deepEqual(protocol.task.requiredAnswers, [
  'what changed',
  'why it matters',
  'risk and evidence',
  'relevant tests or checks',
  'next review action',
], 'protocol must preserve every reviewer-task prompt');
for (const answer of protocol.task.requiredAnswers) {
  assert.match(protocol.task.prompt, new RegExp(answer, 'i'), `reviewer prompt must ask: ${answer}`);
}
assert.match(protocol.recording.completionTime, /after the task is run/i, 'protocol must defer completion timing until measured');
assert.match(protocol.recording.qualitativeFailurePoints, /after the task is run/i, 'protocol must defer failure points until measured');
assert.match(protocol.recording.outcome, /after the task is run/i, 'protocol must defer outcome until measured');
assert.equal(protocol.limitations.length, 2, 'protocol limitations must remain explicit');
assert.match(protocol.limitations[0], /no reviewer has completed/i, 'protocol must retain its unmeasured-study limitation');

console.log(`Validated reviewer-task protocol ${protocol.protocolVersion} (${protocol.status}).`);
