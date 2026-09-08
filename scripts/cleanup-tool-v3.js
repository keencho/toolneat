// v3: process ALL content sections inside <main>, not relying on ad markers.
// A "content section" is identified by having <h2 class="text-xl font-bold"> AND
// at least one h3 matching the REMOVE patterns.

const fs = require('fs');
const path = require('path');
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

const REMOVE_PATTERNS_KO = [
  /^무엇을\s*할\s*수\s*있나요/, /^사용\s*가이드/, /^사용\s*방법/, /^추천\s*활용법/,
  /^참고\s*사항/, /^Q\s*&\s*A/, /^자주\s*묻는\s*질문/, /^자주\s*하는\s*질문/,
  /^주요\s*기능/, /^활용\s*사례/, /^팁과\s*주의사항/, /^시작하기/,
  /^기능\s*소개/, /^주의할\s*점/, /^활용\s*팁/, /^주의사항/,
  /실전\s*활용/
];
const REMOVE_PATTERNS_EN = [
  /^What Can You Do/i, /^How to Use/i, /^Usage(\s|$)/i, /^Getting Started/i,
  /^Quick Start/i, /^Feature Overview/i, /^Key Features/i, /^Recommended Uses/i,
  /^Things to (Keep|Note)/i, /^Important Notes/i, /^Notes\s*$/i, /^Tips and Notes/i,
  /^Usage Tips/i, /^Q\s*&\s*A/i, /^Frequently Asked/i, /^FAQ/i,
  /^Common Use Cases/i, /^Practical Use/i, /^Real-World/i
];

const KEEP_PATTERNS_KO = [/^관련\s*도구/, /^관련\s*블로그/, /^관련\s*글/];
const KEEP_PATTERNS_EN = [/^Related (Tools|Articles|Posts|Blog)/i, /^See Also/i];

const HOWITWORKS_KO = [/^작동\s*원리/, /^동작\s*방식/];
const HOWITWORKS_EN = [/^How It Works/i, /^How it works/i, /^Mechanism/i, /^Under the Hood/i];

const HOWITWORKS_ALT_KO = ['작동 원리', '동작 방식', '내부 동작', '어떻게 동작하나요'];
const HOWITWORKS_ALT_EN = ['How It Works', 'Under the Hood', 'The Mechanism', 'How It Operates'];

function classifyHeading(text, isKo) {
  const t = text.trim();
  if (isKo) {
    if (HOWITWORKS_KO.some(p => p.test(t))) return 'howitworks';
    if (KEEP_PATTERNS_KO.some(p => p.test(t))) return 'keep';
    if (REMOVE_PATTERNS_KO.some(p => p.test(t))) return 'remove';
  } else {
    if (HOWITWORKS_EN.some(p => p.test(t))) return 'howitworks';
    if (KEEP_PATTERNS_EN.some(p => p.test(t))) return 'keep';
    if (REMOVE_PATTERNS_EN.some(p => p.test(t))) return 'remove';
  }
  return 'unknown';
}

// Find matching </section> for an open <section> at position
function findMatchingClose(html, openEnd) {
  let depth = 1;
  let pos = openEnd;
  while (depth > 0 && pos < html.length) {
    const o = html.indexOf('<section', pos);
    const c = html.indexOf('</section>', pos);
    if (c === -1) return -1;
    if (o !== -1 && o < c) {
      depth++;
      pos = o + 8;
    } else {
      depth--;
      pos = c + 10;
    }
  }
  return pos;
}

