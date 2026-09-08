// Surgical cleanup: remove templated h3 blocks from tool pages.
// Keeps: first h3 (intro), 작동 원리/How It Works, 관련 도구, 관련 블로그
// Removes: 무엇을 할 수 있나요, 사용 가이드, 추천 활용법, 참고사항, Q&A, 자주 묻는 질문,
//          주요 기능, 활용 사례, 팁과 주의사항, 시작하기, 기능 소개, 주의할 점, 활용 팁,
//          자주 하는 질문, and EN equivalents.
// Variation: tool index controls whether 작동 원리 is kept/removed/renamed.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const SINGLE_TARGET = process.argv[2] || null;

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

// h3 heading text patterns to REMOVE
const REMOVE_PATTERNS_KO = [
  /^무엇을\s*할\s*수\s*있나요/,
  /^사용\s*가이드/,
  /^사용\s*방법/,
  /^추천\s*활용법/,
  /^참고\s*사항/,
  /^Q\s*&\s*A/,
  /^자주\s*묻는\s*질문/,
  /^자주\s*하는\s*질문/,
  /^주요\s*기능/,
  /^활용\s*사례/,
  /^팁과\s*주의사항/,
  /^시작하기/,
  /^기능\s*소개/,
  /^주의할\s*점/,
  /^활용\s*팁/,
  /^주의사항/,
  /^예제/,
  /^실전\s*활용/
];
const REMOVE_PATTERNS_EN = [
  /^What Can You Do/i,
  /^How to Use/i,
  /^Usage(\s|$)/i,
  /^Getting Started/i,
  /^Quick Start/i,
  /^Feature Overview/i,
  /^Key Features/i,
  /^Recommended Uses/i,
  /^Things to (Keep|Note)/i,
  /^Important Notes/i,
  /^Notes\s*$/i,
  /^Tips and Notes/i,
  /^Usage Tips/i,
  /^Q\s*&\s*A/i,
  /^Frequently Asked/i,
  /^FAQ/i,
  /^Common Use Cases/i,
  /^Examples?$/i,
  /^Practical Use/i
];

// Headings to KEEP (always)
const KEEP_PATTERNS_KO = [
  /^관련\s*도구/,
  /^관련\s*블로그/,
  /^관련\s*글/
];
const KEEP_PATTERNS_EN = [
  /^Related (Tools|Articles|Posts|Blog)/i,
  /^See Also/i
];

// "작동 원리" / "How It Works" — handled via strategy
const HOWITWORKS_KO = [/^작동\s*원리/, /^원리/, /^동작\s*방식/];
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
  return 'intro'; // First h3 / unrecognized = intro
}

// Split section HTML by h3 blocks
function splitByH3(sectionInnerHtml) {
  const h3Re = /<h3[^>]*>[\s\S]*?<\/h3>/g;
  const matches = [...sectionInnerHtml.matchAll(h3Re)];
  if (matches.length === 0) return { preamble: sectionInnerHtml, blocks: [] };

  const preamble = sectionInnerHtml.slice(0, matches[0].index);
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : sectionInnerHtml.length;
    const headerHtml = matches[i][0];
    const bodyHtml = sectionInnerHtml.slice(start + headerHtml.length, end);
    const headerText = headerHtml.replace(/<[^>]+>/g, '').trim();
    blocks.push({ headerHtml, headerText, bodyHtml, fullHtml: sectionInnerHtml.slice(start, end) });
  }
  return { preamble, blocks };
}

function pickStrategy(idx) {
  return idx % 4;
  // 0: keep 작동 원리 (default heading)
  // 1: rename 작동 원리 to alternative
  // 2: drop 작동 원리 (only intro + related)
  // 3: keep 작동 원리 (default) — same as 0 to balance density
}

