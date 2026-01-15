/**
 * Force Update Headers
 * Replaces ALL header content (not just empty ones) with the latest from components/header.html
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const LOCALES_DIR = path.join(ROOT_DIR, 'locales');

// Read component files
const headerHtml = fs.readFileSync(path.join(COMPONENTS_DIR, 'header.html'), 'utf-8');
const footerHtml = fs.readFileSync(path.join(COMPONENTS_DIR, 'footer.html'), 'utf-8');

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

// Convert links for English pages
function convertLinksForEnglish(html) {
  return html
    .replace(/href="\/tools\//g, 'href="/en/tools/')
    .replace(/href="\/pages\//g, 'href="/en/pages/')
    .replace(/href="\/"/g, 'href="/en/"');
}

// Force update header in HTML file
function updateHeader(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const relativePath = path.relative(ROOT_DIR, filePath);
  const isEnglish = relativePath.startsWith('en' + path.sep) || relativePath.startsWith('en/');

  const locale = isEnglish ? enLocale : koLocale;

  let header = headerHtml;
  header = applyTranslations(header, locale);
  if (isEnglish) {
    header = convertLinksForEnglish(header);
  }

  // Match <div id="header">...<header>...</header>...</div>
  // The header div contains a <header> element, so we match until </header> followed by </div>
  const headerRegex = /<div\s+id=["']header["']\s*>[\s\S]*?<\/header>\s*<\/div>/i;

  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, `<div id="header">\n${header}\n</div>`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

// Main
function main() {
  console.log('🔧 Force updating headers in ALL HTML files...\n');

  const htmlFiles = findHtmlFiles(ROOT_DIR);
  let updated = 0;
  let skipped = 0;

  for (const file of htmlFiles) {
    const relativePath = path.relative(ROOT_DIR, file);

    if (updateHeader(file)) {
      console.log(`✅ ${relativePath}`);
      updated++;
    } else {
      console.log(`⏭️  ${relativePath} (no header div found)`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
}

main();
