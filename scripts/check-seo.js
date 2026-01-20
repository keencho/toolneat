const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules') {
        getAllHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkSEO(filePath, content) {
  const issues = [];

  // Check JSON-LD
  if (!content.includes('application/ld+json')) {
    issues.push('JSON-LD');
  }

  // Check OG tags
  if (!content.includes('og:title')) {
    issues.push('OG tags');
  }

  // Check canonical
  if (!content.includes('rel="canonical"')) {
    issues.push('Canonical');
  }

  // Check meta description
  if (!content.includes('name="description"')) {
    issues.push('Meta description');
  }

  // Check hreflang (only for non-pages directory)
  if (!filePath.includes('pages') && !content.includes('hreflang')) {
    issues.push('hreflang');
  }

  // Check apple-touch-icon
  if (!content.includes('apple-touch-icon')) {
    issues.push('apple-touch-icon');
  }

  // Check manifest
  if (!content.includes('manifest')) {
    issues.push('manifest');
  }

  return issues;
}

function main() {
  const rootDir = path.join(__dirname, '..');
  const htmlFiles = getAllHtmlFiles(rootDir);

  const missingByIssue = {
    'JSON-LD': [],
    'OG tags': [],
    'Canonical': [],
    'Meta description': [],
    'hreflang': [],
    'apple-touch-icon': [],
    'manifest': []
  };

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    const issues = checkSEO(file, content);

    for (const issue of issues) {
      missingByIssue[issue].push(relativePath);
    }
  }

  console.log('='.repeat(60));
  console.log('SEO CHECK REPORT');
  console.log('='.repeat(60));
  console.log(`Total HTML files: ${htmlFiles.length}\n`);

  for (const [issue, files] of Object.entries(missingByIssue)) {
    if (files.length > 0) {
      console.log(`\n❌ Missing ${issue}: ${files.length} files`);
      console.log('-'.repeat(40));
      files.forEach(f => console.log(`   ${f}`));
    } else {
      console.log(`\n✅ ${issue}: All files OK`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

main();
