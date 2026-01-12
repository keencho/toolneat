#!/usr/bin/env node
/**
 * Update favicon links in all HTML files
 *
 * Usage: node scripts/update-favicon.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const NEW_FAVICON_LINKS = `  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">`;

function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    // Skip node_modules, .git, etc.
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;

    if (item.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }

  return files;
}

function updateFaviconInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Remove existing favicon links (various patterns)
  // Pattern 1: <link rel="icon" type="image/svg+xml" href="...favicon.svg">
  content = content.replace(/<link[^>]*rel=["']icon["'][^>]*href=["'][^"']*favicon[^"']*["'][^>]*>\s*/gi, '');

  // Pattern 2: <link rel="icon" href="...favicon.ico" ...>
  content = content.replace(/<link[^>]*href=["'][^"']*favicon[^"']*["'][^>]*rel=["']icon["'][^>]*>\s*/gi, '');

  // Find the position to insert (after last <meta> or before <link rel="stylesheet">)
  const stylesheetMatch = content.match(/<link[^>]*rel=["']stylesheet["']/i);

  if (stylesheetMatch) {
    const insertPos = content.indexOf(stylesheetMatch[0]);
    content = content.slice(0, insertPos) + NEW_FAVICON_LINKS + '\n  ' + content.slice(insertPos);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  let updatedCount = 0;

  console.log(`Found ${htmlFiles.length} HTML files`);

  for (const file of htmlFiles) {
    const relativePath = path.relative(ROOT_DIR, file);
    const updated = updateFaviconInFile(file);
    if (updated) {
      console.log(`  Updated: ${relativePath}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} files`);
}

main();
