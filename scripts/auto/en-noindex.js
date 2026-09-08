/**
 * EN 페이지 noindex 처리 (애드센스 심사용 임시 조치)
 *
 * 애드센스 "가치가 별로 없는 콘텐츠" 거절 대응. 평가 대상 URL을 줄이기 위해
 * EN 전체를 색인에서 제외한다. 페이지 자체는 그대로 동작하며,
 * follow를 유지해 내부 링크 크롤링은 막지 않는다.
 *
 * KO 승인 후 되돌리기:  node scripts/auto/en-noindex.js --remove
 *
 * 참고: docs/adsense-plan.md Phase 0-1
 */
const fs = require('fs');
const path = require('path');

const TAG = '<meta name="robots" content="noindex,follow">';
const remove = process.argv.includes('--remove');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// EN 홈페이지는 루트의 en.html (Cloudflare Pages가 /en 으로 서빙)
const targets = [...walk('en'), 'en.html'];

let changed = 0, skipped = 0;
for (const file of targets) {
  const src = fs.readFileSync(file, 'utf8');
  let out;

  if (remove) {
    if (!src.includes(TAG)) { skipped++; continue; }
    out = src.replace(TAG + '\n', '').replace(TAG, '');
  } else {
    if (src.includes(TAG)) { skipped++; continue; }
    // head의 첫 charset 뒤에만 삽입 (도구 미리보기 안의 charset 예시는 건드리지 않음)
    const anchor = '<meta charset="UTF-8">';
    const at = src.indexOf(anchor);
    if (at === -1) { console.error('charset 없음: ' + file); skipped++; continue; }
    const cut = at + anchor.length;
    out = src.slice(0, cut) + '\n  ' + TAG + src.slice(cut);
  }

  fs.writeFileSync(file, out);
  changed++;
}

console.log(`${remove ? '제거' : '삽입'} 완료: ${changed}개 변경, ${skipped}개 건너뜀`);
