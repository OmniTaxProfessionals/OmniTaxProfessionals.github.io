'use strict';

const fs = require('fs');
const path = require('path');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function copyFile(source, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function requireArg(args, name) {
  if (!args[name]) {
    throw new Error(`Missing required argument: --${name}`);
  }
  return args[name];
}

function assertFileExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

function assertDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date "${date}". Use YYYY-MM-DD.`);
  }
}

function parseBio(bioText) {
  return bioText
    .split(/\n\s*\n/)
    .map(function (p) { return p.trim(); })
    .filter(Boolean);
}

function nextReportId(manifest) {
  const nums = manifest
    .map(function (entry) { return entry.id; })
    .filter(function (id) { return /^report-\d+$/.test(id); })
    .map(function (id) { return parseInt(id.replace('report-', ''), 10); });

  const next = nums.length ? Math.max.apply(null, nums) + 1 : 1;
  return 'report-' + String(next).padStart(3, '0');
}

function repoRoot() {
  return path.resolve(__dirname, '..', '..');
}

module.exports = {
  slugify: slugify,
  readJson: readJson,
  writeJson: writeJson,
  copyFile: copyFile,
  parseArgs: parseArgs,
  requireArg: requireArg,
  assertFileExists: assertFileExists,
  assertDate: assertDate,
  parseBio: parseBio,
  nextReportId: nextReportId,
  repoRoot: repoRoot
};
