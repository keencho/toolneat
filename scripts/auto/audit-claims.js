#!/usr/bin/env node
/**
 * 페이지 본문이 주장하는 구현 내용이 실제 코드와 맞는지 대조한다.
 *
 * speech-to-text가 "서버로 전송되지 않습니다"라고 적어두고 실제로는
 * webkitSpeechRecognition으로 음성을 외부에 보내고 있었고, stopwatch는
 * performance.now()를 쓴다고 했지만 코드에는 Date.now()뿐이었다.
 * 로또는 UI에 없는 기능을 meta description에 적어두고 있었다.
 * 사실과 다른 설명은 애드센스 심사에서 신뢰도 문제로 이어지므로 기계적으로 잡는다.
 *
 * 사용법: node scripts/auto/audit-claims.js
 * 참고:   docs/adsense-plan.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

// 본문에 이 문구가 있으면 코드에 대응 심볼이 있어야 한다
const API_CLAIMS = [
  { claim: 'performance.now', symbol: 'performance.now' },
  { claim: 'requestAnimationFrame', symbol: 'requestAnimationFrame' },
  { claim: 'crypto.getRandomValues', symbol: 'crypto.getRandomValues' },
  { claim: 'crypto.subtle', symbol: 'crypto.subtle' },
  { claim: 'Web Crypto', symbol: 'crypto.subtle|crypto.getRandomValues' },
  { claim: 'EyeDropper', symbol: 'EyeDropper' },
  { claim: 'localStorage', symbol: 'localStorage' },
  { claim: 'IndexedDB', symbol: 'indexedDB' },
  { claim: 'WebAssembly', symbol: 'WebAssembly|\\.wasm' },
  { claim: 'OffscreenCanvas', symbol: 'OffscreenCanvas' },
];

// 로컬 처리를 주장하는 문구. 이 중 하나라도 있으면 외부 전송 심볼이 없어야 한다.
// "일부 브라우저에서만 동작합니다"처럼 지원 범위를 말하는 문장이 걸리지 않도록
// 데이터가 나가지 않는다는 주장에 해당하는 표현만 좁혀서 매칭한다.
const LOCAL_CLAIMS = [
  '서버로 전송되지 않', '서버에 전송되지 않', '서버 업로드 없이',
  '업로드되지 않', '외부로 전송되지 않', '외부로 나가지 않',
  '기기 안에서만 처리', '브라우저에서만 처리', '브라우저 안에서만',
];

// 외부로 데이터를 내보내는 심볼 (도구가 의도적으로 쓰는 경우도 있으므로 사람이 판단)
const REMOTE_SYMBOLS = [
  'webkitSpeechRecognition', 'SpeechRecognition',
  'navigator.sendBeacon', 'new WebSocket',
];

function parts(file) {
  const src = fs.readFileSync(file, 'utf8');
  // 인라인 스크립트만 코드로 본다 (외부 src는 별도)
  const code = (src.match(/<script(?![^>]*\ssrc=)[\s\S]*?<\/script>/gi) || []).join('\n');

  // 다른 도구를 소개하는 대목은 이 페이지의 구현 주장이 아니므로 제외한다.
  // (크로스링크의 "색상 피커 - 화면에서 색상 추출 (EyeDropper)" 같은 설명)
  const prose = src
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<ul[\s\S]*?<\/ul>/gi, ' ');

  return { src, code, prose };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const findings = [];

for (const file of walk(path.join(ROOT, 'tools'))) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const { src, code, prose } = parts(file);

  // 카테고리 인덱스(tools/dev.html 등)는 다른 도구의 구현을 소개하는 것이 정상이므로
  // API 대조 대상에서 제외한다. 개별 도구 페이지만 자기 구현을 주장한다.
  const isIndex = /^tools\/[^/]+\.html$/.test(rel);

  // 1) 본문이 언급한 API가 코드에 없는 경우
  for (const { claim, symbol } of isIndex ? [] : API_CLAIMS) {
    if (!prose.includes(claim)) continue;
    if (new RegExp(symbol).test(code)) continue;
    // 외부 라이브러리가 대신 쓸 수 있으므로 CDN 스크립트가 있으면 경고 수준을 낮춘다
    const hasCdn = /<script[^>]*\ssrc="https:/.test(src);
    findings.push({
      file: rel,
      level: hasCdn ? '확인필요' : '불일치',
      msg: `본문은 ${claim}를 언급하지만 인라인 코드에 없음`,
    });
  }

  // 2) 로컬 처리를 주장하는데 외부 전송 심볼이 있는 경우
  const localClaim = LOCAL_CLAIMS.find(c => prose.includes(c));
  if (localClaim) {
    for (const sym of REMOTE_SYMBOLS) {
      if (!code.includes(sym)) continue;
      findings.push({
        file: rel,
        level: '불일치',
        msg: `"${localClaim}"라고 적었으나 ${sym} 사용 (외부 전송 가능)`,
      });
    }
  }
}

if (!findings.length) {
  console.log('불일치 없음');
} else {
  const bad = findings.filter(f => f.level === '불일치');
  const warn = findings.filter(f => f.level !== '불일치');
  for (const f of [...bad, ...warn]) console.log(`[${f.level}] ${f.file}\n           ${f.msg}`);
  console.log(`\n불일치 ${bad.length}건, 확인필요 ${warn.length}건`);
}
