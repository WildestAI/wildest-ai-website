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
const coverageSourcePath = 'src/data/daily-driver-acceptance-coverage.json';
const coveragePublicPath = 'public/examples/daily-driver-acceptance-coverage.json';
const coverageSource = await readFile(coverageSourcePath, 'utf8');
const coveragePublished = await readFile(coveragePublicPath, 'utf8');
assert.equal(coveragePublished, coverageSource, `${coveragePublicPath} is stale; copy the canonical coverage from ${coverageSourcePath}`);
const coverage = JSON.parse(coverageSource);
const canonicalArtifactPath = 'src/data/greeting-structural.json';
const canonicalArtifact = await readFile(canonicalArtifactPath, 'utf8');
const releaseTruth = JSON.parse(await readFile('src/data/release-truth.json', 'utf8'));
const proofComponent = await readFile('src/components/DiffGraphProof.tsx', 'utf8');
assert.equal(fixture.schemaVersion, 1, 'unsupported fixture manifest schema');
assert.match(fixture.fixtureVersion, /^\d{4}-\d{2}-\d{2}\.\d+$/, 'fixtureVersion must be date-versioned');
assert.equal(fixture.source.repository, releaseTruth.cli.repository, 'fixture source must be the pinned CLI repository');
assert.match(fixture.source.commit, /^[0-9a-f]{40}$/, 'fixture source must pin an exact commit');
assert.equal(fixture.source.commit, releaseTruth.cli.sourceRevision, 'fixture source must use the pinned CLI revision');
assert.equal(fixture.source.commitUrl, `${fixture.source.repository}/commit/${fixture.source.commit}`, 'fixture commit URL must match pinned source');
assert.match(proofComponent, /const schemaUrl = `https:\/\/github\.com\/WildestAI\/DiffGraph-CLI\/blob\/\$\{fixture\.source\.commit\}\/diffgraph\/schema\/diffgraph-v2\.schema\.json`;/, 'proof schema link must use the fixture-pinned CLI source revision');
assert.match(proofComponent, /<a href=\{schemaUrl\}[^>]*>View schema\b/, 'proof schema link must use the pinned schema URL');
assert(!proofComponent.includes('/DiffGraph-CLI/blob/main/'), 'proof must not link its release schema evidence to an unpinned main branch');
assert.match(fixture.source.range, /clean, temporary Git repository.*sanitized/i, 'fixture must describe its sanitized reproduction range');
assert.match(fixture.source.license, /MIT/i, 'fixture must disclose its source license');
assert.equal(fixture.artifact.schemaVersion, releaseTruth.cli.artifactSchemaVersion, 'fixture must pin the artifact schema declared by the pinned CLI source revision');
assert.equal(fixture.artifact.mode, 'AI-off structural JSON', 'fixture must be explicit about AI-off mode');
assert.match(fixture.artifact.generator, /^wild \d+\.\d+\.\d+$/, 'fixture must pin an exact CLI version');
assert.equal(fixture.repeat.command, 'node scripts/validate-acceptance-fixture.mjs', 'fixture repeat command must be deterministic');
assert.match(fixture.repeat.expected, /without network access/i, 'fixture validation must be offline');
assert.equal(fixture.limitations.length, 3, 'fixture limitations must remain explicit');
assert.equal(coverage.schemaVersion, 1, 'unsupported acceptance coverage schema');
assert.equal(coverage.fixtureVersion, fixture.fixtureVersion, 'acceptance coverage must be versioned with its fixture');
assert.equal(coverage.status, 'partial-evidence', 'coverage must not overstate the incomplete daily-driver evidence');
assert.match(coverage.purpose, /unmeasured/i, 'coverage must describe its honest evidence boundary');
const expectedCoverage = new Map([
  ['sanitized-fixture-and-artifact', 'baseline-evidence'],
  ['clean-install-and-first-graph', 'not-measured'],
  ['ai-off-and-provider-paths', 'not-measured'],
  ['recovery-paths', 'not-measured'],
  ['performance-and-cache-measurements', 'not-measured'],
  ['released-cli-extension-json-compatibility', 'not-measured'],
  ['reviewer-task-outcome', 'protocol-only'],
  ['website-claim-and-static-fallback', 'baseline-evidence'],
  ['non-secret-release-gate', 'baseline-evidence'],
]);
assert.equal(coverage.criteria.length, expectedCoverage.size, 'coverage must account for every daily-driver acceptance criterion');
for (const entry of coverage.criteria) {
  assert.equal(entry.status, expectedCoverage.get(entry.id), `unexpected coverage status for ${entry.id}`);
  assert.equal(typeof entry.note, 'string', `${entry.id} must explain its evidence boundary`);
  assert(Array.isArray(entry.evidence), `${entry.id} evidence must be an array`);
  for (const evidence of entry.evidence) {
    assert.match(
      evidence,
      /^(?:\/|https:\/\/github\.com\/WildestAI\/wildest-ai-website\/blob\/main\/)/,
      `${entry.id} evidence must use a public path or repository source URL`,
    );
  }
}
assert.equal(new Set(coverage.criteria.map((entry) => entry.id)).size, expectedCoverage.size, 'coverage criterion IDs must be unique');
assert(coverage.criteria.find((entry) => entry.id === 'sanitized-fixture-and-artifact').evidence.includes('/examples/daily-driver-fixture.json'), 'fixture coverage must link the fixture manifest');
assert(coverage.criteria.find((entry) => entry.id === 'reviewer-task-outcome').evidence.includes('/examples/daily-driver-review-task.json'), 'reviewer coverage must link the protocol');

