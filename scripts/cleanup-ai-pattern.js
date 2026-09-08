// Cleanup AI-templated patterns to reduce duplicate structure across pages.
// Strategy: each tool keeps the intro paragraph + 1 varied section + related tools.
// Heading wording and which section survives is rotated by tool index.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function listToolFiles() {
  const out = [];
  for (const lang of ['', 'en/']) {
    for (const cat of ['dev', 'life', 'pdf', 'game']) {
      const dir = path.join(ROOT, lang, 'tools', cat);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith('.html') && f !== 'index.html') {
          out.push(path.join(dir, f));
        }
      }
    }
  }
  return out;
}

// Section wrapper variants
const WRAPPERS = [
  '<section class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">',
  '<section class="mt-8 bg-white dark:bg-gray-800 rounded-lg p-5 md:p-8 ring-1 ring-gray-100 dark:ring-gray-700">',
  '<section class="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">',
  '<section class="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 max-w-lg mx-auto">'
];

// Find a top-level <section ...>...</section> starting at idx
function findSectionEnd(html, startIdx) {
  let depth = 1;
  let i = startIdx;
  const openRe = /<section\b[^>]*>/g;
  const closeRe = /<\/section>/g;
  openRe.lastIndex = i;
  closeRe.lastIndex = i;
  while (depth > 0) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) {
      depth++;
      i = o.index + o[0].length;
    } else {
      depth--;
      i = c.index + c[0].length;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// Extract h2 + first paragraph inside section html
function extractIntro(sectionHtml, isKo) {
  // h2 like: <h2 ...>{tool}란?</h2>
  const h2Match = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const h2 = h2Match ? h2Match[0] : '';
  // First <p ...>...</p> after h2
  const afterH2 = h2Match ? sectionHtml.slice(h2Match.index + h2Match[0].length) : sectionHtml;
  const pMatch = afterH2.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  const p = pMatch ? pMatch[0] : '';
  return { h2, p };
}

// Extract a specific h3 section by heading text (returns h3 + content until next h3 or </div>)
function extractH3Section(sectionHtml, headings) {
  // Find any h3 matching one of the headings list
  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
  let match;
  let firstFound = null;
  let nextH3Idx = -1;
  while ((match = h3Re.exec(sectionHtml)) !== null) {
    const txt = match[1].replace(/<[^>]+>/g, '').trim();
    if (firstFound) {
      nextH3Idx = match.index;
      break;
    }
    if (headings.some(h => txt.includes(h))) {
      firstFound = { txt, start: match.index, headerEnd: match.index + match[0].length, header: match[0] };
    }
  }
  if (!firstFound) return null;
  const end = nextH3Idx === -1 ? sectionHtml.lastIndexOf('</div>') : nextH3Idx;
  if (end === -1 || end <= firstFound.headerEnd) return null;
  return {
    title: firstFound.txt,
    header: firstFound.header,
    body: sectionHtml.slice(firstFound.headerEnd, end)
  };
}

// Extract related-tools section
function extractRelated(sectionHtml, isKo) {
  const headings = isKo
    ? ['관련 도구', '관련 블로그']
    : ['Related Tools', 'Related Blog', 'Related Posts', 'Related'];
  // Find first matching h3
  return extractH3Section(sectionHtml, headings);
}

// Rotate intro variants - different opening line per index
function variedIntro(originalH2, originalP, idx, isKo) {
  // Just use original
  return originalH2 + '\n        ' + originalP;
}

// Choose which extra section to keep, by tool index
function pickStrategy(idx) {
  // 0: intro only + related
  // 1: intro + 작동 원리/How it works + related
  // 2: intro + 사용 방법/How to use + related
  // 3: intro + 주의사항/Notes + related
  // 4: intro only (very thin)
  // 5: intro + 작동 원리 + related (different heading)
  return idx % 6;
}

const KO_HOWITWORKS = ['작동 원리', '동작 방식', '원리', '내부적으로는', '어떻게 동작하나요'];
const KO_HOWTOUSE = ['사용 방법', '사용 가이드', '시작하기', '쓰는 법', '간단 사용법'];
const KO_NOTES = ['주의사항', '참고사항', '주의할 점', '유의사항', '알아두면 좋은 점'];
const EN_HOWITWORKS = ['How It Works', 'How it works', 'Under the Hood', 'The Mechanism'];
const EN_HOWTOUSE = ['How to Use', 'Usage', 'Getting Started', 'Quick Start'];
const EN_NOTES = ['Notes', 'Things to Note', 'Important Notes', 'Good to Know'];

function rewriteToolPage(filePath, idx) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Find the FIRST content section wrapper after main starts
  let sectionStart = -1;
  let wrapperUsed = null;
  for (const w of WRAPPERS) {
    const i = html.indexOf(w);
    if (i !== -1 && (sectionStart === -1 || i < sectionStart)) {
      sectionStart = i;
      wrapperUsed = w;
    }
  }
  if (sectionStart === -1) return { skipped: 'no content section' };

  // Find end of this section (and possibly the second related-tools section)
  const sectionContentStart = sectionStart + wrapperUsed.length;
  const sectionEnd = findSectionEnd(html, sectionContentStart);
  if (sectionEnd === -1) return { skipped: 'no section end' };

  const sectionHtml = html.slice(sectionContentStart, sectionEnd - '</section>'.length);

  // Check if this section actually has h2 and h3 (the templated guide section)
  if (!/<h2/.test(sectionHtml) || !/<h3/.test(sectionHtml)) {
    return { skipped: 'not templated section' };
  }

  // Extract original intro
  const { h2, p } = extractIntro(sectionHtml, isKo);
  if (!h2 || !p) return { skipped: 'no intro' };

  // Extract related tools
  const related = extractRelated(sectionHtml, isKo);

  // Look for additional section (related tools could be in a SECOND wrapper just after)
  let secondSectionRelated = null;
  let secondSectionStart = -1;
  let secondSectionEnd = -1;
  if (!related) {
    // search for a second section wrapper immediately after this section
    const remainAfter = html.slice(sectionEnd);
    for (const w of WRAPPERS) {
      const i = remainAfter.indexOf(w);
      if (i !== -1 && i < 200) {
        secondSectionStart = sectionEnd + i;
        const s2ContentStart = secondSectionStart + w.length;
        secondSectionEnd = findSectionEnd(html, s2ContentStart);
        if (secondSectionEnd !== -1) {
          const s2Html = html.slice(s2ContentStart, secondSectionEnd - '</section>'.length);
          secondSectionRelated = extractRelated(s2Html, isKo);
        }
        break;
      }
    }
  }

  const relatedSection = related || secondSectionRelated;

  // Pick strategy
  const strategy = pickStrategy(idx);
  let extra = '';
  let extraHeading = '';

  if (strategy === 1 || strategy === 5) {
    const found = extractH3Section(sectionHtml, isKo ? ['작동 원리', '원리', '동작'] : ['How It Works', 'How it works', 'Mechanism']);
    if (found) {
      const headingChoices = isKo ? KO_HOWITWORKS : EN_HOWITWORKS;
      extraHeading = headingChoices[idx % headingChoices.length];
      extra = found.body;
    }
  } else if (strategy === 2) {
    const found = extractH3Section(sectionHtml, isKo ? ['사용 방법', '사용 가이드', '시작하기', '사용법'] : ['How to Use', 'How to use', 'Usage', 'Getting Started']);
    if (found) {
      const headingChoices = isKo ? KO_HOWTOUSE : EN_HOWTOUSE;
      extraHeading = headingChoices[idx % headingChoices.length];
      extra = found.body;
    }
  } else if (strategy === 3) {
    const found = extractH3Section(sectionHtml, isKo ? ['주의', '참고', '유의'] : ['Note', 'Tips', 'Important']);
    if (found) {
      const headingChoices = isKo ? KO_NOTES : EN_NOTES;
      extraHeading = headingChoices[idx % headingChoices.length];
      extra = found.body;
    }
  }
  // strategy 0 and 4 keep only intro (variation in thinness)

  // Build new section
  let newInner = '\n        ' + h2 + '\n        <div class="prose prose-gray dark:prose-invert max-w-none text-sm">\n          ' + p + '\n';

  if (extra && extraHeading) {
    newInner += `          <h3 class="text-lg font-semibold mt-6 mb-3">${extraHeading}</h3>\n          ${extra.trim()}\n`;
  }

  if (relatedSection) {
    newInner += `          ${relatedSection.header}\n          ${relatedSection.body.trim()}\n`;
  }

  newInner += '        </div>\n      ';

  // Remove the original section(s) and replace
  const before = html.slice(0, sectionStart);
  let after;
  if (secondSectionStart !== -1 && secondSectionEnd !== -1) {
    after = html.slice(secondSectionEnd);
  } else {
    after = html.slice(sectionEnd);
  }

  const newSection = wrapperUsed + newInner + '</section>';
  const newHtml = before + newSection + after;

  if (newHtml === html) return { skipped: 'no change' };
  fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { strategy, ok: true, sizeDiff: newHtml.length - html.length };
}

// Run
const files = listToolFiles();
let stats = { ok: 0, skipped: 0, byStrategy: {} };
files.forEach((f, idx) => {
  const r = rewriteToolPage(f, idx);
  if (r.ok) {
    stats.ok++;
    stats.byStrategy[r.strategy] = (stats.byStrategy[r.strategy] || 0) + 1;
  } else {
    stats.skipped++;
    // console.log('SKIP', path.relative(ROOT, f), '-', r.skipped);
  }
});
console.log(JSON.stringify(stats, null, 2));
console.log(`Total files: ${files.length}`);
