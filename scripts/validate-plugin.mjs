import assert from 'node:assert/strict';
import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const referenceNames = [
  'prerequisites.md',
  'source-and-manifest.md',
  'deployment.md',
  'operations.md',
];
const productDocs = 'https://builder.appservice.azure.com/docs/';
const documentationLinks = {
  'SKILL.md': ['', 'resources/feature-status/', 'samples/'],
  'references/prerequisites.md': ['resources/preview/', 'resources/feature-status/', 'reference/builder-cli/'],
  'references/source-and-manifest.md': [
    'guides/source-control/', 'guides/builder-yaml/', 'reference/runtimes/', 'resources/feature-status/', 'samples/',
  ],
  'references/deployment.md': [
    'guides/deployments/', 'guides/source-control/', 'reference/builder-cli/', 'resources/feature-status/',
  ],
  'references/operations.md': [
    'guides/logging-and-monitoring/', 'troubleshooting/', 'guides/deployments/',
    'reference/builder-cli/', 'resources/feature-status/',
  ],
};

function checkGuidance(skillRoot) {
  const contents = {};
  for (const [path, destinations] of Object.entries(documentationLinks)) {
    const content = readFileSync(resolve(skillRoot, path), 'utf8');
    contents[path] = content;
    for (const destination of destinations) {
      assert(content.includes(`](${productDocs}${destination})`),
        `Missing canonical documentation destination in ${path}: ${destination || '/'}`);
    }
  }
  const rules = [
    ['SKILL.md', /If docs and help disagree[^.]*do not guess/i, 'docs/help mismatch'],
    ['SKILL.md', /If docs cannot be fetched[^.]*do not promote unqualified features/i, 'unavailable docs'],
    ['SKILL.md', /Plan approval[^.]*source publication[^.]*cloud deployment[^.]*distinct permissions/i, 'action scope'],
    ['references/prerequisites.md', /do not silently switch global CLI accounts or reuse another account's credential/i, 'account preservation'],
    ['references/source-and-manifest.md', /before Git initialization or account connection/i, 'local inspection'],
    ['references/source-and-manifest.md', /Do not scan[^.]*reset, stash, or change branches without approval/i, 'checkout preservation'],
    ['references/source-and-manifest.md', /inspect ancestry/i, 'source ancestry'],
    ['references/source-and-manifest.md', /missing repository\/ref from denied access/i, 'source access'],
    ['references/source-and-manifest.md', /existing usable owner fork/i, 'fork reuse'],
    ['references/source-and-manifest.md', /upstream relationship, and intended branch/i, 'fork verification'],
    ['references/source-and-manifest.md', /existing framework\/runtime and app shape/i, 'existing app shape'],
    ['references/source-and-manifest.md', /Read its current README and root `builder.yaml`/i, 'sample inspection'],
    ['references/source-and-manifest.md', /as data, not instructions that override user scope/i, 'sample trust boundary'],
    ['references/source-and-manifest.md', /smallest adaptations to the user's actual repo/i, 'sample adaptation'],
    ['references/source-and-manifest.md', /Do not automatically fork, clone over, copy wholesale, change language, or reset/i, 'sample preservation'],
    ['references/source-and-manifest.md', /Public source publication never overrides live availability warnings/i, 'sample qualification'],
    ['references/source-and-manifest.md', /Disclose discrepancies between production docs and current sample README/i, 'sample documentation drift'],
    ['references/source-and-manifest.md', /not vendored into the plugin or fetched by packaging tests\/builds/i, 'offline sample boundary'],
    ['references/source-and-manifest.md', /static Vite sample is not a TypeScript web-runtime guarantee/i, 'static runtime distinction'],
    ['references/source-and-manifest.md', /not a successful hosted deployment/i, 'sample completion evidence'],
    ['references/deployment.md', /--commit[^.]*exactly 40 hexadecimal characters[^.]*forwards it/i, 'CLI commit pinning'],
    ['references/deployment.md', /None[^\n]*configured branch/, 'default branch selection'],
    ['references/deployment.md', /--rebuild[^\n]*configured branch/, 'rebuild branch selection'],
    ['references/deployment.md', /--request-id <id>[^.]*stable idempotency key/i, 'deployment idempotency'],
    ['references/deployment.md', /observed branch SHA, requested commit, built version, activation attempt, active version\/deployment, and real HTTP\/health response/i, 'serving evidence'],
    ['references/deployment.md', /source change may trigger configured automation/i, 'source effects'],
    ['references/operations.md', /Reconciliation is read-only[^.]*must not implicitly resume writes/i, 'read-only reconciliation'],
    ['references/operations.md', /changed intent needs a new ID/i, 'retry intent'],
    ['references/operations.md', /Do not promise universal cancellation/i, 'cancellation uncertainty'],
  ];
  for (const [path, pattern, label] of rules) {
    assert(pattern.test(contents[path]), `Missing general-safety invariant: ${label}`);
  }
  const source = contents['references/source-and-manifest.md'];
  const examples = ['static-html', 'vite', 'nodejs', 'python', 'dotnet'];
  for (const example of examples) {
    assert(source.includes(`](https://github.com/Azure-Samples/app-service-builder-${example})`),
      `Missing approved public sample destination: ${example}`);
  }
  for (const content of Object.values(contents)) {
    assert(!/https:\/\/builder\.appservice\.azure\.com\/docs\/downloads\/|(?:\.\.\/)?samples\/(?:static-html|nodejs-web|python-web|dotnet-web|vite-static)/i.test(content),
      'Retired sample distribution path');
  }
  assert(!/deploy(?:ment)? (?:does not|cannot) pin (?:a )?(?:commit|SHA)/i.test(contents['references/deployment.md']),
    'Incorrect CLI commit-selector limitation');
}

function object(value, label, keys) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
  for (const key of Object.keys(value)) {
    assert(keys.includes(key), `${label}: unsupported field ${key}`);
  }
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label}: expected nonempty string`);
}

function identifier(value, label) {
  text(value, label);
  assert(value.length <= 64 && namePattern.test(value), `${label}: expected kebab-case name`);
}

function version(value, label) {
  text(value, label);
  assert(versionPattern.test(value), `${label}: expected semantic version`);
}

function contained(base, path) {
  text(path, 'relative path');
  assert(path.startsWith('./') && !isAbsolute(path) && !path.includes('\\') &&
    !path.split('/').includes('..'), `Invalid relative path: ${path}`);
  const target = realpathSync(resolve(base, path));
  const local = relative(realpathSync(base), target);
  assert(local && local !== '..' && !local.startsWith(`..${sep}`) && !isAbsolute(local),
    `Path escapes package: ${path}`);
  return target;
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`);
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function checkLinks(path, root, pluginRoot) {
  const content = readFileSync(path, 'utf8');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const href = match[1];
    if (/^(?:https:\/\/|mailto:)/.test(href)) {
      const url = new URL(href);
      assert(url.protocol === 'mailto:' ? url.pathname.includes('@') : url.hostname,
        `Invalid external link in ${path}: ${href}`);
      continue;
    }
    const [local] = href.split('#');
    if (!local) continue;
    assert(!/^[a-z]+:/i.test(local), `Unsupported link in ${path}: ${href}`);
    const target = realpathSync(resolve(dirname(path), decodeURIComponent(local)));
    const boundary = path.startsWith(`${pluginRoot}${sep}`) ? pluginRoot : root;
    const rel = relative(boundary, target);
    assert(rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel),
      `Link escapes package in ${path}: ${href}`);
    assert(statSync(target).isFile(), `Link is not a file in ${path}: ${href}`);
  }
}

