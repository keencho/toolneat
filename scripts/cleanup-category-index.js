// Cleanup category index pages: vary FAQ presence
// Half trim to 2 questions, half remove entirely.

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const DRY = process.argv.includes('--dry');

const files = [
  'tools.html',
  'tools/dev.html',
  'tools/life.html',
  'tools/pdf.html',
  'tools/game.html',
  'en/tools.html',
  'en/tools/dev.html',
  'en/tools/life.html',
  'en/tools/pdf.html',
  'en/tools/game.html'
];

const FAQ_RE = /^자주\s*묻는\s*질문|^Frequently Asked Questions/;

function removeH2Block($, $h) {
  const elements = [$h.get(0)];
  let $next = $h.next();
  while ($next.length) {
    const tag = $next.get(0).tagName ? $next.get(0).tagName.toLowerCase() : '';
    if (tag === 'h2') break;
    elements.push($next.get(0));
    $next = $next.next();
  }
  for (const e of elements) $(e).remove();
}

const stats = { removed: 0, trimmed: 0 };
for (let i = 0; i < files.length; i++) {
  const filePath = path.join(ROOT, files[i]);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });
  const $faqH2 = $('main h2').filter((_, h) => FAQ_RE.test($(h).text().trim())).first();
  if ($faqH2.length === 0) {
    console.log('SKIP', files[i], '(no FAQ)');
    continue;
  }
  const action = i % 2 === 0 ? 'remove' : 'trim';
  if (action === 'remove') {
    removeH2Block($, $faqH2);
    stats.removed++;
  } else {
    // Trim to 2 items. FAQ container is usually next sibling div.space-y-N
    const $container = $faqH2.next();
    if ($container.length && $container.is('div')) {
      const $items = $container.children();
      if ($items.length > 2) {
        $items.slice(2).remove();
        stats.trimmed++;
      } else {
        console.log('SKIP-TRIM', files[i], '(FAQ already small)');
        continue;
      }
    } else {
      console.log('SKIP-TRIM', files[i], '(no container)');
      continue;
    }
  }
  const newHtml = $.html();
  if (!DRY) fs.writeFileSync(filePath, newHtml, 'utf-8');
  console.log(action.toUpperCase(), files[i]);
}

console.log('\nStats:', stats);
if (DRY) console.log('(DRY)');
