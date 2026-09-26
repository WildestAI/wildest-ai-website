#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const sourcePath = 'src/data/daily-driver-fixture.json';
const publicPath = 'public/examples/daily-driver-fixture.json';
const source = await readFile(sourcePath, 'utf8');
const published = await readFile(publicPath, 'utf8');
assert.equal(published, source, `${publicPath} is stale; copy the canonical fixture manifest from ${sourcePath}`);

const fixture = JSON.parse(source);
assert.equal(fixture.schemaVersion, 1, 'unsupported fixture manifest schema');
assert.match(fixture.fixtureVersion, /^\d{4}-\d{2}-\d{2}\.\d+$/, 'fixtureVersion must be date-versioned');
assert.match(fixture.source.repository, /^https:\/\/github\.com\/WildestAI\//, 'fixture source must be public WildestAI repository');
assert.match(fixture.source.commit, /^[0-9a-f]{40}$/, 'fixture source must pin an exact commit');
assert.equal(fixture.source.commitUrl, `${fixture.source.repository}/commit/${fixture.source.commit}`, 'fixture commit URL must match pinned source');
assert.match(fixture.source.range, /fixture publication commit.*sanitized artifacts.*not asserted/i, 'fixture must identify the publication commit without asserting original source provenance');
assert.match(fixture.source.license, /MIT/i, 'fixture must disclose its source license');
assert.equal(fixture.artifact.schemaVersion, '2.0', 'fixture must pin the supported artifact schema');
assert.equal(fixture.artifact.mode, 'AI-off structural JSON', 'fixture must be explicit about AI-off mode');
assert.equal(fixture.repeat.command, 'node scripts/validate-acceptance-fixture.mjs', 'fixture repeat command must be deterministic');
assert.match(fixture.repeat.expected, /without network access/i, 'fixture validation must be offline');
assert.equal(fixture.limitations.length, 3, 'fixture limitations must remain explicit');

for (const [name, entry] of Object.entries(fixture.artifact.files)) {
  assert.match(entry.path, /^public\/examples\//, `${name} must be a checked-in public example`);
  assert.match(entry.sha256, /^[0-9a-f]{64}$/, `${name} must pin a SHA-256 digest`);
  const bytes = await readFile(entry.path);
  const actual = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actual, entry.sha256, `${name} checksum does not match fixture manifest`);
}

const artifact = JSON.parse(await readFile(fixture.artifact.files.artifact.path, 'utf8'));
const diff = await readFile(fixture.artifact.files.diff.path, 'utf8');
assert.equal(artifact.schema_version, fixture.artifact.schemaVersion, 'artifact schema must match manifest');
assert.equal(artifact.wild_version, fixture.artifact.generator.replace('wild ', ''), 'artifact generator must match manifest');
assert.equal(artifact.metadata.llm_calls, 0, 'AI-off fixture must not record LLM calls');
assert.equal(artifact.metadata.privacy_tier, 'local', 'AI-off fixture must retain local privacy tier');
assert(diff.startsWith('diff --git '), 'fixture must retain Git diff evidence');
assert(artifact.files.length > 0 && artifact.symbols.length > 0 && artifact.relationships.length > 0, 'fixture must contain usable structural topology');

console.log(`Validated daily-driver fixture ${fixture.fixtureVersion} (${fixture.artifact.schemaVersion}, ${fixture.artifact.mode}).`);
