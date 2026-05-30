'use strict';

const fs = require('fs');
const path = require('path');
const {
  readJson,
  writeJson,
  copyFile,
  parseArgs,
  requireArg,
  assertFileExists,
  assertDate,
  nextReportId,
  repoRoot
} = require('./lib/utils');

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = repoRoot();
  const title = requireArg(args, 'title');
  const date = requireArg(args, 'date');
  const pdfPath = path.resolve(requireArg(args, 'pdf'));

  assertDate(date);
  assertFileExists(pdfPath, 'PDF');

  const destDir = path.join(root, 'assets', 'tnipdfs');
  const manifestPath = path.join(destDir, 'manifest.json');
  const manifest = readJson(manifestPath);

  const destFilename = path.basename(pdfPath);
  const destPath = path.join(destDir, destFilename);

  if (fs.existsSync(destPath)) {
    throw new Error('A PDF with this filename already exists in assets/tnipdfs/: ' + destFilename);
  }

  copyFile(pdfPath, destPath);

  const entry = {
    id: nextReportId(manifest),
    title: title,
    date: date,
    file: destFilename
  };

  manifest.push(entry);
  writeJson(manifestPath, manifest);

  console.log('Insight added successfully.');
  console.log('  id:    ' + entry.id);
  console.log('  title: ' + entry.title);
  console.log('  date:  ' + entry.date);
  console.log('  file:  assets/tnipdfs/' + entry.file);
}

try {
  main();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
