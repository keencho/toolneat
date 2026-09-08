// v4: surgical h3-block deletion (preserves all wrapper HTML around content).
// For each section that contains REMOVE patterns, identify each h3 block's
// [start, end) range and delete it. Do NOT rebuild the section from scratch.

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
  /^무엇을\s*할\s*수\s*있나요/, /^사용\s*가이드/, /^사용\s*방법/, /^이용\s*가이드/,
  /^추천\s*활용법/, /^참고\s*사항/, /^Q\s*&\s*A/, /^자주\s*묻는\s*질문/,
  /^자주\s*하는\s*질문/, /^궁금한\s*점/, /^주요\s*기능/, /^핵심\s*기능/,
  /^활용\s*사례/, /^활용\s*상황/, /^이런\s*상황/, /^팁과\s*주의사항/,
  /^시작하기/, /^기능\s*소개/, /^주의할\s*점/, /^활용\s*팁/,
  /^주의사항/, /^알아두면/, /실전\s*활용/
];
const REMOVE_PATTERNS_EN = [
  /^What Can You Do/i, /^How to Use/i, /^Usage(\s|$)/i, /^Getting Started/i,
  /^Quick Start/i, /^Feature Overview/i, /^Key Features/i, /^Main Features/i,
  /^Recommended Uses/i, /^Things to (Keep|Note)/i, /^Important Notes/i,
  /^Notes\s*$/i, /^Tips and Notes/i, /^Usage Tips/i, /^Q\s*&\s*A/i,
  /^Frequently Asked/i, /^FAQ/i, /^Common Use Cases/i, /^Practical Use/i,
  /^Real-World/i, /^Good to Know/i, /^Use Cases/i
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

// Within a section's HTML, find h3 blocks (h3 tag start → next h3 or before section close)
function findH3Blocks(sectionHtml) {
  // section opening
  const openMatch = sectionHtml.match(/^<section[^>]*>/);
  const openLen = openMatch[0].length;

  const h3Re = /<h3[^>]*>[\s\S]*?<\/h3>/g;
  const matches = [];
  let m;
  while ((m = h3Re.exec(sectionHtml)) !== null) {
    matches.push({ index: m.index, header: m[0] });
  }

  if (matches.length === 0) return [];

  // Determine end of each h3 block
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    // End: start of next h3, or position before any trailing </div></section> wrapper
    let end;
    if (i + 1 < matches.length) {
      end = matches[i + 1].index;
    } else {
      // Last h3: end at... we want to keep wrapper closing tags.
      // Find the LAST occurrence in sectionHtml of '</div>' before '</section>'
      // Actually safer: end at next h2 OR at position right before final wrapper closes.
      // Simplest: end at <h2 if any after; else at the position where <div></section> wrapper closes start.
      // Use: end = sectionHtml.lastIndexOf('</div>') — but only the LAST </div> belongs to outer wrapper.
      // Actually safer: find first occurrence of </div>\n     </section> or similar.
      // We'll search backwards from the section close for the wrapper close pattern.
      const sectionCloseIdx = sectionHtml.lastIndexOf('</section>');
      // Find the </div> that closes the prose wrapper (assume one </div> just before </section>)
      const beforeClose = sectionHtml.slice(0, sectionCloseIdx);
      const lastDivClose = beforeClose.lastIndexOf('</div>');
      if (lastDivClose !== -1 && lastDivClose > start) {
        end = lastDivClose;
      } else {
        end = sectionCloseIdx;
      }
    }
    blocks.push({
      start,
      end,
      header: matches[i].header,
      headerText: matches[i].header.replace(/<[^>]+>/g, '').trim()
    });
  }
  return blocks;
}