function processSection(sectionHtml, isKo, strategy, idx) {
  // section opens with <section ...> and ends with </section>
  const openMatch = sectionHtml.match(/^<section[^>]*>/);
  if (!openMatch) return { html: sectionHtml, removed: 0, kept: 0 };
  const open = openMatch[0];
  const close = '</section>';
  const inner = sectionHtml.slice(open.length, sectionHtml.length - close.length);

  // Must have h2 to be a guide section
  const h2Match = inner.match(/<h2[^>]*>[\s\S]*?<\/h2>/);
  if (!h2Match) return { html: sectionHtml, removed: 0, kept: 0 };

  // Split inner into: [pre-h2][h2][post-h2]
  const preH2 = inner.slice(0, h2Match.index);
  const h2Html = h2Match[0];
  const postH2 = inner.slice(h2Match.index + h2Html.length);

  // Within postH2, find the wrapper (typically <div class="prose ...">...</div>)
  // We'll work on postH2 directly: split by h3
  const h3Re = /<h3[^>]*>[\s\S]*?<\/h3>/g;
  const h3Matches = [...postH2.matchAll(h3Re)];

  // Need at least one removable h3 to bother
  let hasRemove = false;
  let hasH4Style = false; // Section might use h4 for Q-style (skip these as Q&A)
  for (const m of h3Matches) {
    const txt = m[0].replace(/<[^>]+>/g, '').trim();
    if (classifyHeading(txt, isKo) === 'remove') {
      hasRemove = true;
      break;
    }
  }
  // Also check h4 style FAQs that some pages use directly (h3 = question text)
  // For sections like character-counter mt-10 wrapper which has h3=question
  // Heuristic: if a section has MANY h3 (>= 5) and none classify as known, treat as FAQ-style → remove section entirely
  if (!hasRemove) {
    const unknownCount = h3Matches.filter(m => {
      const t = m[0].replace(/<[^>]+>/g, '').trim();
      return classifyHeading(t, isKo) === 'unknown';
    }).length;
    // Heuristic: 4+ unknown h3s (questions) → templated FAQ
    if (unknownCount >= 4 && unknownCount === h3Matches.length) {
      // Treat all as remove (it's a Q&A pretending to be h3 questions)
      hasH4Style = true;
      hasRemove = true;
    }
  }
  if (!hasRemove) return { html: sectionHtml, removed: 0, kept: 0 };

  // Now split: get preamble + h3 blocks
  const blocks = [];
  let preamble = postH2;
  if (h3Matches.length > 0) {
    preamble = postH2.slice(0, h3Matches[0].index);
    for (let i = 0; i < h3Matches.length; i++) {
      const start = h3Matches[i].index;
      const end = i + 1 < h3Matches.length ? h3Matches[i + 1].index : postH2.length;
      const headerHtml = h3Matches[i][0];
      const fullHtml = postH2.slice(start, end);
      const headerText = headerHtml.replace(/<[^>]+>/g, '').trim();
      blocks.push({ headerHtml, headerText, fullHtml });
    }
  }

  // Decide what to keep
  let removed = 0;
  let kept = 0;
  let keptInnerHtml = preamble;

  // If h4-style FAQ section: keep only the h2+preamble, drop ALL h3 blocks
  if (hasH4Style) {
    removed = blocks.length;
    // BUT: also keep blocks classified as keep/howitworks
    for (const b of blocks) {
      const cls = classifyHeading(b.headerText, isKo);
      if (cls === 'keep') {
        keptInnerHtml += b.fullHtml;
        kept++;
        removed--;
      } else if (cls === 'howitworks') {
        if (strategy === 0 || strategy === 3) {
          keptInnerHtml += b.fullHtml;
          kept++;
          removed--;
        } else if (strategy === 1) {
          const alts = isKo ? HOWITWORKS_ALT_KO : HOWITWORKS_ALT_EN;
          const altText = alts[(Math.floor(idx / 4)) % alts.length];
          const newHeader = b.headerHtml.replace(/>[\s\S]*?<\/h3>/, '>' + altText + '</h3>');
          keptInnerHtml += newHeader + b.fullHtml.slice(b.headerHtml.length);
          kept++;
          removed--;
        }
        // strategy 2 drops howitworks
      }
    }
  } else {
    let introTaken = false;
    let howitworksTaken = false;
    for (const b of blocks) {
      const cls = classifyHeading(b.headerText, isKo);
      if (cls === 'remove') {
        removed++;
      } else if (cls === 'keep') {
        keptInnerHtml += b.fullHtml;
        kept++;
      } else if (cls === 'howitworks') {
        if (howitworksTaken) {
          removed++;
        } else {
          howitworksTaken = true;
          if (strategy === 0 || strategy === 3) {
            keptInnerHtml += b.fullHtml;
            kept++;
          } else if (strategy === 1) {
            const alts = isKo ? HOWITWORKS_ALT_KO : HOWITWORKS_ALT_EN;
            const altText = alts[(Math.floor(idx / 4)) % alts.length];
            const newHeader = b.headerHtml.replace(/>[\s\S]*?<\/h3>/, '>' + altText + '</h3>');
            keptInnerHtml += newHeader + b.fullHtml.slice(b.headerHtml.length);
            kept++;
          } else {
            // strategy 2: drop
            removed++;
          }
        }
      } else {
        // unknown — treat first one as intro/keep, rest as remove
        if (!introTaken) {
          introTaken = true;
          keptInnerHtml += b.fullHtml;
          kept++;
        } else {
          removed++;
        }
      }
    }
  }

  const newInner = preH2 + h2Html + keptInnerHtml;
  return { html: open + newInner + close, removed, kept };
}

