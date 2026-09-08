// Remove all generic content sections from category indexes:
//   - Guide section ("...가이드", "...Guide")
//   - FAQ section ("자주 묻는 질문", "Frequently Asked Questions")
// Leave only the tool grid sections + h1.

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const files = [
  'tools.html',
  'tools/dev.html', 'tools/life.html', 'tools/pdf.html', 'tools/game.html',
  'en/tools.html',
  'en/tools/dev.html', 'en/tools/life.html', 'en/tools/pdf.html', 'en/tools/game.html'
];

const REMOVE_H2_RE = [
  /가이드$/,
  /완벽 가이드$/,
  /Guide$/i,
  /\bGuide to\b/i,
  /^The Complete Guide/i,
  /자주\s*묻는\s*질문/,
  /자주\s*하는\s*질문/,
  /Frequently Asked/i,
  /^FAQ\b/i
];

function matchesRemove(text) {
  return REMOVE_H2_RE.some(re => re.test(text.trim()));
}

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const toRemove = [];
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const h2Text = $sec.find('h2').first().text().trim();
    if (h2Text && matchesRemove(h2Text)) toRemove.push({ sec, h2: h2Text });
  });

  if (toRemove.length === 0) {
    console.log(f, '- nothing to remove');
    continue;
  }

  for (const { sec, h2 } of toRemove) {
    $(sec).remove();
  }

  if (!DRY) fs.writeFileSync(f, $.html(), 'utf-8');
  console.log(`${f} - removed: ${toRemove.map(r => `"${r.h2}"`).join(', ')}`);
}

if (DRY) console.log('(DRY)');
