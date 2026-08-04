#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const truth = JSON.parse(await readFile('public/release-truth.json', 'utf8'));
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
assert.match(truth.asOf, /^\d{4}-\d{2}-\d{2}$/);
assert.match(truth.cli.sourceRevision, /^[0-9a-f]{40}$/, 'CLI sourceRevision must be an exact commit');
assert.match(truth.extension.version, /^\d+\.\d+\.\d+$/, 'extension version must be exact');
requireInBoth(`Release truth as of **${truth.asOf}**`, 'dated release status');
requireInBoth(`### Available — ${truth.asOf}`, 'Available section');
requireInBoth(`### Beta — ${truth.asOf}`, 'Beta section');
requireInBoth(`### Planned — ${truth.asOf}`, 'Planned section');
requireInBoth(truth.roadmapUrl, 'roadmap source');
requireInBoth(truth.aiDataFlow, 'approved AI data-flow disclosure');
requireInBoth(`${truth.cli.provider} \`${truth.cli.model}\``, 'current provider/model');
requireInBoth(`MCP Server — ${truth.mcp.status}`, 'MCP release status');

for (const command of truth.cli.install) requireInBoth(command, 'supported CLI installation command');
for (const url of truth.resources) requireInBoth(url, 'canonical resource URL');
for (const item of truth.planned) requireInBoth(item, 'planned product surface');

for (const [file, text] of Object.entries(documents)) {
  assert(!/\(current\)/i.test(text), `${file} contains an undated current label`);
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

async function checkMarketplace() {
  const response = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
    method: 'POST',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'content-type': 'application/json',
      accept: 'application/json;api-version=7.2-preview.1',
      'user-agent': 'WildestAI-release-truth-validator/1.0',
    },
    body: JSON.stringify({
      filters: [{ criteria: [{ filterType: 7, value: 'WildestAI.wildest-vscode-ext' }] }],
      flags: 914,
    }),
  });
  if (!response.ok) throw new Error(`Marketplace API returned HTTP ${response.status}`);
  const body = await response.json();
  const extension = body.results?.[0]?.extensions?.[0];
  assert.equal(extension?.publisher?.publisherName, 'WildestAI');
  assert.equal(extension?.extensionName, 'wildest-vscode-ext');
  assert.equal(extension?.versions?.[0]?.version, truth.extension.version);
}

async function checkRemoteUrl(url) {
  const localPaths = new Map([
    ['https://wildest.ai', 'index.html'],
    ['https://wildest.ai/llms.txt', 'public/llms.txt'],
    ['https://wildest.ai/llms-full.txt', 'public/llms-full.txt'],
    ['https://wildest.ai/release-truth.json', 'public/release-truth.json'],
  ]);
  if (localPaths.has(url)) {
    await readFile(localPaths.get(url));
    return;
  }
  if (url === truth.extension.marketplace) {
    await checkMarketplace();
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
  const results = await Promise.allSettled(urls.map(checkRemoteUrl));
  const failures = results.flatMap((result) => result.status === 'rejected' ? [result.reason.message] : []);
  assert.equal(failures.length, 0, `public URL validation failed:\n${failures.join('\n')}`);
}

console.log(`Validated release claims in ${Object.keys(documents).length} documents and ${urls.length} URLs.`);
