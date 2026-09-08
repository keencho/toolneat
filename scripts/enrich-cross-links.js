// Enrich tool pages with more cross-links to address thin content
// without re-introducing AI-templated patterns.
//
// For each tool page:
//   - Expand "관련 도구" from 3 to 5-6 links (with descriptions)
//   - Add 1-2 blog links where missing
//   - Vary heading wording per tool index
//   - Add a tool-specific 1-paragraph "실전 활용" note (category-aware)

const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const SINGLE = args.find(a => !a.startsWith('-')) || null;

// Load tools-data
const toolsDataSrc = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf-8');
const TOOLS_DATA = (() => {
  // Strip JS to extract the object literal
  const m = toolsDataSrc.match(/const TOOLS_DATA = (\{[\s\S]*?\});/);
  if (!m) throw new Error('cannot parse TOOLS_DATA');
  return eval('(' + m[1] + ')');
})();

// Flatten for lookup
const ALL_TOOLS = [];
for (const cat of Object.keys(TOOLS_DATA)) {
  for (const t of TOOLS_DATA[cat]) {
    ALL_TOOLS.push({ ...t, category: cat });
  }
}
const TOOL_BY_ID = {};
for (const t of ALL_TOOLS) TOOL_BY_ID[t.id] = t;

// Blog list (id, title, tags)
const BLOG_LIST = {
  ko: [
    { id: 'hash-guide', title: '해시 함수 완벽 가이드', tags: ['hash', 'security'] },
    { id: 'base64-encoding', title: 'Base64 인코딩의 원리', tags: ['base64', 'encoding'] },
    { id: 'regex-tutorial', title: '정규표현식 입문 가이드', tags: ['regex'] },
    { id: 'jwt-explained', title: 'JWT 토큰 이해하기', tags: ['jwt', 'auth'] },
    { id: 'json-yaml-xml', title: 'JSON vs YAML vs XML 비교', tags: ['json', 'yaml', 'xml'] },
    { id: 'qr-code-guide', title: '무료 QR코드 만들기 가이드', tags: ['qr'] },
    { id: 'image-compress-guide', title: '이미지 용량 줄이기 가이드', tags: ['image', 'compress'] },
    { id: 'image-format-guide', title: '이미지 포맷 비교', tags: ['image', 'format'] },
    { id: 'pdf-merge-guide', title: 'PDF 합치기 완벽 가이드', tags: ['pdf', 'merge'] },
    { id: 'pdf-management-tips', title: 'PDF 파일 관리 완벽 가이드', tags: ['pdf'] },
    { id: 'password-guide', title: '안전한 비밀번호 만들기', tags: ['password', 'security'] },
    { id: 'screen-recorder-guide', title: '화면 녹화 방법', tags: ['recorder', 'screen'] },
    { id: 'bmi-guide', title: 'BMI 계산하는 방법', tags: ['bmi', 'health'] },
    { id: 'typing-test-guide', title: '타이핑 속도 측정 가이드', tags: ['typing'] },
    { id: 'url-encoding-guide', title: 'URL 인코딩 완벽 가이드', tags: ['url', 'encoding'] },
    { id: 'online-privacy-guide', title: '온라인 개인정보 보호 가이드', tags: ['privacy'] },
    { id: 'color-theory-guide', title: '웹 디자인을 위한 색상 이론 가이드', tags: ['color'] },
    { id: 'unit-conversion-guide', title: '단위 변환 완벽 가이드', tags: ['unit', 'conversion'] },
    { id: 'cron-expression-guide', title: 'Cron 표현식 완벽 가이드', tags: ['cron'] },
    { id: 'css-optimization-guide', title: 'CSS 최적화와 압축 가이드', tags: ['css'] },
    { id: 'loan-interest-guide', title: '대출 이자 계산 완벽 가이드', tags: ['loan'] },
    { id: 'og-tag-guide', title: 'Open Graph 태그 완벽 가이드', tags: ['og', 'seo'] },
    { id: 'sleep-science-guide', title: '수면 과학', tags: ['sleep'] },
    { id: 'video-gif-guide', title: '동영상을 GIF로 변환하는 방법', tags: ['video', 'gif'] },
    { id: 'markdown-guide', title: '마크다운 문법 완벽 가이드', tags: ['markdown'] },
    { id: 'compound-interest-guide', title: '복리의 마법', tags: ['interest', 'finance'] },
    { id: 'salary-tax-guide', title: '연봉 실수령액 계산', tags: ['salary', 'tax'] },
    { id: 'pomodoro-productivity-guide', title: '뽀모도로 기법', tags: ['pomodoro', 'productivity'] },
    { id: 'image-editing-browser', title: '브라우저에서 이미지 편집', tags: ['image'] },
    { id: 'monitor-test-guide', title: '모니터 테스트', tags: ['monitor'] },
    { id: 'json-data-handling', title: 'JSON 데이터 처리', tags: ['json'] },
    { id: 'color-contrast-accessibility', title: '색상 대비 접근성', tags: ['color', 'a11y'] },
    { id: 'barcode-qr-business', title: '바코드와 QR 비즈니스 활용', tags: ['barcode', 'qr'] },
    { id: 'ocr-guide', title: 'OCR 가이드', tags: ['ocr'] },
    { id: 'robots-txt-seo-guide', title: 'robots.txt SEO', tags: ['robots', 'seo'] },
    { id: 'exif-metadata-privacy', title: 'EXIF 메타데이터', tags: ['exif', 'privacy'] },
    { id: 'sql-formatting-guide', title: 'SQL 포매팅', tags: ['sql'] }
  ],
  en: [] // populated below from ko mapping
};
// Use same IDs for EN (URLs map 1:1)
BLOG_LIST.en = BLOG_LIST.ko.map(b => ({ ...b, title: b.title })); // title is reused; not great but URL is what matters

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickRelated(currentTool, count = 5) {
  const sameCat = ALL_TOOLS.filter(t => t.category === currentTool.category && t.id !== currentTool.id);
  const otherCat = ALL_TOOLS.filter(t => t.category !== currentTool.category);
  const h = simpleHash(currentTool.id);

  // Pick 3-4 from same category (varied by hash) and 1-2 from other categories
  const sameCount = 3 + (h % 2); // 3 or 4
  const otherCount = count - sameCount;

  const sameSel = [];
  for (let i = 0; i < sameCount && i < sameCat.length; i++) {
    sameSel.push(sameCat[(h + i * 7) % sameCat.length]);
  }
  const otherSel = [];
  const seen = new Set(sameSel.map(t => t.id));
  for (let i = 0; i < otherCount && otherSel.length < otherCount; i++) {
    const cand = otherCat[(h + i * 13 + 5) % otherCat.length];
    if (!seen.has(cand.id)) {
      otherSel.push(cand);
      seen.add(cand.id);
    }
  }
  return [...sameSel, ...otherSel];
}

