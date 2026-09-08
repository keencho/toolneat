// v5: cheerio-based DOM cleanup. Safely removes templated h3 blocks.
//
// Per page strategy (idx % 4):
//   0,3: keep howitworks heading as-is
//   1: rename howitworks heading to alternative
//   2: drop howitworks too (intro + related only)
//
// Within each <section class="mt-..."> that has h2 + h3 list, classify each h3:
//   - 'remove': templated heading (Q&A, 사용 가이드, 추천 활용법, etc.)
//   - 'keep': 관련 도구 / 관련 블로그 / Related Tools / etc.
//   - 'howitworks': 작동 원리 / How It Works
//   - 'unknown': first becomes intro (if other removes exist), rest dropped.
// If section has 4+ unknown h3s and 0 known: treat as Q&A-as-h3 (drop all unknowns).

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry');
const SINGLE_TARGET = args.find(a => !a.startsWith('-')) || null;

function listToolFiles() {
  const out = [];
  for (const lang of ['', 'en']) {
    for (const cat of ['dev', 'life', 'pdf', 'game']) {
      const dir = path.join(ROOT, lang, 'tools', cat);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(dir, f));
      }
    }
  }
  return out;
}

const REMOVE_KO = [
  /^무엇을\s*할\s*수\s*있나요/, /^사용\s*가이드/, /^사용\s*방법/, /^이용\s*가이드/,
  /^추천\s*활용법/, /^참고\s*사항/, /^Q\s*&\s*A/, /^자주\s*묻는\s*질문/,
  /^자주\s*하는\s*질문/, /^궁금한\s*점/, /^주요\s*기능/, /^핵심\s*기능/,
  /^활용\s*사례/, /^활용\s*상황/, /^이런\s*상황/, /^팁과\s*주의사항/,
  /^시작하기/, /^기능\s*소개/, /^주의할\s*점/, /^활용\s*팁/,
  /^주의사항/, /^알아두면/, /실전\s*활용/
];
const REMOVE_EN = [
  /^What Can You Do/i, /^How to Use/i, /^Usage(\s|$)/i, /^Getting Started/i,
  /^Quick Start/i, /^Feature Overview/i, /^Key Features/i, /^Main Features/i,
  /^Recommended Uses/i, /^Things to (Keep|Note)/i, /^Important Notes/i,
  /^Notes\s*$/i, /^Tips and Notes/i, /^Usage Tips/i, /^Q\s*&\s*A/i,
  /^Frequently Asked/i, /^FAQ/i, /^Common Use Cases/i, /^Practical Use/i,
  /^Real-World/i, /^Good to Know/i, /^Use Cases/i
];

const KEEP_KO = [/^관련\s*도구/, /^관련\s*블로그/, /^관련\s*글/];
const KEEP_EN = [/^Related (Tools|Articles|Posts|Blog)/i, /^See Also/i];

const HOW_KO = [/^작동\s*원리/, /^동작\s*방식/];
const HOW_EN = [/^How It Works/i, /^How it works/i, /^Mechanism/i, /^Under the Hood/i];

const HOW_ALT_KO = ['작동 원리', '동작 방식', '내부 동작', '어떻게 동작하나요'];
const HOW_ALT_EN = ['How It Works', 'Under the Hood', 'The Mechanism', 'How It Operates'];

function classify(text, isKo) {
  const t = text.trim();
  if (isKo) {
    if (HOW_KO.some(p => p.test(t))) return 'howitworks';
    if (KEEP_KO.some(p => p.test(t))) return 'keep';
    if (REMOVE_KO.some(p => p.test(t))) return 'remove';
  } else {
    if (HOW_EN.some(p => p.test(t))) return 'howitworks';
    if (KEEP_EN.some(p => p.test(t))) return 'keep';
    if (REMOVE_EN.some(p => p.test(t))) return 'remove';
  }
  return 'unknown';
}