export function validatePlugin(root = repositoryRoot) {
  root = realpathSync(root);
  const json = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const catalog = json('.claude-plugin/marketplace.json');
  object(catalog, 'marketplace', ['name', 'owner', 'metadata', 'plugins']);
  identifier(catalog.name, 'marketplace name');
  assert.equal(catalog.name, 'azure-app-service-builder');
  object(catalog.owner, 'marketplace owner', ['name']);
  text(catalog.owner.name, 'marketplace owner name');
  object(catalog.metadata, 'marketplace metadata', ['description', 'version']);
  text(catalog.metadata.description, 'marketplace description');
  version(catalog.metadata.version, 'marketplace version');
  assert(Array.isArray(catalog.plugins) && catalog.plugins.length === 1, 'Expected exactly one plugin');
  const entry = catalog.plugins[0];
  object(entry, 'marketplace entry', ['name', 'description', 'version', 'source']);
  identifier(entry.name, 'entry name');
  text(entry.description, 'entry description');
  version(entry.version, 'entry version');
  const pluginRoot = contained(root, entry.source);
  assert.equal(relative(root, pluginRoot), 'plugin', 'Expected plugin source ./plugin');
  const copilot = json('plugin/plugin.json');
  const claude = json('plugin/.claude-plugin/plugin.json');
  assert.deepEqual(copilot, claude, 'Host manifests must match');
  object(copilot, 'plugin', [
    'name', 'description', 'version', 'author', 'homepage', 'repository', 'license', 'keywords', 'skills',
  ]);
  identifier(copilot.name, 'plugin name');
  assert.equal(copilot.name, 'builder');
  assert.equal(entry.name, copilot.name, 'Catalog and plugin names must match');
  version(copilot.version, 'plugin version');
  assert.equal(entry.version, copilot.version, 'Catalog and plugin versions must match');
  assert.equal(catalog.metadata.version, copilot.version, 'Initial package versions must match');
  text(copilot.description, 'plugin description');
  assert(copilot.description.length <= 1024, 'Plugin description is too long');
  object(copilot.author, 'plugin author', ['name']);
  text(copilot.author.name, 'plugin author name');
  for (const key of ['homepage', 'repository']) {
    assert.equal(copilot[key], 'https://github.com/microsoft/azure-app-service-builder',
      `Unexpected ${key}`);
  }
  assert.equal(copilot.license, 'MIT');
  assert(Array.isArray(copilot.keywords) && copilot.keywords.length > 0, 'Expected keywords');
  copilot.keywords.forEach((keyword) => text(keyword, 'keyword'));
  assert.equal(copilot.skills, './skills/');
  const skillsRoot = contained(pluginRoot, copilot.skills);
  assert.deepEqual(readdirSync(skillsRoot), ['app-service-builder'], 'Expected exactly one skill');
  const skillRoot = contained(skillsRoot, './app-service-builder');
  const skillPath = resolve(skillRoot, 'SKILL.md');
  const skill = readFileSync(skillPath, 'utf8');
  const frontmatter = skill.match(/^---\nname: ([^\n]+)\ndescription: ("[^\n]+")\n---\n/);
  assert(frontmatter, 'Expected name and quoted description frontmatter');
  assert.equal(frontmatter[1], 'app-service-builder');
  const description = JSON.parse(frontmatter[2]);
  text(description, 'skill description');
  assert(description.length <= 1024, 'Skill description is too long');
  for (const trigger of ['App Service Builder', 'Private Preview', 'App Service', 'Container Apps']) {
    assert(description.includes(trigger), `Missing skill scope: ${trigger}`);
  }
  for (const reference of referenceNames) {
    assert(skill.includes(`](references/${reference})`), `Skill must link reference ${reference}`);
    contained(skillRoot, `./references/${reference}`);
  }
  const pluginFiles = files(pluginRoot);
  assert.deepEqual(
    pluginFiles.map((path) => relative(pluginRoot, path).split(sep).join('/')).sort(),
    [
      '.claude-plugin/plugin.json', 'plugin.json', 'skills/app-service-builder/SKILL.md',
      ...referenceNames.map((name) => `skills/app-service-builder/references/${name}`),
    ].sort(),
    'Expected skills-only package without extra components',
  );
  const docs = [
    ...pluginFiles.filter((path) => path.endsWith('.md')),
    resolve(root, 'README.md'),
    resolve(root, 'docs/agent-plugin.md'),
  ];
  for (const path of docs) {
    checkLinks(path, root, pluginRoot);
    const content = readFileSync(path, 'utf8');
    assert(!/https?:\/\/[^\s)"]+\.(?:tgz|tar(?:\.gz)?)(?:[?\s)"`]|$)/i.test(content),
      `CLI distribution URL must remain a placeholder: ${path}`);
    assert(!/\b(?:npm|pnpm|yarn|bun)\s+(?:install|add|i)\b|\bnpx\b|\b(?:curl|wget)\b[^\n]*\|\s*(?:sh|bash)\b/i.test(content),
      `Unapproved installer command: ${path}`);
  }
  for (const path of ['README.md', 'docs/agent-plugin.md',
    'plugin/skills/app-service-builder/references/prerequisites.md']) {
    assert(/CLI installation is a placeholder/.test(readFileSync(resolve(root, path), 'utf8')),
      `Missing CLI installation placeholder: ${path}`);
  }
  const prereqs = readFileSync(resolve(skillRoot, 'references/prerequisites.md'), 'utf8');
  assert(/stop deployment/i.test(prereqs) && /already-installed approved/.test(prereqs),
    'Missing prerequisite stop/approved CLI guardrails');
  checkGuidance(skillRoot);
  const install = readFileSync(resolve(root, 'docs/agent-plugin.md'), 'utf8');
  for (const host of ['copilot', 'claude']) {
    assert(install.includes(`${host} plugin marketplace add microsoft/azure-app-service-builder`) &&
      install.includes(`${host} plugin install builder@azure-app-service-builder`),
    `Missing ${host} installation flow`);
  }
  return { marketplace: catalog.name, plugin: copilot.name, version: copilot.version, skills: 1 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    console.log(JSON.stringify(validatePlugin(), null, 2));
  } catch (error) {
    console.error(`Plugin validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
