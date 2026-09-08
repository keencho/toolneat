// Trim category index guide sections to just h2 + first paragraph.
// Removes templated h3 blocks across categories.
// Also removes leftover empty FAQ section wrappers.

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const files = [
  'tools/dev.html', 'tools/life.html', 'tools/pdf.html', 'tools/game.html',
  'en/tools/dev.html', 'en/tools/life.html', 'en/tools/pdf.html', 'en/tools/game.html'
];

function removeH3Block($, $h) {
  const elements = [$h.get(0)];
  let $next = $h.next();
  while ($next.length) {
    const tag = $next.get(0).tagName ? $next.get(0).tagName.toLowerCase() : '';
    if (tag === 'h3' || tag === 'h2') break;
    elements.push($next.get(0));
    $next = $next.next();
  }
  for (const e of elements) $(e).remove();
}

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  // Find the FIRST section in main (this is the guide section)
  const $guide = $('main section').first();
  if (!$guide.length) {
    console.log(f, '- no guide section');
    continue;
  }

  const h3CountBefore = $guide.find('h3').length;
  if (h3CountBefore === 0) {
    console.log(f, '- already clean');
    continue;
  }

  // Remove all h3 blocks inside this section
  let removed = 0;
  while (true) {
    const $h = $guide.find('h3').first();
    if (!$h.length) break;
    removeH3Block($, $h);
    removed++;
  }

  // Also clean up any leftover empty divs / hrs
  $guide.find('div').each((_, d) => {
    const $d = $(d);
    if ($d.children().length === 0 && $d.text().trim() === '') $d.remove();
  });
  $guide.find('hr').each((_, h) => {
    const $h = $(h);
    if (!$h.next().length || $h.prev().is('hr')) $h.remove();
  });

  // Also remove EMPTY FAQ-style sections elsewhere in main
  let emptyRemoved = 0;
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const text = $sec.text().trim();
    const meaningfulEls = $sec.find('p, h2, h3, ul, ol, table, a, img').filter((_, el) => $(el).text().trim() !== '' || $(el).is('img')).length;
    if (text.length < 50 && meaningfulEls < 2) {
      $sec.remove();
      emptyRemoved++;
    }
  });

  const newHtml = $.html();
  if (!DRY) fs.writeFileSync(f, newHtml, 'utf-8');
  console.log(f, '- removed', removed, 'h3 blocks +', emptyRemoved, 'empty sections');
}

if (DRY) console.log('(DRY)');
