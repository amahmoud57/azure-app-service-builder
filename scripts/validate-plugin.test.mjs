import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validatePlugin } from './validate-plugin.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

function fixture(t) {
  const directory = mkdtempSync(resolve(tmpdir(), 'builder-plugin-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const path of ['.claude-plugin', 'plugin', 'docs', 'README.md', 'CONTRIBUTING.md',
    'SUPPORT.md', 'SECURITY.md', 'LICENSE']) {
    cpSync(resolve(root, path), resolve(directory, path), { recursive: true });
  }
  return directory;
}

function editJson(directory, path, edit) {
  const file = resolve(directory, path);
  const value = JSON.parse(readFileSync(file, 'utf8'));
  edit(value);
  writeFileSync(file, JSON.stringify(value));
}

test('valid package resolves the shared skill through both hosts', () => {
  assert.deepEqual(validatePlugin(), {
    marketplace: 'azure-app-service-builder', plugin: 'builder', version: '0.1.0', skills: 1,
  });
});

const failures = [
  ['missing owner', '.claude-plugin/marketplace.json', (v) => { delete v.owner; }, /owner/],
  ['invalid name', '.claude-plugin/marketplace.json', (v) => { v.name = 'Invalid Name'; }, /kebab-case/],
  ['invalid version', '.claude-plugin/marketplace.json', (v) => { v.metadata.version = 'next'; }, /semantic version/],
  ['catalog version drift', '.claude-plugin/marketplace.json', (v) => { v.plugins[0].version = '0.2.0'; }, /versions must match/],
  ['catalog name drift', '.claude-plugin/marketplace.json', (v) => { v.plugins[0].name = 'different'; }, /names must match/],
  ['parent source path', '.claude-plugin/marketplace.json', (v) => { v.plugins[0].source = './../plugin'; }, /relative path/],
  ['absolute source path', '.claude-plugin/marketplace.json', (v) => { v.plugins[0].source = '/tmp/plugin'; }, /relative path/],
  ['missing source', '.claude-plugin/marketplace.json', (v) => { v.plugins[0].source = './missing'; }, /ENOENT/],
  ['host skill path drift', 'plugin/.claude-plugin/plugin.json', (v) => { v.skills = './missing/'; }, /Host manifests must match/],
];

for (const [name, path, edit, expected] of failures) {
  test(`rejects ${name}`, (t) => {
    const directory = fixture(t);
    editJson(directory, path, edit);
    assert.throws(() => validatePlugin(directory), expected);
  });
}

test('rejects hooks rather than silently widening the package', (t) => {
  const directory = fixture(t);
  for (const path of ['plugin/plugin.json', 'plugin/.claude-plugin/plugin.json']) {
    editJson(directory, path, (v) => { v.hooks = './hooks.json'; });
  }
  assert.throws(() => validatePlugin(directory), /unsupported field hooks/);
});

test('rejects a source symlink escaping the repository', (t) => {
  const directory = fixture(t);
  const outside = mkdtempSync(resolve(tmpdir(), 'builder-outside-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  symlinkSync(outside, resolve(directory, 'outside'));
  editJson(directory, '.claude-plugin/marketplace.json', (v) => { v.plugins[0].source = './outside'; });
  assert.throws(() => validatePlugin(directory), /escapes package/);
});

test('rejects missing or malformed skill frontmatter', (t) => {
  const directory = fixture(t);
  writeFileSync(resolve(directory, 'plugin/skills/app-service-builder/SKILL.md'), '# No frontmatter');
  assert.throws(() => validatePlugin(directory), /frontmatter/);
});

test('rejects a missing bundled reference', (t) => {
  const directory = fixture(t);
  rmSync(resolve(directory, 'plugin/skills/app-service-builder/references/operations.md'));
  assert.throws(() => validatePlugin(directory), /ENOENT/);
});

test('rejects broken local links', (t) => {
  const directory = fixture(t);
  const path = resolve(directory, 'docs/agent-plugin.md');
  writeFileSync(path, readFileSync(path, 'utf8') + '\n[Broken](missing.md)\n');
  assert.throws(() => validatePlugin(directory), /ENOENT/);
});

test('rejects references outside the installed plugin', (t) => {
  const directory = fixture(t);
  const path = resolve(directory, 'plugin/skills/app-service-builder/references/prerequisites.md');
  writeFileSync(path, readFileSync(path, 'utf8') + '\n[Outside](../../../../README.md)\n');
  assert.throws(() => validatePlugin(directory), /Link escapes package/);
});

for (const [name, addition, expected] of [
  ['invented npm installer', '\n```shell\nnpm install -g guessed-builder\n```\n', /installer command/],
  ['invented TAR URL', '\nhttps://example.invalid/builder.tar.gz\n', /distribution URL/],
  ['remote shell installer', '\n```shell\ncurl https://example.invalid/install | bash\n```\n', /installer command/],
]) {
  test(`rejects ${name}`, (t) => {
    const directory = fixture(t);
    const path = resolve(directory, 'docs/agent-plugin.md');
    writeFileSync(path, readFileSync(path, 'utf8') + addition);
    assert.throws(() => validatePlugin(directory), expected);
  });
}

test('rejects removing the CLI installation placeholder', (t) => {
  const directory = fixture(t);
  const path = resolve(directory, 'docs/agent-plugin.md');
  writeFileSync(path, readFileSync(path, 'utf8').replace('CLI installation is a placeholder', 'Install now'));
  assert.throws(() => validatePlugin(directory), /Missing CLI installation placeholder/);
});
