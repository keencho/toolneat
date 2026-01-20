#!/usr/bin/env node
/**
 * Convert folder/index.html structure to flat file.html structure
 * This removes trailing slash redirects on Cloudflare Pages
 *
 * Before: tools/dev/hash-generator/index.html
 * After:  tools/dev/hash-generator.html
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Files to skip (keep as index.html)
const SKIP_PATHS = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'en', 'index.html'),
];

// Directories to skip entirely
const SKIP_DIRS = ['node_modules', '.git', '.idea', '.claude', 'components', 'assets', 'locales', 'scripts', 'src', 'docs'];

function getAllIndexFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      if (SKIP_DIRS.includes(item.name)) {
        continue;
      }
      getAllIndexFiles(fullPath, files);
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }

  return files;
}

function convertFile(indexPath) {
  // Skip root index files
  if (SKIP_PATHS.includes(indexPath)) {
    console.log(`SKIP: ${path.relative(ROOT_DIR, indexPath)}`);
    return false;
  }

  const dir = path.dirname(indexPath);
  const parentDir = path.dirname(dir);
  const folderName = path.basename(dir);
  const newFilePath = path.join(parentDir, `${folderName}.html`);

  // Read the content
  const content = fs.readFileSync(indexPath, 'utf8');

  // Write to new location
  fs.writeFileSync(newFilePath, content, 'utf8');

  // Delete old index.html
  fs.unlinkSync(indexPath);

  // Try to remove the folder (only if empty)
  try {
    const remaining = fs.readdirSync(dir);
    if (remaining.length === 0) {
      fs.rmdirSync(dir);
      console.log(`OK: ${path.relative(ROOT_DIR, indexPath)} -> ${path.relative(ROOT_DIR, newFilePath)} (folder removed)`);
    } else {
      console.log(`OK: ${path.relative(ROOT_DIR, indexPath)} -> ${path.relative(ROOT_DIR, newFilePath)} (folder kept)`);
    }
  } catch (e) {
    console.log(`OK: ${path.relative(ROOT_DIR, indexPath)} -> ${path.relative(ROOT_DIR, newFilePath)}`);
  }

  return true;
}

function main() {
  console.log('Converting folder/index.html to flat file.html structure...\n');

  const indexFiles = getAllIndexFiles(ROOT_DIR);
  console.log(`Found ${indexFiles.length} index.html files\n`);

  let converted = 0;
  let skipped = 0;

  for (const file of indexFiles) {
    if (SKIP_PATHS.includes(file)) {
      skipped++;
      console.log(`SKIP: ${path.relative(ROOT_DIR, file)}`);
    } else {
      if (convertFile(file)) {
        converted++;
      }
    }
  }

  console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}`);
}

main();