function processFile(filePath, idx) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');

  const $ = cheerio.load(html, { decodeEntities: false });

  // Find all <section> inside <main> whose class starts with "mt-"
  let totalRemoved = 0;
  const strategy = idx % 4;

  $('main section').each((_, sec) => {
    const $sec = $(sec);
    const cls = $sec.attr('class') || '';
    // Match content card sections: mt-N, mb-N, my-N margin classes.
    if (!/\b(mt|mb|my)-\d+/.test(cls)) return;
    // Must have at least one h3 anywhere within
    const $h3s = $sec.find('h3');
    if ($h3s.length === 0) return;

    // Classify h3s
    const items = [];
    $h3s.each((i, h) => {
      const text = $(h).text().trim();
      items.push({ el: h, text, cls: classify(text, isKo), idx: i });
    });

    const removeCount = items.filter(x => x.cls === 'remove').length;
    const keepCount = items.filter(x => x.cls === 'keep').length;
    const howCount = items.filter(x => x.cls === 'howitworks').length;
    const unknownCount = items.filter(x => x.cls === 'unknown').length;
    // All h3s are FAQ-style questions and there are 4+ of them → drop whole section
    const allUnknownFaqStyle =
      removeCount === 0 && keepCount === 0 && howCount === 0 &&
      unknownCount >= 4 && unknownCount === items.filter(x => /[?？]\s*$/.test(x.text)).length;

    // Count question-style unknowns (Q-as-h3 FAQ pattern)
    const questionUnknownCount = items.filter(x =>
      x.cls === 'unknown' && /[?？]\s*$/.test(x.text)
    ).length;

    // Process if: has remove patterns, OR has question-style FAQ unknowns
    const shouldProcess = removeCount > 0 || questionUnknownCount >= 2;
    if (!shouldProcess) return;

    // If section has NO 'keep' h3 AND has only templated content
    // (remove + unknown-as-FAQ, no real intro), drop the entire section.
    // Heuristic: section is "all-templated" if no 'keep' headings AND
    //   - allUnknownFaqStyle (Q&A-as-h3 only), OR
    //   - the h2 itself looks like a templated wrapper title (we can't easily detect)
    // For now: only drop section if allUnknownFaqStyle and no h2 paragraph content
    if (allUnknownFaqStyle && keepCount === 0) {
      // Check if section has meaningful content outside of h3 blocks
      // Simple check: if section's text length minus h3 text isn't much
      $sec.remove();
      totalRemoved += unknownCount;
      return;
    }

    // Find first unknown idx (for intro protection)
    const firstUnknownIdx = items.findIndex(x => x.cls === 'unknown');
    let howHandled = false;

    for (const it of items) {
      const $h = $(it.el);
      if (it.cls === 'remove') {
        removeH3Block($, $h);
        totalRemoved++;
      } else if (it.cls === 'howitworks') {
        if (howHandled) {
          removeH3Block($, $h);
          totalRemoved++;
        } else {
          howHandled = true;
          if (strategy === 2) {
            removeH3Block($, $h);
            totalRemoved++;
          } else if (strategy === 1) {
            const alts = isKo ? HOW_ALT_KO : HOW_ALT_EN;
            // Skip index 0 (default name) so we always actually rename
            const altIdx = 1 + (Math.floor(idx / 4) % (alts.length - 1));
            $h.text(alts[altIdx]);
          }
        }
      } else if (it.cls === 'unknown') {
        // Drop question-style unknown h3s only when section has 3+ of them
        // (i.e., it's a Q&A-as-h3 FAQ template, not a single intro question).
        const isQuestion = /[?？]\s*$/.test(it.text);
        if (isQuestion && questionUnknownCount >= 3) {
          removeH3Block($, $h);
          totalRemoved++;
        }
        // else: keep (tool-specific intro or content section)
      }
    }
  });

  // Clean up orphaned empty wrappers in remaining sections
  $('main section').each((_, sec) => {
    const $sec = $(sec);
    // Find <hr> with empty siblings — remove standalone <hr>s that lost their context
    $sec.find('div').each((_, d) => {
      const $d = $(d);
      // Remove empty divs (no children, no text)
      if ($d.children().length === 0 && $d.text().trim() === '') {
        $d.remove();
      }
    });
    // Remove orphan <hr> tags after cleanup
    $sec.find('hr').each((_, h) => {
      const $h = $(h);
      const $next = $h.next();
      // If next sibling is empty or also hr, remove this hr
      if ($next.length === 0) $h.remove();
    });
    // Second pass: empty space-y wrappers
    $sec.find('div').each((_, d) => {
      const $d = $(d);
      if ($d.children().length === 0 && $d.text().trim() === '') {
        $d.remove();
      }
    });
    // If section now has only an h2 and no other content, drop it
    const meaningfulChildren = $sec.find('p, h3, h4, ul, ol, table, div').filter((_, el) => {
      return $(el).text().trim() !== '';
    });
    if (meaningfulChildren.length === 0 && $sec.find('h2').length > 0) {
      // Has h2 but no other content — might be just a title. Drop section.
      $sec.remove();
    }
  });

  if (totalRemoved === 0) return { skipped: 'nothing to remove' };

  const newHtml = $.html();
  if (newHtml === html) return { skipped: 'no change' };

  if (!DRY_RUN) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { ok: true, strategy, removed: totalRemoved, sizeDiff: newHtml.length - html.length };
}

// Remove an h3 element AND its content. Handles two patterns:
//   (a) flat: h3 + sibling p/ul/etc until next h3/h2 → remove all
//   (b) wrapped: h3 inside <div> wrapper with answer p → remove wrapper div
function removeH3Block($, $h) {
  const $parent = $h.parent();
  const parentTag = $parent.get(0) && $parent.get(0).tagName ? $parent.get(0).tagName.toLowerCase() : '';
  const siblingCount = $parent.children().length;

  // Pattern (b): h3 is inside a small div containing only this h3 + a few answer elements
  // and the div is a sibling of other similar Q&A divs.
  // Detect: parent is <div>, parent has <= 3 children, first child is this h3.
  if (parentTag === 'div' && siblingCount <= 3 && $parent.children().first().get(0) === $h.get(0)) {
    // Check if grandparent is a list-style wrapper (space-y-N, divide-y, etc.) or has multiple similar children
    const $grand = $parent.parent();
    if ($grand.length) {
      // Remove preceding <hr> if any
      const $prevHr = $parent.prev();
      if ($prevHr.is('hr')) $prevHr.remove();
      $parent.remove();
      return;
    }
  }

  // Pattern (a): flat sibling removal
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

const files = SINGLE_TARGET ? [path.resolve(SINGLE_TARGET)] : listToolFiles();
const stats = { ok: 0, skipped: {}, byStrategy: {}, totalRemoved: 0 };
const samples = [];
for (let i = 0; i < files.length; i++) {
  const r = processFile(files[i], i);
  if (r.ok) {
    stats.ok++;
    stats.byStrategy[r.strategy] = (stats.byStrategy[r.strategy] || 0) + 1;
    stats.totalRemoved += r.removed;
    if (SINGLE_TARGET || samples.length < 10) samples.push({ f: path.relative(ROOT, files[i]), ...r });
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
  }
}
console.log('--- Samples ---');
for (const s of samples) console.log(JSON.stringify(s));
console.log('\n--- Stats ---');
console.log(JSON.stringify(stats, null, 2));
console.log(`Total: ${files.length}`);
if (DRY_RUN) console.log('(DRY)');
