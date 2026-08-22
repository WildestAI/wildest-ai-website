#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const truth = JSON.parse(await readFile('src/data/release-truth.json', 'utf8'));
const releaseTruthSource = await readFile('src/components/ReleaseTruth.tsx', 'utf8');
const diffGraphProofSource = await readFile('src/components/DiffGraphProof.tsx', 'utf8');
const landingPageSource = await readFile('src/pages/Index.tsx', 'utf8');
const sampleArtifact = JSON.parse(await readFile('public/examples/greeting-structural.json', 'utf8'));
const sampleDiff = await readFile('public/examples/greeting.diff', 'utf8');
const documents = {
  'public/llms.txt': await readFile('public/llms.txt', 'utf8'),
  'public/llms-full.txt': await readFile('public/llms-full.txt', 'utf8'),
};

function requireInBoth(value, description) {
  for (const [file, text] of Object.entries(documents)) {
    assert(text.includes(value), `${file} is missing ${description}: ${value}`);
  }
}

assert.equal(truth.schemaVersion, 1, 'unsupported release-truth schema');
assert.match(truth.asOf, /^\d{4}-\d{2}-\d{2}$/, 'asOf must use YYYY-MM-DD');
const asOfDate = new Date(`${truth.asOf}T00:00:00.000Z`);
assert(
  !Number.isNaN(asOfDate.valueOf()) && asOfDate.toISOString().slice(0, 10) === truth.asOf,
  'asOf must be a real calendar date',
);
assert.match(truth.cli.sourceRevision, /^[0-9a-f]{40}$/, 'CLI sourceRevision must be an exact commit');
assert(
  truth.cli.install.includes(`git checkout ${truth.cli.sourceRevision}`),
  'CLI installation must check out the exact sourceRevision used by release claims',
);
assert.match(truth.cli.minimumPython, /^\d+\.\d+$/, 'CLI minimumPython must be exact');
assert(truth.cli.aiOff.includes('--structural-json'), 'CLI AI-off claim must name its non-AI command');
assert.match(truth.extension.version, /^\d+\.\d+\.\d+$/, 'extension version must be exact');
assert.match(truth.extension.minimumVscode, /^\d+\.\d+\.\d+$/, 'extension minimumVscode must be exact');
const extensionRuntimeBinaries = new Map([
  ['macOS arm64', 'wild-macos-arm64'],
  ['macOS x64', 'wild-macos-x64'],
  ['Linux arm64', 'wild-linux-arm64'],
  ['Linux x64', 'wild-linux-x64'],
  ['Windows x64', 'wild-win.exe'],
]);
assert.deepEqual(truth.extension.publishedRuntimeTargets, ['macOS arm64']);
assert(truth.extension.missingRuntimeTargets.length > 0, 'missing published runtimes must remain explicit');
assert.deepEqual(
  [...truth.extension.publishedRuntimeTargets, ...truth.extension.missingRuntimeTargets].sort(),
  [...extensionRuntimeBinaries.keys()].sort(),
  'release truth must classify every declared extension runtime target',
);
assert(truth.extension.aiOff.startsWith('Not available'), 'extension AI-off limitation must be explicit');
assert.equal(typeof truth.mcp.supportedInstall, 'boolean', 'MCP supportedInstall must be boolean');
assert(truth.dataHandling.localProcessing.includes('Structural JSON generation makes no AI request'));
assert(truth.dataHandling.credentialHandling.includes('OPENAI_API_KEY'));
assert(truth.dataHandling.credentialHandling.includes('does not provide SecretStorage-based BYOK'));
assert(truth.dataHandling.localArtifacts.includes('local path'));
assert(truth.dataHandling.wildestAiRetention.includes('no server-side retention'));
assert.equal(truth.dataHandling.thirdParties.length, 1, 'all current AI subprocessors must be explicit');
const openAiParty = truth.dataHandling.thirdParties.find(
  (party) => party.name === 'OpenAI API',
);
assert.ok(openAiParty, 'OpenAI API processor entry is required');
assert.equal(
  openAiParty.dataControlsUrl,
  'https://developers.openai.com/api/docs/guides/your-data',
);
assert.equal(
  openAiParty.privacyUrl,
  'https://openai.com/policies/privacy-policy/',
);
assert(releaseTruthSource.includes('import releaseTruth from "@/data/release-truth.json"'), 'release-truth component must import the canonical manifest');
for (const field of [
  'cli.status',
  'cli.minimumPython',
  'cli.aiOff',
  'extension.status',
  'extension.minimumVscode',
  'extension.publishedRuntimeTargets',
  'extension.missingRuntimeTargets',
  'extension.aiOff',
  'mcp.status',
  'aiDataFlow',
  'dataHandling.localProcessing',
  'dataHandling.credentialHandling',
  'dataHandling.localArtifacts',
  'dataHandling.wildestAiRetention',
  'dataHandling.thirdParties',
  'planned',
  'asOf',
]) {
  assert(releaseTruthSource.includes(`releaseTruth.${field}`), `release-truth component does not render releaseTruth.${field}`);
}
assert(releaseTruthSource.includes('href="/release-truth.json"'), 'release-truth component must link the public manifest');
assert(
  releaseTruthSource.includes('linkLabel: "View Marketplace listing"'),
  'VS Code CTA must describe its Marketplace destination',
);
assert(releaseTruthSource.includes('Dated release status'), 'release-truth badge must not imply third-party terms were verified');
assert(
  landingPageSource.includes('import ReleaseTruth from "@/components/ReleaseTruth"'),
  'landing page must import the release-truth component',
);
assert.match(landingPageSource, /<ReleaseTruth\s*\/>/, 'landing page must mount the release-truth component');
assert(
  landingPageSource.includes('import DiffGraphProof from "@/components/DiffGraphProof"'),
  'landing page must import the static DiffGraph proof',
);
assert.match(landingPageSource, /<DiffGraphProof\s*\/>/, 'landing page must mount the static DiffGraph proof');
assert(!landingPageSource.includes('app.supademo.com'), 'landing page must not depend on a scripted third-party demo');
assert.equal(sampleArtifact.schema_version, '2.0', 'sample artifact must use the supported DiffGraph schema');
assert.equal(sampleArtifact.metadata.llm_calls, 0, 'sample graph must be structural, not AI-generated');
assert.equal(sampleArtifact.files[0]?.language, 'python', 'sample artifact must identify its supported language');
assert.equal(sampleArtifact.relationships[0]?.analysis_source, 'structural', 'sample relationship must be structural');
assert(sampleDiff.startsWith('diff --git '), 'sample evidence must include a textual Git diff');
assert(diffGraphProofSource.includes('greeting-structural.json'), 'proof must render the checked-in artifact');
assert(diffGraphProofSource.includes('greeting.diff'), 'proof must link evidence to the checked-in textual diff');
assert(diffGraphProofSource.includes('artifact.schema_version'), 'proof must display schema version');
assert(diffGraphProofSource.includes('artifact.generated_at'), 'proof must display generation date');
assert(diffGraphProofSource.includes('artifact.diff_ref.kind'), 'proof must display comparison semantics');
assert(
  landingPageSource.includes('GPL-3.0-or-later extension'),
  'landing page must scope the open-source claim to the licensed extension',
);
requireInBoth(`Release truth as of **${truth.asOf}**`, 'dated release status');
requireInBoth(`### Available — ${truth.asOf}`, 'Available section');
requireInBoth(`### Beta — ${truth.asOf}`, 'Beta section');
requireInBoth(`### Planned — ${truth.asOf}`, 'Planned section');
requireInBoth(truth.roadmapUrl, 'roadmap source');
requireInBoth(truth.aiDataFlow, 'approved AI data-flow disclosure');
for (const field of ['localProcessing', 'credentialHandling', 'localArtifacts', 'wildestAiRetention']) {
  requireInBoth(truth.dataHandling[field], `data-handling field ${field}`);
}
for (const party of truth.dataHandling.thirdParties) {
  requireInBoth(party.name, 'third-party processor name');
  requireInBoth(party.when, 'third-party invocation condition');
  requireInBoth(party.data, 'third-party data disclosure');
  requireInBoth(party.dataControlsUrl, 'third-party data controls');
  requireInBoth(party.privacyUrl, 'third-party privacy policy');
}
requireInBoth(`${truth.cli.provider} \`${truth.cli.model}\``, 'current provider/model');
requireInBoth(`Python ${truth.cli.minimumPython} or newer`, 'CLI runtime requirement');
requireInBoth('AI-off operation is available for local structural JSON only', 'CLI AI-off behavior');
requireInBoth(`Extension ${truth.extension.version} requires VS Code ${truth.extension.minimumVscode} or newer`, 'extension runtime requirement');
requireInBoth(`The Marketplace VSIX contains a runnable CLI for ${truth.extension.publishedRuntimeTargets.join(', ')} only`, 'published extension runtime support');
for (const target of truth.extension.missingRuntimeTargets) requireInBoth(target, 'missing extension runtime target');
requireInBoth(`AI-off DiffGraph generation is not available in extension ${truth.extension.version}`, 'extension AI-off limitation');
requireInBoth(truth.extension.marketplace, 'VS Code Marketplace URL');

