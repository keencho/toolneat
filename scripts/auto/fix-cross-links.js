#!/usr/bin/env node
/**
 * 도구 페이지의 "관련 도구" 크로스링크를 태그 유사도 기준으로 재계산한다.
 *
 * 기존 enrich-cross-links.js가 무작위에 가깝게 링크를 넣어둔 탓에
 * 스톱워치 페이지에서 대출 계산기를 추천하는 식의 조합이 남아 있었다.
 * 애드센스가 지적한 "가치가 별로 없는 콘텐츠" 판단에 불리하고 사용자에게도 쓸모없다.
 *
 * 점수 = 공통 태그 수 x 3 + (같은 카테고리면 1)
 *
 * 사용법:  node scripts/auto/fix-cross-links.js [--dry]
 * 참고:    docs/adsense-plan.md Phase 0-7
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');
const LINK_COUNT = 5;

// 크로스링크 섹션에 쓰이는 헤딩 (표현은 페이지마다 다름 - 그대로 유지한다)
const HEADINGS = ['같이 보면 좋은 도구', '관련 도구', '이런 도구도 추천', '함께 쓰면 좋은 도구'];

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

  return all
    .filter(t => t.id !== tool.id)
    .map(t => {
      let shared = 0;
      for (const tag of t.tags || []) if (mine.has(tag.toLowerCase())) shared++;
      const same = t.category === tool.category;
      return { tool: t, score: shared * 3 + (same ? 2 : 0), shared, same };
    })
    // 태그가 하나도 안 겹치면 같은 카테고리라도 제외한다. 목록을 5개로 채우려고
    // 무관한 도구를 넣느니 3개만 두는 편이 낫다.
    // 다른 카테고리는 태그 2개 이상을 요구한다 - 한 개만 겹치는 경우는 대개 우연한 충돌이다.
    // (url-encoder의 percent가 퍼센트 계산기와, coin-flip의 flip이 이미지 뒤집기와 걸리는 식)
    .filter(r => r.shared >= (r.same ? 1 : 2))
    .sort((a, b) => b.score - a.score || a.tool.id.localeCompare(b.tool.id))
    .slice(0, LINK_COUNT)
    .map(r => r.tool);
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