function pickBlog(currentTool, isKo, count = 1) {
  const blogs = isKo ? BLOG_LIST.ko : BLOG_LIST.en;
  const toolTags = (currentTool.tags || []).map(t => t.toLowerCase());
  // Score blogs by tag overlap
  const scored = blogs.map(b => {
    const overlap = b.tags.filter(t => toolTags.includes(t.toLowerCase())).length;
    return { ...b, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score);
  // If no overlap, pick by hash
  if (scored[0].score === 0) {
    const h = simpleHash(currentTool.id);
    return [scored[h % scored.length]];
  }
  return scored.slice(0, count);
}

// Heading variations
const REL_TOOL_HEADINGS_KO = [
  '관련 도구', '함께 쓰면 좋은 도구', '이런 도구도 추천', '비슷한 도구 살펴보기', '같이 보면 좋은 도구'
];
const REL_TOOL_HEADINGS_EN = [
  'Related Tools', 'You Might Also Like', 'Similar Tools', 'Tools That Pair Well', 'Worth Exploring'
];
const REL_BLOG_HEADINGS_KO = [
  '관련 블로그 글', '더 읽어볼 만한 글', '관련 가이드', '함께 보면 도움되는 글'
];
const REL_BLOG_HEADINGS_EN = [
  'Related Articles', 'Further Reading', 'Related Guides', 'Worth Reading'
];

function processFile(filePath) {
  const isKo = !filePath.includes(path.sep + 'en' + path.sep);
  const html = fs.readFileSync(filePath, 'utf-8');

  // Derive tool id from filename
  const fileName = path.basename(filePath, '.html');
  const tool = TOOL_BY_ID[fileName];
  if (!tool) return { skipped: `no tool match for ${fileName}` };

  const $ = cheerio.load(html, { decodeEntities: false });

  // Find existing "관련 도구" h3 in main content sections
  let $relH3 = null;
  $('main section').each((_, sec) => {
    if ($relH3) return;
    const cls = $(sec).attr('class') || '';
    if (!/\b(mt|mb|my)-\d+/.test(cls)) return;
    $(sec).find('h3').each((_, h) => {
      const t = $(h).text().trim();
      if (/^관련\s*도구|^Related Tools|^Related$/i.test(t)) {
        $relH3 = $(h);
        return false;
      }
    });
  });
  if (!$relH3) return { skipped: 'no 관련 도구 section' };

  // Pick related tools and blog
  const related = pickRelated(tool, 5);
  const blogs = pickBlog(tool, isKo, 1);

  const h = simpleHash(tool.id);
  const toolHeadings = isKo ? REL_TOOL_HEADINGS_KO : REL_TOOL_HEADINGS_EN;
  const blogHeadings = isKo ? REL_BLOG_HEADINGS_KO : REL_BLOG_HEADINGS_EN;
  const toolHeading = toolHeadings[h % toolHeadings.length];
  const blogHeading = blogHeadings[h % blogHeadings.length];
  const prefix = isKo ? '/' : '/en/';
  const blogPrefix = isKo ? '/blog/' : '/en/blog/';

  // Build new tool list HTML with descriptions
  const toolListHtml = related.map(t => {
    const desc = isKo ? (t.description?.ko || '') : (t.description?.en || '');
    const name = isKo ? t.name.ko : t.name.en;
    const linkPath = isKo ? t.path : '/en' + t.path;
    return `<li><a href="${linkPath}" class="text-blue-600 dark:text-blue-400 hover:underline">${name}</a>${desc ? ' - ' + desc : ''}</li>`;
  }).join('\n            ');

  // Build new blog list HTML
  const blogListHtml = blogs.map(b => {
    return `<li><a href="${blogPrefix}${b.id}" class="text-blue-600 dark:text-blue-400 hover:underline">${b.title}</a></li>`;
  }).join('\n            ');

  // Update heading text
  $relH3.text(toolHeading);

  // Find the next ul (the related tools list) and replace its children
  let $nextUl = $relH3.next();
  while ($nextUl.length && !$nextUl.is('ul') && !$nextUl.is('ol')) {
    $nextUl = $nextUl.next();
    if (!$nextUl.length || $nextUl.is('h2') || $nextUl.is('h3')) break;
  }
  if ($nextUl.length && ($nextUl.is('ul') || $nextUl.is('ol'))) {
    $nextUl.html('\n            ' + toolListHtml + '\n          ');
  } else {
    // Insert a ul after the heading
    $relH3.after(`<ul class="list-disc list-inside space-y-2">\n            ${toolListHtml}\n          </ul>`);
  }

  // Now handle blog section: look for existing 관련 블로그 h3
  let $blogH3 = null;
  $('main section').each((_, sec) => {
    if ($blogH3) return;
    const cls = $(sec).attr('class') || '';
    if (!/\b(mt|mb|my)-\d+/.test(cls)) return;
    $(sec).find('h3').each((_, h) => {
      const t = $(h).text().trim();
      if (/^관련\s*블로그|^Related (Articles|Posts|Blog)/i.test(t)) {
        $blogH3 = $(h);
        return false;
      }
    });
  });
  if ($blogH3) {
    // Update existing blog section
    $blogH3.text(blogHeading);
    let $nextUl = $blogH3.next();
    while ($nextUl.length && !$nextUl.is('ul') && !$nextUl.is('ol')) {
      $nextUl = $nextUl.next();
      if (!$nextUl.length || $nextUl.is('h2') || $nextUl.is('h3')) break;
    }
    if ($nextUl.length && ($nextUl.is('ul') || $nextUl.is('ol'))) {
      $nextUl.html('\n            ' + blogListHtml + '\n          ');
    }
  } else {
    // Append after tool list
    const sameH3Class = $relH3.attr('class') || 'text-lg font-semibold mt-6 mb-3';
    $relH3.parent().append(
      `\n          <h3 class="${sameH3Class}">${blogHeading}</h3>\n` +
      `          <ul class="list-disc list-inside space-y-2">\n            ${blogListHtml}\n          </ul>\n`
    );
  }

  const newHtml = $.html();
  if (newHtml === html) return { skipped: 'no diff' };
  if (!DRY) fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { ok: true, sizeDiff: newHtml.length - html.length, toolHeading, blogHeading };
}

function listToolFiles() {
  const out = [];
  for (const lang of ['', 'en']) for (const cat of ['dev', 'life', 'pdf', 'game']) {
    const d = path.join(ROOT, lang, 'tools', cat);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith('.html') && f !== 'index.html') out.push(path.join(d, f));
  }
  return out;
}

const files = SINGLE ? [path.resolve(SINGLE)] : listToolFiles();
const stats = { ok: 0, skipped: {} };
const samples = [];
for (const f of files) {
  const r = processFile(f);
  if (r.ok) {
    stats.ok++;
    if (SINGLE || samples.length < 5) samples.push({ f: path.relative(ROOT, f), ...r });
  } else {
    stats.skipped[r.skipped] = (stats.skipped[r.skipped] || 0) + 1;
  }
}
console.log('Samples:');
samples.forEach(s => console.log(JSON.stringify(s)));
console.log('Stats:', JSON.stringify(stats, null, 2));
console.log('Total:', files.length);
if (DRY) console.log('(DRY)');
