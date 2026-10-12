#!/usr/bin/env node
/**
 * CSS/JS 링크에 콘텐츠 해시를 쿼리로 붙여 캐시를 무효화한다.
 *
 * 파일명이 그대로면 Cloudflare 엣지가 옛 파일을 계속 서빙한다.
 * 실제로 2026-10-12에 HTML은 새 클래스를, CSS는 옛 내용을 서빙해
 * 아이콘 색이 전부 투명해지는 문제가 있었다 (cf-cache-status: HIT, age 2125).
 * 과거에도 같은 이유로 output.css → style.css 로 파일명을 바꾼 이력이 있다.
 *
 * 내용이 바뀌면 해시가 바뀌므로 새 URL이 되고, 안 바뀌면 캐시가 그대로 쓰인다.
 *
 * 사용법: node scripts/auto/stamp-assets.js
 * 빌드에 포함할 것: tailwind 빌드 직후, rm 이전
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');

// 해시를 붙일 대상 (경로는 사이트 루트 기준)
const TARGETS = [
  '/assets/css/style.css',
  '/assets/js/common.js',
  '/assets/js/i18n.js',
  '/assets/js/tools-data.js',
  '/assets/js/components.js',
  '/assets/js/search.js',
];

function hashOf(sitePath) {
  const file = path.join(ROOT, sitePath.replace(/^\//, ''));
  if (!fs.existsSync(file)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
}

const hashes = new Map();
for (const t of TARGETS) {
  const h = hashOf(t);
  if (h) hashes.set(t, h);
  else console.error('  대상 없음, 건너뜀: ' + t);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!['node_modules', '.git', '.idea', '.claude', 'components'].includes(e.name)) {
        walk(path.join(dir, e.name), out);
      }
    } else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  let out = src;

  for (const [target, hash] of hashes) {
    // 기존 ?v=... 가 있으면 교체, 없으면 추가
    const re = new RegExp('(["\'])' + target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?v=[0-9a-f]+)?\\1', 'g');
    out = out.replace(re, (m, q) => q + target + '?v=' + hash + q);
  }

  if (out !== src) {
    fs.writeFileSync(file, out);
    changed++;
  }
}

console.log('해시 스탬프: ' + changed + '개 파일');
for (const [t, h] of hashes) console.log('  ' + t + '  ?v=' + h);
