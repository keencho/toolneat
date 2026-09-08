// Remove empty section wrappers that became hollow after FAQ removal.

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const files = [
  'tools.html', 'tools/dev.html', 'tools/life.html', 'tools/pdf.html', 'tools/game.html',
  'en/tools.html', 'en/tools/dev.html', 'en/tools/life.html', 'en/tools/pdf.html', 'en/tools/game.html',
];

let totalRemoved = 0;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let removed = 0;
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const text = $sec.text().trim();
    const meaningfulEls = $sec.find('p, h2, h3, ul, ol, table, a, img').filter((_, el) => $(el).text().trim() !== '' || $(el).is('img')).length;
    if (text.length < 50 && meaningfulEls < 2) {
      $sec.remove();
      removed++;
    }
  });

  if (removed > 0) {
    const newHtml = $.html();
    if (!DRY) fs.writeFileSync(f, newHtml, 'utf-8');
    console.log(f, '- removed', removed, 'empty section(s)');
    totalRemoved += removed;
  }
}

// Also check tool pages
function listToolFiles() {
  const out = [];
  for (const lang of ['', 'en']) for (const cat of ['dev', 'life', 'pdf', 'game']) {
    const d = path.join('.', lang, 'tools', cat);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(d, f));
  }
  return out;
}

for (const f of listToolFiles()) {
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });
  let removed = 0;
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const cls = $sec.attr('class') || '';
    // Only target content sections (not tool UI sections)
    if (!/\b(mt|mb|my)-\d+/.test(cls)) return;
    const text = $sec.text().trim();
    const meaningfulEls = $sec.find('p, h2, h3, ul, ol, table, a').filter((_, el) => $(el).text().trim() !== '').length;
    if (text.length < 30 && meaningfulEls < 1) {
      $sec.remove();
      removed++;
    }
  });
  if (removed > 0) {
    const newHtml = $.html();
    if (!DRY) fs.writeFileSync(f, newHtml, 'utf-8');
    console.log(f, '- removed', removed, 'empty section(s)');
    totalRemoved += removed;
  }
}

console.log('\nTotal empty sections removed:', totalRemoved);
if (DRY) console.log('(DRY)');