function rewriteFile(filePath, idx) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');

  // Find <main> and </main>
  const mainOpenMatch = html.match(/<main[^>]*>/);
  if (!mainOpenMatch) return { skipped: 'no main' };
  const mainStart = mainOpenMatch.index + mainOpenMatch[0].length;
  const mainEnd = html.indexOf('</main>', mainStart);
  if (mainEnd === -1) return { skipped: 'no main close' };

  const mainHtml = html.slice(mainStart, mainEnd);

  // Find all top-level <section class="mt-..."> inside main
  const sectionStartRe = /<section class="mt-\d+[^"]*">/g;
  const sections = [];
  let m;
  while ((m = sectionStartRe.exec(mainHtml)) !== null) {
    const openEnd = m.index + m[0].length;
    const closeEnd = findMatchingClose(mainHtml, openEnd);
    if (closeEnd === -1) continue;
    sections.push({ start: m.index, end: closeEnd, html: mainHtml.slice(m.index, closeEnd) });
    sectionStartRe.lastIndex = closeEnd;
  }

  if (sections.length === 0) return { skipped: 'no sections' };

  const strategy = idx % 4;

  // Process each section, build new mainHtml
  let newMain = '';
  let lastIdx = 0;
  let totalRemoved = 0;
  let totalKept = 0;
  let touchedAny = false;
  for (const s of sections) {
    const { html: newSec, removed, kept } = processSection(s.html, isKo, strategy, idx);
    newMain += mainHtml.slice(lastIdx, s.start);
    newMain += newSec;
    lastIdx = s.end;
    if (removed > 0) {
      touchedAny = true;
      totalRemoved += removed;
      totalKept += kept;
    }
  }
  newMain += mainHtml.slice(lastIdx);

  if (!touchedAny) return { skipped: 'nothing to remove' };

  const newHtml = html.slice(0, mainStart) + newMain + html.slice(mainEnd);
  if (newHtml === html) return { skipped: 'no change' };

  if (!DRY_RUN) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return {
    ok: true,
    strategy,
    removed: totalRemoved,
    kept: totalKept,
    sizeDiff: newHtml.length - html.length
  };
}

const files = SINGLE_TARGET ? [path.resolve(SINGLE_TARGET)] : listToolFiles();
const stats = { ok: 0, skipped: {}, byStrategy: {}, totalRemoved: 0 };
const samples = [];
for (let i = 0; i < files.length; i++) {
  const r = rewriteFile(files[i], i);
  if (r.ok) {
    stats.ok++;
    stats.byStrategy[r.strategy] = (stats.byStrategy[r.strategy] || 0) + 1;
    stats.totalRemoved += r.removed;
    if (SINGLE_TARGET || samples.length < 10) {
      samples.push({ f: path.relative(ROOT, files[i]), ...r });
    }
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
  }
}
console.log('--- Samples ---');
for (const s of samples) console.log(JSON.stringify(s));
console.log('\n--- Stats ---');
console.log(JSON.stringify(stats, null, 2));
console.log(`Total: ${files.length}`);
if (DRY_RUN) console.log('(DRY RUN - no files written)');