for (const [name, entry] of Object.entries(fixture.artifact.files)) {
  assert.match(entry.path, /^public\/examples\//, `${name} must be a checked-in public example`);
  assert.match(entry.sha256, /^[0-9a-f]{64}$/, `${name} must pin a SHA-256 digest`);
  const bytes = await readFile(entry.path);
  const actual = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actual, entry.sha256, `${name} checksum does not match fixture manifest`);
}

const publishedArtifact = await readFile(fixture.artifact.files.artifact.path, 'utf8');
assert.equal(
  publishedArtifact,
  canonicalArtifact,
  `${fixture.artifact.files.artifact.path} is stale; copy the canonical artifact from ${canonicalArtifactPath}`,
);
assert.match(
  proofComponent,
  /const sampleArtifactUrl = "\/examples\/greeting-structural\.json";/,
  'proof must link its rendered canonical artifact to the published fixture artifact',
);
assert.match(
  proofComponent,
  /const sampleDiffUrl = "\/examples\/greeting\.diff";/,
  'proof must link its evidence view to the published fixture diff',
);
assert.equal(
  `public${proofComponent.match(/const sampleArtifactUrl = "([^"]+)";/)?.[1] ?? ''}`,
  fixture.artifact.files.artifact.path,
  'proof artifact link must match the manifest artifact path',
);
assert.match(
  proofComponent,
  /<a href=\{sampleArtifactUrl\}[^>]*>[\s\S]*?View artifact<\/a>/,
  'proof artifact anchor must reference the published artifact URL constant',
);
assert.match(
  proofComponent,
  /<a href=\{sampleDiffUrl\}[^>]*>[\s\S]*?View textual diff<\/a>/,
  'proof diff anchor must reference the published diff URL constant',
);
assert.equal(
  `public${proofComponent.match(/const sampleDiffUrl = "([^"]+)";/)?.[1] ?? ''}`,
  fixture.artifact.files.diff.path,
  'proof diff link must match the manifest diff path',
);

const artifact = JSON.parse(publishedArtifact);
const diff = await readFile(fixture.artifact.files.diff.path, 'utf8');
const digest = (algorithm, content) => createHash(algorithm).update(content).digest('hex');
const gitBlobOid = (content) => digest('sha1', Buffer.concat([Buffer.from(`blob ${Buffer.byteLength(content)}\0`), Buffer.from(content)]));

