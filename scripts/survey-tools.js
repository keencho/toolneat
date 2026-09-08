// Survey: for each tool page, list which h2/h3 sections exist in the content section.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function listToolFiles(langPrefix = '') {
  const out = [];
  for (const cat of ['dev', 'life', 'pdf', 'game']) {
    const dir = path.join(ROOT, langPrefix, 'tools', cat);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.html') && f !== 'index.html') {
        out.push(path.join(dir, f));
      }
    }
  }
  return out;
}

const SECTION_WRAPPER_RE = /<section class="mt-8 (?:bg-white|bg-gray-50)[^"]*">/g;

function analyze(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  // Locate first content section wrapper that appears AFTER </main>'s before-ad indicator
  // Or simply find the one before "Ad Container (Bottom)" or before </main>
  const adIdx = html.indexOf('<!-- Ad Container (Bottom) -->');
  const slice = adIdx > 0 ? html.slice(0, adIdx) : html;

  // Find all <section class="mt-8 ..."> in slice
  const matches = [...slice.matchAll(SECTION_WRAPPER_RE)];
  if (!matches.length) return { file: filePath, sections: 0, h3s: [], h2: null };

  // Take the LAST section before ad (the content section)
  const last = matches[matches.length - 1];
  const start = last.index;
  // Find this section's end (handle nested)
  let depth = 1, i = start + last[0].length;
  while (depth > 0 && i < slice.length) {
    const nextOpen = slice.indexOf('<section', i);
    const nextClose = slice.indexOf('</section>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 8;
    } else {
      depth--;
      i = nextClose + 10;
    }
  }
  const sectionHtml = slice.slice(start, i);

  // Extract h2 text
  const h2m = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const h2 = h2m ? h2m[1].replace(/<[^>]+>/g, '').trim() : null;

  // Extract all h3 texts in this section
  const h3s = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim());

  // Word count of section content
  const txt = sectionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = txt.split(/\s+/).length;

  return {
    file: path.relative(ROOT, filePath),
    h2,
    h3s,
    h3Count: h3s.length,
    wordCount,
    sectionLen: sectionHtml.length
  };
}

const all = [...listToolFiles(''), ...listToolFiles('en')];
const data = all.map(analyze);

// Group by h3 signature (pattern of section names)
const sigs = {};
for (const d of data) {
  const sig = d.h3s.join(' | ') || '(no h3)';
  if (!sigs[sig]) sigs[sig] = [];
  sigs[sig].push(d.file);
}

console.log('=== TOP SECTION SIGNATURES ===');
const entries = Object.entries(sigs).sort((a, b) => b[1].length - a[1].length);
for (const [sig, files] of entries.slice(0, 20)) {
  console.log(`\n[${files.length} files]`);
  console.log(`  Sig: ${sig.slice(0, 200)}`);
  console.log(`  e.g. ${files.slice(0, 3).join(', ')}`);
}

console.log('\n=== WORD COUNT STATS ===');
const counts = data.map(d => d.wordCount).sort((a, b) => a - b);
const median = counts[Math.floor(counts.length / 2)];
const max = Math.max(...counts);
const min = Math.min(...counts);
const avg = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
console.log(`Total tools: ${data.length}, min: ${min}, median: ${median}, avg: ${avg}, max: ${max}`);

// How many have Q&A patterns
const withQA = data.filter(d => d.h3s.some(h => /Q.?&.?A|자주.+질문|Frequently|FAQ/i.test(h))).length;
console.log(`With Q&A section: ${withQA}/${data.length}`);
