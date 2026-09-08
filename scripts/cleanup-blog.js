// Blog cleanup:
//   - Remove "padding" h2 sections (those between conclusion and FAQ)
//   - Vary FAQ section per blog index:
//       0: keep as-is
//       1: trim to first 2 questions
//       2: remove FAQ entirely

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry');
const SINGLE = args.find(a => !a.startsWith('-')) || null;

function list() {
  const out = [];
  for (const lang of ['', 'en']) {
    const d = path.join(ROOT, lang, 'blog');
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d))
      if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(d, f));
  }
  return out;
}

const FAQ_PATTERNS = [/자주.+질문/, /자주\s*하는\s*질문/i, /Frequently Asked/i, /^FAQ/i];
const CONC_PATTERNS = [/^마무리$/, /^마치며$/, /^정리하면/, /^결론$/, /^Conclusion/i, /^Summary($|\s)/i, /^Wrapping/i];

function isFaq(t) { return FAQ_PATTERNS.some(p => p.test(t.trim())); }
function isConc(t) { return CONC_PATTERNS.some(p => p.test(t.trim())); }

// Remove an h2 and all sibling content until next h2 or end of parent
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

function processFile(filePath, idx) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });
  const $article = $('main article').first();
  if ($article.length === 0) return { skipped: 'no article' };
  // Search h2 list across whole article (FAQ may live outside prose wrapper).
  const root = $article;

  let removed = 0;

  // Identify h2 list
  const h2s = root.find('h2').map((_, h) => ({ el: h, text: $(h).text().trim() })).get();
  if (h2s.length === 0) return { skipped: 'no h2' };

  // 1. Remove padding h2s (between conclusion and FAQ)
  const concIdx = h2s.findIndex(x => isConc(x.text));
  const faqIdx = h2s.findIndex(x => isFaq(x.text));

  let paddingRemovedCount = 0;
  if (concIdx >= 0) {
    const paddingEnd = faqIdx > concIdx ? faqIdx : h2s.length;
    // Remove h2s in range (concIdx+1, paddingEnd)
    for (let i = paddingEnd - 1; i > concIdx; i--) {
      removeH2Block($, $(h2s[i].el));
      paddingRemovedCount++;
    }
  }

  // 2. Handle FAQ based on strategy
  // Re-find FAQ since removeH2Block may have shifted indices
  const $faqH2 = root.find('h2').filter((_, h) => isFaq($(h).text().trim())).first();
  let faqAction = 'none';
  if ($faqH2.length > 0) {
    const strategy = idx % 3;
    if (strategy === 2) {
      // remove FAQ entirely
      removeH2Block($, $faqH2);
      faqAction = 'removed';
      removed++;
    } else if (strategy === 1) {
      // trim FAQ to first 2 questions
      // Find the FAQ container (typically the next div.space-y-N or similar)
      const $container = $faqH2.next();
      if ($container.length && $container.is('div')) {
        const $items = $container.children();
        if ($items.length > 2) {
          $items.slice(2).remove();
          faqAction = 'trimmed';
          removed++;
        }
      }
    }
    // strategy 0: keep as-is
  }

  const result = { paddingRemoved: paddingRemovedCount, faqAction };
  if (paddingRemovedCount === 0 && faqAction === 'none') {
    return { skipped: 'no change needed', ...result };
  }

  const newHtml = $.html();
  if (newHtml === html) return { skipped: 'no diff', ...result };
  if (!DRY_RUN) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { ok: true, strategy: idx % 3, sizeDiff: newHtml.length - html.length, ...result };
}

const files = SINGLE ? [path.resolve(SINGLE)] : list();
const stats = { ok: 0, skipped: {}, byStrategy: {}, paddingRemoved: 0, faqRemoved: 0, faqTrimmed: 0 };
const samples = [];
for (let i = 0; i < files.length; i++) {
  const r = processFile(files[i], i);
  if (r.ok) {
    stats.ok++;
    stats.byStrategy[r.strategy] = (stats.byStrategy[r.strategy] || 0) + 1;
    stats.paddingRemoved += r.paddingRemoved;
    if (r.faqAction === 'removed') stats.faqRemoved++;
    if (r.faqAction === 'trimmed') stats.faqTrimmed++;
    if (SINGLE || samples.length < 8) samples.push({ f: path.relative(ROOT, files[i]), ...r });
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
  }
}
console.log('--- Samples ---');
samples.forEach(s => console.log(JSON.stringify(s)));
console.log('\n--- Stats ---');
console.log(JSON.stringify(stats, null, 2));
console.log(`Total: ${files.length}`);
if (DRY_RUN) console.log('(DRY)');