function parseCompleteModifiedFile(metadata, path) {
  const index = metadata.match(/^index ([0-9a-f]{7,40})\.\.([0-9a-f]{7,40})(?: \d{6})?$/m);
  assert(index, `fixture diff must retain an index line for ${path}`);

  const hunk = metadata.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n([\s\S]*)$/m);
  assert(hunk, `fixture diff must retain a complete unified hunk for ${path}`);
  const [, oldStart, oldCount = '1', newStart, newCount = '1', body] = hunk;
  assert.equal(oldStart, '1', `fixture diff must begin ${path}'s old content at line 1`);
  assert.equal(newStart, '1', `fixture diff must begin ${path}'s new content at line 1`);

  const oldLines = [];
  const newLines = [];
  let oldHasNewline = true;
  let newHasNewline = true;
  let previousSides = 0;
  for (const line of body.split('\n')) {
    if (line === '') continue;
    if (line.startsWith(' ')) {
      oldLines.push(line.slice(1));
      newLines.push(line.slice(1));
      oldHasNewline = true;
      newHasNewline = true;
      previousSides = 3;
    } else if (line.startsWith('-')) {
      oldLines.push(line.slice(1));
      oldHasNewline = true;
      previousSides = 1;
    } else if (line.startsWith('+')) {
      newLines.push(line.slice(1));
      newHasNewline = true;
      previousSides = 2;
    } else if (line === '\\ No newline at end of file') {
      assert(previousSides !== 0, `fixture diff has a misplaced newline marker for ${path}`);
      if (previousSides & 1) oldHasNewline = false;
      if (previousSides & 2) newHasNewline = false;
      previousSides = 0;
    } else {
      assert.fail(`fixture diff has an unsupported hunk line for ${path}: ${line}`);
    }
  }
  assert.equal(oldLines.length, Number(oldCount), `fixture diff must contain all old lines for ${path}`);
  assert.equal(newLines.length, Number(newCount), `fixture diff must contain all new lines for ${path}`);
  return {
    oldOid: index[1],
    newOid: index[2],
    oldContent: `${oldLines.join('\n')}${oldHasNewline ? '\n' : ''}`,
    newContent: `${newLines.join('\n')}${newHasNewline ? '\n' : ''}`,
  };
}

