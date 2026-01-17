/**
 * Fix Duplicate Headers
 * Removes duplicate header content from HTML files
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');

// Read component files
const headerHtml = fs.readFileSync(path.join(COMPONENTS_DIR, 'header.html'), 'utf-8');

// Read locale files
const koLocale = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ko.json'), 'utf-8'));
const enLocale = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf-8'));

// Get nested value from object by dot-notation key
function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);
}

// Apply i18n translations to HTML
function applyTranslations(html, locale) {
  return html.replace(/data-i18n="([^"]+)"([^>]*)>([^<]*)</g, (match, key, attrs, text) => {
    const translated = getNestedValue(locale, key);
    if (translated && typeof translated === 'string') {
      return `data-i18n="${key}"${attrs}>${translated}<`;
    }
    return match;
  });
}

// Convert links for English pages
function convertLinksForEnglish(html) {
  return html
    .replace(/href="\/tools\//g, 'href="/en/tools/')
    .replace(/href="\/pages\//g, 'href="/en/pages/')
    .replace(/href="\/"/g, 'href="/en/"');
}

// Find all HTML files recursively
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'components', '.claude'].includes(item)) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Fix header in HTML file
function fixHeader(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file has multiple theme-toggle (indicator of duplicate)
  const themeToggleCount = (content.match(/id="theme-toggle"/g) || []).length;
  if (themeToggleCount <= 1) {
    return false; // No fix needed
  }

  const relativePath = path.relative(ROOT_DIR, filePath);
  const isEnglish = relativePath.startsWith('en' + path.sep) || relativePath.startsWith('en/');

  const locale = isEnglish ? enLocale : koLocale;

  let header = headerHtml;
  header = applyTranslations(header, locale);
  if (isEnglish) {
    header = convertLinksForEnglish(header);
  }

  // Find where <div id="header"> starts
  const headerStartMatch = content.match(/<div\s+id=["']header["']\s*>/i);
  if (!headerStartMatch) {
    return false;
  }
  const headerStartIndex = headerStartMatch.index;

  // Find where main content starts (<!-- Main Content --> or <main)
  const mainContentMatch = content.match(/(\s*<!--\s*Main\s*Content\s*-->\s*<main|\s*<main\s+class=)/i);
  if (!mainContentMatch) {
    return false;
  }
  const mainContentIndex = mainContentMatch.index;

  // Rebuild file: before header + clean header + main content onwards
  const beforeHeader = content.substring(0, headerStartIndex);
  const mainContentOnwards = content.substring(mainContentIndex);

  const newContent = beforeHeader + `<div id="header">\n${header}</div>\n` + mainContentOnwards;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  return true;
}

// Main
function main() {
  console.log('🔧 Fixing duplicate headers in HTML files...\n');

  const htmlFiles = findHtmlFiles(ROOT_DIR);
  let fixed = 0;
  let skipped = 0;

  for (const file of htmlFiles) {
    const relativePath = path.relative(ROOT_DIR, file);

    if (fixHeader(file)) {
      console.log(`✅ ${relativePath}`);
      fixed++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary: ${fixed} fixed, ${skipped} skipped (no duplicates)`);
}

main();
