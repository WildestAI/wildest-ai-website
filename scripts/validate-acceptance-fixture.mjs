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
const releaseTruth = JSON.parse(await readFile('src/data/release-truth.json', 'utf8'));
assert.equal(fixture.schemaVersion, 1, 'unsupported fixture manifest schema');
assert.match(fixture.fixtureVersion, /^\d{4}-\d{2}-\d{2}\.\d+$/, 'fixtureVersion must be date-versioned');
assert.equal(fixture.source.repository, releaseTruth.cli.repository, 'fixture source must be the pinned CLI repository');
assert.match(fixture.source.commit, /^[0-9a-f]{40}$/, 'fixture source must pin an exact commit');
assert.equal(fixture.source.commit, releaseTruth.cli.sourceRevision, 'fixture source must use the pinned CLI revision');
assert.equal(fixture.source.commitUrl, `${fixture.source.repository}/commit/${fixture.source.commit}`, 'fixture commit URL must match pinned source');
assert.match(fixture.source.range, /clean, temporary Git repository.*sanitized/i, 'fixture must describe its sanitized reproduction range');
assert.match(fixture.source.license, /MIT/i, 'fixture must disclose its source license');
assert.equal(fixture.artifact.schemaVersion, releaseTruth.cli.artifactSchemaVersion, 'fixture must pin the artifact schema declared by the pinned CLI source revision');
assert.equal(fixture.artifact.mode, 'AI-off structural JSON', 'fixture must be explicit about AI-off mode');
assert.match(fixture.artifact.generator, /^wild \d+\.\d+\.\d+$/, 'fixture must pin an exact CLI version');
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
assert.equal(artifact.diff_ref.repo_root, '/fixture/repository', 'fixture repository path must be sanitized');
assert.equal(artifact.metadata.llm_calls, 0, 'AI-off fixture must not record LLM calls');
assert.equal(artifact.metadata.privacy_tier, 'local', 'AI-off fixture must retain local privacy tier');
assert(diff.startsWith('diff --git '), 'fixture must retain Git diff evidence');
const diffEntries = [...diff.matchAll(/^diff --git a\/(.+?) b\/(.+?)\n([\s\S]*?)(?=^diff --git |$)/gm)].map(
  ([, oldPath, newPath, metadata]) => ({
    paths: [oldPath, newPath],
    status: /^new file mode /m.test(metadata)
      ? 'A'
      : /^deleted file mode /m.test(metadata)
        ? 'D'
        : /^rename (?:from|to) /m.test(metadata) || oldPath !== newPath
          ? 'R'
          : 'M',
  }),
);
assert(diffEntries.length > 0, 'fixture diff must identify at least one changed path');
for (const file of artifact.files) {
  assert(
    diffEntries.some((entry) => entry.status === 'M' && entry.paths.includes(file.path)),
    `artifact file ${file.path} must be independently recorded as modified in the fixture diff`,
  );
  const gitEvidence = file.evidence?.find((entry) => entry.kind === 'git_diff_name_status');
  assert(gitEvidence, `artifact file ${file.path} must retain Git diff name-status evidence`);
  const gitDetail = JSON.parse(gitEvidence.detail);
  assert.equal(gitDetail.status, 'M', `artifact file ${file.path} must retain modified status`);
  assert.equal(gitDetail.new_path, file.path, `artifact file ${file.path} must retain its new path`);
  assert.match(gitDetail.old_oid, /^[0-9a-f]{40}$/, `artifact file ${file.path} must retain its old Git blob`);
  assert.match(gitDetail.new_oid, /^[0-9a-f]{40}$/, `artifact file ${file.path} must retain its new Git blob`);
  assert.match(gitDetail.old_sha256, /^[0-9a-f]{64}$/, `artifact file ${file.path} must retain its old SHA-256 evidence`);
  assert.match(gitDetail.new_sha256, /^[0-9a-f]{64}$/, `artifact file ${file.path} must retain its new SHA-256 evidence`);
}
assert(artifact.files.length > 0 && artifact.symbols.length > 0 && artifact.relationships.length > 0, 'fixture must contain usable structural topology');

console.log(`Validated daily-driver fixture ${fixture.fixtureVersion} (${fixture.artifact.schemaVersion}, ${fixture.artifact.mode}).`);
