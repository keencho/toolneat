/**
 * Component Injector
 * Injects header.html and footer.html into all HTML pages at build time
 * This eliminates runtime fetch requests for faster page loads
 * Also applies i18n translations to prevent flash of untranslated content
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
  // Replace data-i18n="key">text</tag> with translated text
  // Pattern: data-i18n="key.path">anything</
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
      // Skip node_modules, .git, components
      if (!['node_modules', '.git', 'components', '.claude'].includes(item)) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Convert links for English pages (add /en prefix)
function convertLinksForEnglish(html) {
  // Replace href="/tools/... with href="/en/tools/...
  // Replace href="/pages/... with href="/en/pages/...
  // Replace href="/" with href="/en/"
  return html
    .replace(/href="\/tools\//g, 'href="/en/tools/')
    .replace(/href="\/pages\//g, 'href="/en/pages/')
    .replace(/href="\/"/g, 'href="/en/"');
}

// Inject components into HTML file
function injectComponents(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if this is an English page
  const relativePath = path.relative(ROOT_DIR, filePath);
  const isEnglish = relativePath.startsWith('en' + path.sep) || relativePath.startsWith('en/');

  // Select locale
  const locale = isEnglish ? enLocale : koLocale;

  // Prepare header/footer for this page
  let header = headerHtml;
  let footer = footerHtml;

  // Apply translations first
  header = applyTranslations(header, locale);
  footer = applyTranslations(footer, locale);

  // Convert links for English pages
  if (isEnglish) {
    header = convertLinksForEnglish(header);
    footer = convertLinksForEnglish(footer);
  }

  // Replace empty div#header and div#footer
  // Matches: <div id="header"></div> or <div id="header">   </div> (with whitespace)
  const headerRegex = /<div\s+id=["']header["']\s*>[\s]*<\/div>/i;
  const footerRegex = /<div\s+id=["']footer["']\s*>[\s]*<\/div>/i;

  let modified = false;

  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, `<div id="header">\n${header}\n</div>`);
    modified = true;
  }

  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, `<div id="footer">\n${footer}\n</div>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

// Main
function main() {
  console.log('🔧 Injecting components into HTML files...\n');

  const htmlFiles = findHtmlFiles(ROOT_DIR);
  let injected = 0;
  let skipped = 0;

  for (const file of htmlFiles) {
    const relativePath = path.relative(ROOT_DIR, file);

    if (injectComponents(file)) {
      console.log(`✅ ${relativePath}`);
      injected++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary: ${injected} injected, ${skipped} skipped (already has content or no placeholder)`);
}

main();
