'use strict';

const path = require('path');
const {
  slugify,
  readJson,
  writeJson,
  copyFile,
  parseArgs,
  requireArg,
  assertFileExists,
  parseBio,
  repoRoot
} = require('./lib/utils');

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = repoRoot();

  const name = requireArg(args, 'name');
  const title = requireArg(args, 'title');
  const bioPreview = requireArg(args, 'bio-preview');
  const bioText = requireArg(args, 'bio');
  const cardPhoto = path.resolve(requireArg(args, 'card-photo'));
  const standingPhoto = path.resolve(requireArg(args, 'standing-photo'));
  const profilePdf = args['profile-pdf'] ? path.resolve(args['profile-pdf']) : null;

  assertFileExists(cardPhoto, 'Card photo');
  assertFileExists(standingPhoto, 'Standing photo');
  if (profilePdf) assertFileExists(profilePdf, 'Profile PDF');

  const id = slugify(name);
  if (!id) {
    throw new Error('Could not generate an id from name: ' + name);
  }

  const teamPath = path.join(root, 'assets', 'info', 'team.json');
  const team = readJson(teamPath);

  if (team.some(function (member) { return member.id === id; })) {
    throw new Error('A team member with id "' + id + '" already exists.');
  }

  const imagesDir = path.join(root, 'assets', 'images');
  const cardDest = path.join(imagesDir, id + '.jpg');
  const standingDest = path.join(imagesDir, id + '-standing.jpg');

  copyFile(cardPhoto, cardDest);
  copyFile(standingPhoto, standingDest);

  let pdfFilename = id + '.pdf';
  if (profilePdf) {
    const pdfDest = path.join(root, 'assets', 'teampdfs', pdfFilename);
    copyFile(profilePdf, pdfDest);
  }

  const bio = parseBio(bioText);
  if (!bio.length) {
    throw new Error('Bio must contain at least one paragraph. Separate paragraphs with a blank line.');
  }

  const member = {
    id: id,
    name: name,
    title: title,
    bioPreview: bioPreview,
    bio: bio,
    cardPhoto: '/assets/images/' + id + '.jpg',
    standingPhoto: '/assets/images/' + id + '-standing.jpg',
    pdf: pdfFilename
  };

  team.push(member);
  writeJson(teamPath, team);

  console.log('Team member added successfully.');
  console.log('  id:    ' + member.id);
  console.log('  name:  ' + member.name);
  console.log('  title: ' + member.title);
  console.log('  card:  ' + member.cardPhoto);
  console.log('  stand: ' + member.standingPhoto);
  if (profilePdf) console.log('  pdf:   assets/teampdfs/' + pdfFilename);
}

try {
  main();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
