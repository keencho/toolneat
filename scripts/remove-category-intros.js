// Remove AI-generated description paragraphs in tools.html category sections
// (the <div class="prose...">...</div> with intro paragraph before each tool grid).

const fs = require('fs');
const cheerio = require('cheerio');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const files = ['tools.html', 'en/tools.html'];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let removed = 0;
  // Find each category section and remove its prose div
  $('main section[id]').each((_, sec) => {
    const $sec = $(sec);
    // Find direct child <div class="prose..."> (the description, NOT the tool card descriptions)
    const $prose = $sec.children('div').filter((_, el) => {
      const cls = $(el).attr('class') || '';
      return /\bprose\b/.test(cls);
    });
    if ($prose.length) {
      $prose.remove();
      removed++;
    }
  });

  // Also remove any standalone trailing FAQ/guide sections
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const h2Text = $sec.find('h2').first().text().trim();
    if (/자주\s*묻는|Frequently Asked|FAQ$/i.test(h2Text)) {
      $sec.remove();
      removed++;
    }
  });

  if (removed > 0) {
    if (!DRY) fs.writeFileSync(f, $.html(), 'utf-8');
    console.log(f, '- removed', removed, 'description/FAQ blocks');
  } else {
    console.log(f, '- nothing to remove');
  }
}

if (DRY) console.log('(DRY)');