const releaseSurfaces = [
  { name: 'wild CLI', heading: `#### \`wild\` CLI — ${truth.cli.status}`, status: truth.cli.status },
  { name: 'VS Code Extension', heading: `#### VS Code Extension — ${truth.extension.status}`, status: truth.extension.status },
  { name: 'MCP Server', heading: `#### MCP Server — ${truth.mcp.status}`, status: truth.mcp.status },
];
for (const { name, heading, status } of releaseSurfaces) {
  const sectionName = status.match(/^(Available|Beta|Planned)\b/)?.[1];
  assert(sectionName, `${name} status must begin with Available, Beta, or Planned`);
  for (const [file, text] of Object.entries(documents)) {
    const section = text.split(`### ${sectionName} — ${truth.asOf}`)[1]?.split('\n### ')[0] ?? '';
    assert(section.includes(heading), `${file} does not place ${name} in its declared ${sectionName} section`);
  }
}
requireInBoth(
  truth.mcp.supportedInstall ? 'MCP installation: supported' : 'there is no supported MCP entry point',
  'MCP installation support',
);

for (const command of truth.cli.install) requireInBoth(command, 'supported CLI installation command');
for (const url of truth.resources) requireInBoth(url, 'canonical resource URL');
for (const item of truth.planned) requireInBoth(item, 'planned product surface');