function processSection(sectionHtml, isKo, strategy, idx) {
  // Skip if no h2
  if (!/<h2[^>]*>/.test(sectionHtml)) return { html: sectionHtml, removed: 0 };

  const blocks = findH3Blocks(sectionHtml);
  if (blocks.length === 0) return { html: sectionHtml, removed: 0 };

  // Classify
  const classes = blocks.map(b => classifyHeading(b.headerText, isKo));

  // Determine which blocks to remove
  const toRemove = new Set();
  let removeCount = 0;
  let unknownCount = 0;
  let knownCount = 0;
  classes.forEach((c, i) => {
    if (c === 'remove') removeCount++;
    else if (c === 'unknown') unknownCount++;
    else knownCount++;
  });

  // Heuristic: if section has no remove matches BUT has 4+ unknown headings (FAQ-as-h3)
  const allUnknownFaqStyle = removeCount === 0 && unknownCount >= 4 && knownCount === 0;

  // First unknown block could be intro — protect it ONLY if there are not too many unknowns
  let firstUnknownIdx = -1;
  for (let i = 0; i < classes.length; i++) {
    if (classes[i] === 'unknown') { firstUnknownIdx = i; break; }
  }

  let howitworksHandled = false;

  for (let i = 0; i < blocks.length; i++) {
    const c = classes[i];
    if (c === 'remove') {
      toRemove.add(i);
    } else if (c === 'howitworks') {
      if (howitworksHandled) {
        toRemove.add(i); // duplicate
      } else {
        howitworksHandled = true;
        // strategy 0,3: keep as-is
        // strategy 1: rename
        // strategy 2: drop
        if (strategy === 2) toRemove.add(i);
      }
    } else if (c === 'keep') {
      // always keep
    } else if (c === 'unknown') {
      if (allUnknownFaqStyle) {
        // Drop all unknown (templated FAQ pattern)
        toRemove.add(i);
      } else if (i === firstUnknownIdx && removeCount > 0) {
        // First unknown serves as intro — keep
      } else {
        // Other unknown blocks: drop (still templated)
        toRemove.add(i);
      }
    }
  }

  // No removes? Skip
  if (toRemove.size === 0) return { html: sectionHtml, removed: 0 };

  // Build deletion ranges and apply (from end to start to preserve indices)
  const ranges = [];
  for (const i of toRemove) {
    ranges.push({ start: blocks[i].start, end: blocks[i].end });
  }
  // Also collect rename operations (for strategy 1)
  const renames = [];
  if (strategy === 1) {
    for (let i = 0; i < blocks.length; i++) {
      if (classes[i] === 'howitworks' && !toRemove.has(i)) {
        const alts = isKo ? HOWITWORKS_ALT_KO : HOWITWORKS_ALT_EN;
        const altText = alts[(Math.floor(idx / 4)) % alts.length];
        const newHeader = blocks[i].header.replace(/>[\s\S]*?<\/h3>/, '>' + altText + '</h3>');
        renames.push({ start: blocks[i].start, end: blocks[i].start + blocks[i].header.length, replacement: newHeader });
      }
    }
  }

  // Apply: process all edits sorted by start desc
  const edits = [
    ...ranges.map(r => ({ ...r, type: 'delete' })),
    ...renames.map(r => ({ ...r, type: 'replace' }))
  ].sort((a, b) => b.start - a.start);

  let newHtml = sectionHtml;
  for (const e of edits) {
    if (e.type === 'delete') {
      newHtml = newHtml.slice(0, e.start) + newHtml.slice(e.end);
    } else if (e.type === 'replace') {
      newHtml = newHtml.slice(0, e.start) + e.replacement + newHtml.slice(e.end);
    }
  }

  return { html: newHtml, removed: toRemove.size };
}

function rewriteFile(filePath, idx) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');

  const mainOpenMatch = html.match(/<main[^>]*>/);
  if (!mainOpenMatch) return { skipped: 'no main' };
  const mainStart = mainOpenMatch.index + mainOpenMatch[0].length;
  const mainEnd = html.indexOf('</main>', mainStart);
  if (mainEnd === -1) return { skipped: 'no main close' };

  const mainHtml = html.slice(mainStart, mainEnd);

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
  let newMain = '';
  let lastIdx = 0;
  let totalRemoved = 0;
  for (const s of sections) {
    const { html: newSec, removed } = processSection(s.html, isKo, strategy, idx);
    newMain += mainHtml.slice(lastIdx, s.start) + newSec;
    lastIdx = s.end;
    totalRemoved += removed;
  }
  newMain += mainHtml.slice(lastIdx);

  if (totalRemoved === 0) return { skipped: 'nothing to remove' };

  const newHtml = html.slice(0, mainStart) + newMain + html.slice(mainEnd);
  if (newHtml === html) return { skipped: 'no change' };

  if (!DRY_RUN) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { ok: true, strategy, removed: totalRemoved, sizeDiff: newHtml.length - html.length };
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
if (DRY_RUN) console.log('(DRY RUN)');
