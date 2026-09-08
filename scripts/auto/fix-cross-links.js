#!/usr/bin/env node
/**
 * 도구 페이지의 "관련 도구" 크로스링크를 태그 유사도 기준으로 재계산한다.
 *
 * 기존 enrich-cross-links.js가 무작위에 가깝게 링크를 넣어둔 탓에
 * 스톱워치 페이지에서 대출 계산기를 추천하는 식의 조합이 남아 있었다.
 * 애드센스가 지적한 "가치가 별로 없는 콘텐츠" 판단에 불리하고 사용자에게도 쓸모없다.
 *
 * 점수 = 공통 태그의 IDF 가중합(1/문서빈도). 0.35 미만은 버린다.
 *
 * 사용법:  node scripts/auto/fix-cross-links.js [--dry]
 * 참고:    docs/adsense-plan.md Phase 0-7
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');
const LINK_COUNT = 5;   // 확실한 매칭이 많을 때 최대 몇 개까지 싣나
const MIN_LINKS = 3;    // 이만큼은 채우려고 같은 카테고리에서 보충한다
const STRONG = 0.35;    // 이 점수 이상이면 '확실한 매칭'

// 크로스링크 섹션에 쓰이는 헤딩 (표현은 페이지마다 다름 - 그대로 유지한다)
const HEADINGS = [
  '같이 보면 좋은 도구', '관련 도구', '이런 도구도 추천',
  '함께 쓰면 좋은 도구', '비슷한 도구 살펴보기',
];

// 태그 어휘가 특이해서 자동 계산으로는 겹치는 도구가 안 나오는 경우. 직접 지정한다.
const FALLBACK = {
  'cron-generator': ['timestamp-converter', 'countdown-timer', 'dday-calculator'],
  'hash-generator': ['password-generator', 'uuid-generator', 'base64', 'jwt-generator'],
  'password-generator': ['hash-generator', 'uuid-generator', 'jwt-generator', 'base64'],
  'regex-tester': ['text-escape', 'diff-checker', 'case-converter', 'character-counter'],
  'utm-generator': ['url-encoder', 'meta-tag-generator', 'og-preview', 'qr-generator'],
  'uuid-generator': ['hash-generator', 'password-generator', 'timestamp-converter', 'base64'],
  'base-converter': ['ascii-unicode', 'unit-converter', 'percent-calculator', 'morse-code'],
  'fake-chat': ['meme-generator', 'fancy-text', 'emoji-picker', 'image-watermark'],
  'tip-calculator': ['percent-calculator', 'salary-calculator', 'loan-calculator', 'compound-calculator'],

  // CSS 시각 효과
  'box-shadow': ['gradient-generator', 'color-picker', 'color-converter', 'css-minifier'],
  'gradient-generator': ['box-shadow', 'color-palette', 'color-picker', 'color-converter'],
  'color-contrast': ['color-picker', 'color-converter', 'color-palette', 'gradient-generator'],
  // 텍스트 처리
  'diff-checker': ['character-counter', 'case-converter', 'line-ending', 'text-escape'],
  'line-ending': ['diff-checker', 'text-escape', 'case-converter', 'character-counter'],
  'lorem-ipsum': ['character-counter', 'fancy-text', 'case-converter', 'korean-name-generator'],
  'character-counter': ['lorem-ipsum', 'diff-checker', 'case-converter', 'typing-test'],
  'morse-code': ['ascii-unicode', 'base-converter', 'text-to-speech', 'fancy-text'],
  // SEO / 메타
  'robots-txt': ['meta-tag-generator', 'og-preview', 'utm-generator'],
  // 이미지
  'image-blur': ['image-crop', 'image-watermark', 'image-resizer', 'image-compressor'],
  'favicon-generator': ['image-resizer', 'image-crop', 'image-converter', 'og-preview'],
  'video-to-gif': ['image-compressor', 'image-converter', 'screen-recorder', 'image-resizer'],
  'youtube-thumbnail': ['image-resizer', 'image-crop', 'image-converter', 'og-preview'],
  'emoji-picker': ['fancy-text', 'ascii-unicode', 'meme-generator', 'character-counter'],
  // 계산기 / 날짜
  'age-calculator': ['dday-calculator', 'sleep-calculator', 'percent-calculator', 'unit-converter'],
  'salary-calculator': ['loan-calculator', 'compound-calculator', 'tip-calculator', 'percent-calculator'],
  'korean-name-generator': ['lottery-generator', 'roulette', 'dice-roller', 'fancy-text'],
  // 기타
  'memory-game': ['2048', 'minesweeper', 'snake', 'tetris'],
  'merge-pdf': ['split-pdf', 'reorder-pdf', 'delete-pdf', 'compress-pdf'],
};

// tools-data.js는 브라우저용 전역 스크립트라 shim을 씌워 읽는다
function loadTools() {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf8');
  const sandbox = {};
  new Function('window', 'globalThis', src + '\n;window.__d = typeof TOOLS_DATA !== "undefined" ? TOOLS_DATA : null;')(sandbox, sandbox);
  if (!sandbox.__d) throw new Error('TOOLS_DATA를 읽지 못했습니다');

  const all = [];
  for (const [category, list] of Object.entries(sandbox.__d)) {
    for (const t of list) all.push({ ...t, category });
  }
  return all;
}

function related(tool, all) {
  if (FALLBACK[tool.id]) {
    const byId = new Map(all.map(t => [t.id, t]));
    const picks = FALLBACK[tool.id].map(id => byId.get(id)).filter(Boolean);
    if (picks.length !== FALLBACK[tool.id].length) {
      console.error('  FALLBACK에 없는 id 포함: ' + tool.id);
    }
    return picks;
  }

  const mine = new Set((tool.tags || []).map(s => s.toLowerCase()));

  const scored = all
    .filter(t => t.id !== tool.id)
    .map(t => {
      // IDF 가중: 흔한 태그일수록 덜 쳐준다. convert(11개), image(12개) 같은 범용
      // 태그가 카테고리를 넘어 엉뚱한 도구를 끌어오는 것을 막는다.
      let score = 0;
      for (const tag of new Set((t.tags || []).map(s => s.toLowerCase()))) {
        if (mine.has(tag)) score += 1 / (DF[tag] || 1);
      }
      return { tool: t, score, same: t.category === tool.category };
    })
    // 목록을 5개로 채우려고 무관한 도구를 넣느니 2~3개만 두는 편이 낫다.
    // convert(11개) + 변환(8개)만 겹치는 0.216 구간이 전부 오탐이라 0.35로 끊었다.
    // format 태그는 "파일 형식"과 "코드 정렬" 두 뜻으로 쓰여 동음이의 충돌을 만든다.
    .sort((a, b) => b.score - a.score || Number(b.same) - Number(a.same) || a.tool.id.localeCompare(b.tool.id));

  const strong = scored.filter(r => r.score >= STRONG);
  if (strong.length >= MIN_LINKS) return strong.slice(0, LINK_COUNT).map(r => r.tool);

  // 확실한 매칭이 부족하면 같은 카테고리에서 채운다. 태그가 하나라도 겹쳐야
  // 하므로 완전히 무관한 도구는 들어오지 않는다. 그래도 모자라면 모자란 대로 둔다.
  const filler = scored.filter(r => r.score < STRONG && r.same && r.score > 0);
  return [...strong, ...filler].slice(0, MIN_LINKS).map(r => r.tool);
}

function buildList(tools, lang, indent) {
  const cls = 'text-blue-600 dark:text-blue-400 hover:underline';
  return tools.map(t => {
    const href = lang === 'en' ? '/en' + t.path : t.path;
    const name = t.name[lang] || t.name.ko;
    const desc = t.description[lang] || t.description.ko;
    return `${indent}<li><a href="${href}" class="${cls}">${name}</a> - ${desc}</li>`;
  });
}

const all = loadTools();
const byPath = new Map(all.map(t => [t.path, t]));

// 태그별 문서 빈도 (몇 개 도구에 붙어 있는지)
const DF = {};
for (const t of all) {
  for (const tag of new Set((t.tags || []).map(s => s.toLowerCase()))) DF[tag] = (DF[tag] || 0) + 1;
}

// FALLBACK에 오타나 없는 도구 id가 들어가면 조용히 링크가 빠지므로 기동 시 검증한다
{
  const ids = new Set(all.map(t => t.id));
  const bad = [];
  for (const [k, v] of Object.entries(FALLBACK)) {
    if (!ids.has(k)) bad.push(k + ' (키)');
    for (const id of v) if (!ids.has(id)) bad.push(k + ' -> ' + id);
  }
  if (bad.length) {
    console.error('FALLBACK에 존재하지 않는 도구 id가 있습니다:');
    for (const b of bad) console.error('  ' + b);
    process.exit(1);
  }
}

let changed = 0, skipped = 0, noMatch = 0;

for (const lang of ['ko', 'en']) {
  const base = lang === 'en' ? 'en/tools' : 'tools';

  for (const category of ['dev', 'life', 'game', 'pdf']) {
    const dir = path.join(ROOT, base, category);
    if (!fs.existsSync(dir)) continue;

    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.html')) continue;

      const file = path.join(base, category, name);
      const toolPath = '/tools/' + category + '/' + name.replace('.html', '');
      const tool = byPath.get(toolPath);
      if (!tool) { console.error('  tools-data에 없음: ' + toolPath); noMatch++; continue; }

      const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
      const h = lines.findIndex(l => l.includes('<h3') && HEADINGS.some(x => l.includes(x)));
      if (h === -1) { skipped++; continue; }

      // 헤딩 다음의 <ul> ... </ul> 범위를 찾는다
      const ulStart = lines.findIndex((l, i) => i > h && l.includes('<ul'));
      if (ulStart === -1 || ulStart > h + 2) { console.error('  ul 못 찾음: ' + file); skipped++; continue; }
      const ulEnd = lines.findIndex((l, i) => i > ulStart && l.includes('</ul>'));
      if (ulEnd === -1) { console.error('  </ul> 못 찾음: ' + file); skipped++; continue; }

      const picks = related(tool, all);
      if (!picks.length) { console.error('  연관 도구 없음: ' + toolPath); skipped++; continue; }

      const indent = (lines[ulStart + 1] || '            <li>').match(/^\s*/)[0];
      const next = buildList(picks, lang, indent);

      const before = lines.slice(ulStart + 1, ulEnd).join('\n');
      if (before === next.join('\n')) { skipped++; continue; }

      lines.splice(ulStart + 1, ulEnd - ulStart - 1, ...next);
      if (!DRY) fs.writeFileSync(path.join(ROOT, file), lines.join('\n'));
      changed++;
    }
  }
}

console.log(`${DRY ? '[dry-run] ' : ''}교체 ${changed}개, 건너뜀 ${skipped}개, 매칭 실패 ${noMatch}개`);