assert.equal(artifact.schema_version, fixture.artifact.schemaVersion, 'artifact schema must match manifest');
assert.equal(artifact.wild_version, fixture.artifact.generator.replace('wild ', ''), 'artifact generator must match manifest');
assert.equal(artifact.diff_ref.repo_root, '/fixture/repository', 'fixture repository path must be sanitized');
assert.equal(artifact.metadata.llm_calls, 0, 'AI-off fixture must not record LLM calls');
assert.equal(artifact.metadata.privacy_tier, 'local', 'AI-off fixture must retain local privacy tier');
assert.deepEqual(artifact.metadata.cloud_providers_used, [], 'AI-off fixture must not record cloud providers');
assert.equal(artifact.metadata.llm_model, null, 'AI-off fixture must not record an LLM model');
assert.equal(artifact.summary, null, 'AI-off fixture must not publish AI prose as canonical output');
assert(diff.startsWith('diff --git '), 'fixture must retain Git diff evidence');
const diffEntries = [...diff.matchAll(/^diff --git a\/(.+?) b\/(.+?)\n([\s\S]*?)(?=^diff --git |(?![\s\S]))/gm)].map(
  ([, oldPath, newPath, metadata]) => ({
    paths: [oldPath, newPath],
    oldPath,
    newPath,
    metadata,
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
  const diffEntry = diffEntries.find((entry) => entry.status === 'M' && entry.newPath === file.path);
  const diffFile = parseCompleteModifiedFile(diffEntry.metadata, file.path);
  assert(gitDetail.old_oid.startsWith(diffFile.oldOid), `artifact file ${file.path} old blob must match its abbreviated diff index`);
  assert(gitDetail.new_oid.startsWith(diffFile.newOid), `artifact file ${file.path} new blob must match its abbreviated diff index`);
  assert.equal(gitDetail.old_oid, gitBlobOid(diffFile.oldContent), `artifact file ${file.path} old blob must match its old content`);
  assert.equal(gitDetail.new_oid, gitBlobOid(diffFile.newContent), `artifact file ${file.path} new blob must match its new content`);
  assert.equal(gitDetail.old_sha256, digest('sha256', diffFile.oldContent), `artifact file ${file.path} old SHA-256 must match its old content`);
  assert.equal(gitDetail.new_sha256, digest('sha256', diffFile.newContent), `artifact file ${file.path} new SHA-256 must match its new content`);
}

const modifiedFiles = new Map();
for (const file of artifact.files) {
  const diffEntry = diffEntries.find((entry) => entry.status === 'M' && entry.newPath === file.path);
  const diffFile = parseCompleteModifiedFile(diffEntry.metadata, file.path);
  const gitEvidence = file.evidence.find((entry) => entry.kind === 'git_diff_name_status');
  modifiedFiles.set(file.path, {
    lineCount: diffFile.newContent.split('\n').length - (diffFile.newContent.endsWith('\n') ? 1 : 0),
    newOid: JSON.parse(gitEvidence.detail).new_oid,
  });
}

for (const entry of [...artifact.symbols, ...artifact.relationships]) {
  const parserEvidence = entry.evidence?.filter((item) => item.kind === 'ast_parse') ?? [];
  assert(parserEvidence.length > 0, `${entry.id} must retain Tree-sitter parser evidence`);
  for (const evidence of parserEvidence) {
    assert.equal(typeof evidence.file, 'string', `${entry.id} parser evidence must identify its file`);
    const file = modifiedFiles.get(evidence.file);
    assert(file, `${entry.id} parser evidence must refer to a modified fixture file`);
    assert(Number.isInteger(evidence.line_start) && Number.isInteger(evidence.line_end), `${entry.id} parser evidence must retain integer line bounds`);
    assert(evidence.line_start >= 1 && evidence.line_end >= evidence.line_start && evidence.line_end <= file.lineCount, `${entry.id} parser evidence lines must be within the reconstructed post-image`);
    const blob = evidence.detail.match(/(?:^|;)blob=([0-9a-f]{40})(?:;|$)/)?.[1];
    assert.equal(blob, file.newOid, `${entry.id} parser evidence blob must match the Git post-image`);
  }
}

for (const symbol of artifact.symbols) {
  const evidence = symbol.evidence.find((item) => item.kind === 'ast_parse');
  assert.deepEqual(symbol.location, { file: evidence.file, line_start: evidence.line_start, line_end: evidence.line_end }, `${symbol.id} location must match its parser evidence`);
}

assert(artifact.files.length > 0 && artifact.symbols.length > 0 && artifact.relationships.length > 0, 'fixture must contain usable structural topology');
const fileIds = new Set(artifact.files.map((entry) => entry.id));
const topologyIds = new Set([...artifact.files, ...artifact.symbols].map((entry) => entry.id));
for (const symbol of artifact.symbols) {
  assert.equal(symbol.analysis_source, 'structural', `${symbol.id} must remain deterministically structural`);
  assert(fileIds.has(symbol.file_id), `${symbol.id} must reference a fixture file node`);
  assert(symbol.evidence.length > 0 && symbol.evidence.every((entry) => entry.kind === 'ast_parse'), `${symbol.id} must retain parser-only topology evidence`);
}
for (const relationship of artifact.relationships) {
  assert.equal(relationship.analysis_source, 'structural', `${relationship.id} must remain deterministically structural`);
  assert(topologyIds.has(relationship.source_id), `${relationship.id} source must reference fixture topology`);
  assert(topologyIds.has(relationship.target_id), `${relationship.id} target must reference fixture topology`);
  assert(relationship.evidence.length > 0 && relationship.evidence.every((entry) => entry.kind === 'ast_parse'), `${relationship.id} must retain parser-only topology evidence`);
}

console.log(`Validated daily-driver fixture ${fixture.fixtureVersion} (${fixture.artifact.schemaVersion}, ${fixture.artifact.mode}).`);