for (const [file, text] of Object.entries(documents)) {
  assert(!/\(current\)/i.test(text), `${file} contains an undated current label`);
  assert(
    !text.includes('`OPENAI_API_KEY` environment variable or `--api-key` flag'),
    `${file} presents --api-key as a working SDK configuration path`,
  );
  assert(!text.includes('python mcp_server.py'), `${file} presents unsupported MCP setup instructions`);
  assert(!/MCP Server — Available/i.test(text), `${file} presents MCP as generally available`);
  assert(!/An MCP[^\n]+server is available/i.test(text), `${file} presents MCP as generally available`);
  assert(text.includes('https://wildest.ai/release-truth.json'), `${file} does not link the maintained release truth`);
}

assert(documents['public/llms.txt'].includes('https://wildest.ai/llms-full.txt'));
assert(documents['public/llms-full.txt'].includes('https://wildest.ai/llms.txt'));

const urlPattern = /https:\/\/[^\s)\]>,]+/g;
const urls = [...new Set(
  Object.values(documents)
    .flatMap((text) => text.match(urlPattern) ?? [])
    .map((url) => url.replace(/[.,;:]+$/, '')),
)];

async function checkMarketplace(url) {
  const marketplaceUrl = new URL(url);
  assert.equal(marketplaceUrl.origin, 'https://marketplace.visualstudio.com');
  assert.equal(marketplaceUrl.pathname, '/items');
  const itemName = marketplaceUrl.searchParams.get('itemName');
  assert.equal(itemName, 'WildestAI.wildest-vscode-ext');
  const [publisherName, extensionName] = itemName.split('.');

  const response = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
    method: 'POST',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'content-type': 'application/json',
      accept: 'application/json;api-version=7.2-preview.1',
      'user-agent': 'WildestAI-release-truth-validator/1.0',
    },
    body: JSON.stringify({
      filters: [{ criteria: [{ filterType: 7, value: itemName }] }],
      flags: 914,
    }),
  });
  if (!response.ok) throw new Error(`Marketplace API returned HTTP ${response.status}`);
  const body = await response.json();
  const extension = body.results?.[0]?.extensions?.[0];
  assert.equal(extension?.publisher?.publisherName, publisherName);
  assert.equal(extension?.extensionName, extensionName);
  const publishedVersion = extension?.versions?.[0];
  assert.equal(publishedVersion?.version, truth.extension.version);

  const vsixUrl = publishedVersion?.files?.find(
    (file) => file.assetType === 'Microsoft.VisualStudio.Services.VSIXPackage',
  )?.source;
  assert(vsixUrl, 'Marketplace response does not expose the published VSIX');
  const vsixResponse = await fetch(vsixUrl, { signal: AbortSignal.timeout(30_000) });
  assert(vsixResponse.ok, `Marketplace VSIX returned HTTP ${vsixResponse.status}`);

  const directory = await mkdtemp(join(tmpdir(), 'wildest-vsix-'));
  const vsixPath = join(directory, 'extension.vsix');
  try {
    await writeFile(vsixPath, Buffer.from(await vsixResponse.arrayBuffer()));
    const manifestEntry = spawnSync('unzip', ['-p', vsixPath, 'extension/package.json'], { encoding: 'utf8' });
    assert.equal(manifestEntry.status, 0, `unable to read Marketplace VSIX manifest: ${manifestEntry.stderr}`);
    const packageManifest = JSON.parse(manifestEntry.stdout);
    const expectedBinDeclarations = Object.fromEntries(
      [...extensionRuntimeBinaries.values()].map((binary) => [binary, `./bin/${binary}`]),
    );
    assert.deepEqual(
      packageManifest.bin,
      expectedBinDeclarations,
      'published VSIX runtime declarations changed; update release truth',
    );

    const listing = spawnSync('unzip', ['-Z1', vsixPath], { encoding: 'utf8' });
    assert.equal(listing.status, 0, `unable to inspect Marketplace VSIX: ${listing.stderr}`);
    const packagedBinaries = listing.stdout
      .split('\n')
      .filter((entry) => entry.startsWith('extension/bin/') && !entry.endsWith('/'))
      .map((entry) => entry.slice('extension/bin/'.length))
      .sort();
    const expectedPackagedBinaries = truth.extension.publishedRuntimeTargets
      .map((target) => extensionRuntimeBinaries.get(target))
      .sort();
    assert.deepEqual(packagedBinaries, expectedPackagedBinaries, 'published runtime support changed; update release truth');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function checkRemoteUrl(url) {
  const localPaths = new Map([
    ['https://wildest.ai', 'index.html'],
    ['https://wildest.ai/llms.txt', 'public/llms.txt'],
    ['https://wildest.ai/llms-full.txt', 'public/llms-full.txt'],
    ['https://wildest.ai/release-truth.json', 'src/data/release-truth.json'],
  ]);
  if (localPaths.has(url)) {
    await readFile(localPaths.get(url));
    return;
  }
  if (url === truth.extension.marketplace) {
    await checkMarketplace(url);
    return;
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      let response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'WildestAI-release-truth-validator/1.0' },
      });
      if (response.status === 405 || response.status >= 400) {
        response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(15_000),
          headers: { 'user-agent': 'WildestAI-release-truth-validator/1.0' },
        });
      }
      if ((response.status >= 200 && response.status < 400) || response.status === 403) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
  }
  throw new Error(`${url} is unreachable: ${lastError?.message ?? 'unknown error'}`);
}

if (process.argv.includes('--check-links')) {
  const cliRevisionUrl = `${truth.cli.repository.replace(/\/$/, '')}/commit/${truth.cli.sourceRevision}`;
  const results = await Promise.allSettled([...urls, cliRevisionUrl].map(checkRemoteUrl));
  const failures = results.flatMap((result) => result.status === 'rejected' ? [result.reason.message] : []);
  assert.equal(failures.length, 0, `public URL validation failed:\n${failures.join('\n')}`);
}

console.log(`Validated release claims in ${Object.keys(documents).length} documents and ${urls.length} URLs.`);