function rewriteFile(filePath, idx) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');

  // Find content area between Ad Container (Top) and Ad Container (Bottom)
  const adTopIdx = html.indexOf('<!-- Ad Container (Top) -->');
  const adBotIdx = html.indexOf('<!-- Ad Container (Bottom) -->');
  if (adTopIdx === -1 || adBotIdx === -1 || adBotIdx < adTopIdx) {
    return { skipped: 'no ad markers' };
  }
  const before = html.slice(0, adTopIdx);
  const middle = html.slice(adTopIdx, adBotIdx);
  const after = html.slice(adBotIdx);

  // Find FIRST <section class="mt-8 ..."> in middle
  const sectionRe = /<section class="mt-8 [^"]*">/g;
  const sectionMatches = [...middle.matchAll(sectionRe)];
  if (sectionMatches.length === 0) return { skipped: 'no content section' };

  const firstSecStart = sectionMatches[0].index;
  // Find matching </section> (handle nesting)
  let depth = 1;
  let pos = firstSecStart + sectionMatches[0][0].length;
  while (depth > 0 && pos < middle.length) {
    const nextOpen = middle.indexOf('<section', pos);
    const nextClose = middle.indexOf('</section>', pos);
    if (nextClose === -1) return { skipped: 'unclosed section' };
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 8;
    } else {
      depth--;
      pos = nextClose + 10;
    }
  }
  const firstSecEnd = pos;
  const firstSec = middle.slice(firstSecStart, firstSecEnd);

  // Get section opening tag, inner, closing tag
  const wrapperOpenMatch = firstSec.match(/^<section class="mt-8 [^"]*">/);
  const wrapperOpen = wrapperOpenMatch[0];
  const inner = firstSec.slice(wrapperOpen.length, firstSec.length - '</section>'.length);

  // Must have h2 + multiple h3 to be a guide section
  if (!/<h2/.test(inner) || (inner.match(/<h3/g) || []).length < 3) {
    return { skipped: 'not a guide section' };
  }

  // Find h2 + (prose div opening)
  const h2Match = inner.match(/<h2[^>]*>[\s\S]*?<\/h2>/);
  if (!h2Match) return { skipped: 'no h2' };
  const h2Html = h2Match[0];
  const afterH2 = inner.slice(h2Match.index + h2Html.length);

  // Find prose div wrapper
  const proseOpenMatch = afterH2.match(/<div class="prose[^"]*"[^>]*>/);
  if (!proseOpenMatch) return { skipped: 'no prose wrapper' };
  const proseOpen = proseOpenMatch[0];
  const proseInner = afterH2.slice(proseOpenMatch.index + proseOpen.length);
  // Find last </div> before end of inner
  const lastDivClose = proseInner.lastIndexOf('</div>');
  if (lastDivClose === -1) return { skipped: 'no prose close' };
  const proseContent = proseInner.slice(0, lastDivClose);

  // Split prose content by h3
  const { preamble, blocks } = splitByH3(proseContent);
  if (blocks.length === 0) return { skipped: 'no h3 blocks' };

  // Classify each block
  let introBlock = null;
  let howitworksBlock = null;
  const keepBlocks = [];
  let removed = 0;
  for (let i = 0; i < blocks.length; i++) {
    const cls = classifyHeading(blocks[i].headerText, isKo);
    if (i === 0 && cls === 'intro') {
      introBlock = blocks[i];
    } else if (cls === 'howitworks') {
      if (!howitworksBlock) howitworksBlock = blocks[i];
      else removed++; // duplicate howitworks → drop
    } else if (cls === 'keep') {
      keepBlocks.push(blocks[i]);
    } else if (cls === 'remove') {
      removed++;
    } else {
      // 'intro' for non-first = unrecognized; treat as remove to be safe
      removed++;
    }
  }

  if (removed === 0) return { skipped: 'nothing to remove' };

  const strategy = pickStrategy(idx);

  // Build new prose content
  let newProseContent = preamble;
  if (introBlock) newProseContent += introBlock.fullHtml;

  // Strategy logic for 작동 원리:
  if (howitworksBlock) {
    if (strategy === 0 || strategy === 3) {
      // keep as-is
      newProseContent += howitworksBlock.fullHtml;
    } else if (strategy === 1) {
      // rename to alternative
      const alts = isKo ? HOWITWORKS_ALT_KO : HOWITWORKS_ALT_EN;
      const altText = alts[(Math.floor(idx / 4)) % alts.length];
      const newHeader = howitworksBlock.headerHtml.replace(
        />[\s\S]*?<\/h3>/,
        '>' + altText + '</h3>'
      );
      newProseContent += newHeader + howitworksBlock.bodyHtml;
    } else if (strategy === 2) {
      // drop howitworks
    }
  }

  for (const b of keepBlocks) newProseContent += b.fullHtml;

  // Reassemble inner
  const newInner =
    h2Html +
    inner.slice(h2Match.index + h2Html.length, h2Match.index + h2Html.length + proseOpenMatch.index) +
    proseOpen +
    newProseContent +
    proseInner.slice(lastDivClose);

  const newFirstSec = wrapperOpen + newInner + '</section>';
  const newMiddle = middle.slice(0, firstSecStart) + newFirstSec + middle.slice(firstSecEnd);
  const newHtml = before + newMiddle + after;

  if (newHtml === html) return { skipped: 'no change' };
  fs.writeFileSync(filePath, newHtml, 'utf-8');
  return {
    ok: true,
    strategy,
    removed,
    sizeDiff: newHtml.length - html.length,
    keptCount: 1 + (howitworksBlock && strategy !== 2 ? 1 : 0) + keepBlocks.length
  };
}

const files = SINGLE_TARGET ? [path.resolve(SINGLE_TARGET)] : listToolFiles();
const stats = { ok: 0, skipped: {}, byStrategy: {} };
for (let i = 0; i < files.length; i++) {
  const r = rewriteFile(files[i], i);
  if (r.ok) {
    stats.ok++;
    stats.byStrategy[r.strategy] = (stats.byStrategy[r.strategy] || 0) + 1;
    if (SINGLE_TARGET) console.log('OK:', files[i], '-', JSON.stringify(r));
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
    if (SINGLE_TARGET) console.log('SKIP:', files[i], '-', r.skipped);
  }
}
console.log(JSON.stringify(stats, null, 2));
console.log(`Total: ${files.length}`);
