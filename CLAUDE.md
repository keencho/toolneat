# Toolneat 도구 추가 가이드

## 현재 도구 수
| 카테고리 | 수량 | 색상 |
|---------|-----|------|
| Dev | 35 | `from-blue-500 to-blue-600` |
| Life | 58 | `from-green-500 to-green-600` |
| PDF | 9 | `from-red-500 to-red-600` |
| Game | 5 | `from-purple-500 to-pink-500` |
| **총합** | **107** | |

---

## 도구 추가 시 필수 수정 파일

### 1. 도구 파일 생성
```
/tools/{category}/{tool-id}/index.html       ← 한글
/en/tools/{category}/{tool-id}/index.html    ← 영어
```

**필수 `<head>` 태그 (순서대로):**
```html
<head>
<!-- 1. AdSense (가장 먼저) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8846557285079359"
     crossorigin="anonymous"></script>

  <!-- 2. 기본 메타 -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>도구 이름 - Toolneat</title>
  <meta name="description" content="도구 설명">

  <!-- 3. Canonical & hreflang -->
  <link rel="canonical" href="https://toolneat.com/tools/{category}/{tool-id}/">
  <link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool-id}/">
  <link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool-id}/">
  <link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool-id}/">

  <!-- 4. Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="도구 이름 - Toolneat">
  <meta property="og:description" content="도구 설명">
  <meta property="og:url" content="https://toolneat.com/tools/{category}/{tool-id}/">
  <meta property="og:image" content="https://toolneat.com/assets/images/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#2563eb">

  <!-- 5. Favicon (전부 필수!) -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">

  <!-- 6. CSS -->
  <link rel="stylesheet" href="/assets/css/output.css">

  <!-- 7. JS -->
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
  <script src="/assets/js/common.js"></script>
  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/tools-data.js"></script>
  <script src="/assets/js/components.js"></script>
  <script src="/assets/js/search.js" defer></script>

  <!-- 8. JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "도구 이름",
    "description": "도구 설명",
    "url": "https://toolneat.com/tools/{category}/{tool-id}/",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "Toolneat", "url": "https://toolneat.com" }
  }
  </script>
</head>
```

**Body 필수:**
- `<main class="flex-1 mt-16 ...">` ← mt-16 필수 (fixed 헤더 공간)

---

### 2. 숫자 업데이트 위치 (⚠️ 가장 중요!)

| 파일 | 수정 위치 |
|-----|----------|
| `/index.html` | 카테고리 카드 숫자, 총 도구 수 |
| `/en/index.html` | 카테고리 카드 숫자, 총 도구 수 |
| `/tools/index.html` | h1 숫자, meta description |
| `/en/tools/index.html` | h1 숫자, meta description |
| `/tools/{category}/index.html` | h1 숫자, meta description |
| `/en/tools/{category}/index.html` | h1 숫자, meta description |

**검색 팁:** `grep -r "107\|35\|58\|9\|5" --include="*.html"` 로 숫자 위치 확인

---

### 3. 카테고리 인덱스에 카드 추가

| 파일 | 설명 |
|-----|------|
| `/tools/index.html` | 해당 카테고리 섹션에 도구 카드 추가 |
| `/en/tools/index.html` | 영어 버전 카드 추가 |
| `/tools/{category}/index.html` | 카테고리 목록에 카드 추가 |
| `/en/tools/{category}/index.html` | 영어 버전 카드 추가 |

---

### 4. 검색/드롭다운 데이터

**`/assets/js/tools-data.js`**
```javascript
{
  id: 'tool-id',
  path: '/tools/{category}/tool-id',
  name: { ko: '한글 이름', en: 'English Name' },
  description: { ko: '한글 설명', en: 'English description' },
  tags: ['tag1', 'tag2', '한글태그'],
  icon: 'code'
}
```

**새 카테고리 추가 시 추가 수정:**
- `/assets/js/search.js` → `categoryIcons`, `categoryLabels`, `categoryColors`
- `/assets/js/components.js` → `colorMap`

---

### 5. 번역 파일

**`/locales/ko.json`** & **`/locales/en.json`**
```json
"tools": {
  "toolId": {
    "title": "도구 이름",
    "description": "도구 설명"
  }
}
```

---

### 6. 헤더 (모바일 메뉴)

1. `/components/header.html` 수정
2. `node scripts/auto/force-update-headers.js` 실행

---

### 7. sitemap.xml

```xml
<url>
  <loc>https://toolneat.com/tools/{category}/{tool-id}</loc>
  <xhtml:link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool-id}"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool-id}"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool-id}"/>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<!-- 영어 버전도 동일하게 추가 -->
```

---

### 8. 홈페이지 프리뷰 섹션 (선택)

인기 도구로 추가할 경우:
- `/index.html` → 해당 카테고리 프리뷰 섹션
- `/en/index.html` → 영어 버전

---

## 체크리스트

```
[ ] 도구 파일 생성 (KO/EN)
[ ] 필수 head 태그 전부 포함 확인:
    - AdSense, meta, canonical, hreflang, OG tags
    - twitter:card, theme-color
    - favicon 5종 (ico, svg, 32x32, 16x16, apple-touch)
    - manifest, CSS, JS, JSON-LD
[ ] tools-data.js 추가
[ ] locales 번역 추가
[ ] 카테고리 인덱스 카드 추가 (KO/EN)
[ ] /tools/index.html 카드 추가 (KO/EN)
[ ] 숫자 업데이트 (모든 위치)
[ ] sitemap.xml 추가
[ ] 헤더 업데이트 (필요시)
[ ] CLAUDE.md 도구 목록 업데이트
```

---

## 현재 도구 목록

**Dev (35):** base64, box-shadow, case-converter, color-contrast, color-converter, color-palette, cron-generator, css-minifier, diff-checker, gradient-generator, hash-generator, html-entity, html-minifier, json-csv, json-formatter, json-validator, js-minifier, jwt-decoder, jwt-generator, line-ending, lorem-ipsum, markdown-preview, meta-tag-generator, og-preview, password-generator, regex-tester, robots-txt, sql-formatter, text-escape, timestamp-converter, url-encoder, utm-generator, uuid-generator, xml-json, yaml-json

**Life (58):** age-calculator, ai-detector, ascii-unicode, aspect-ratio, background-remover, barcode-generator, base-converter, bmi-calculator, character-counter, coin-flip, color-picker, compound-calculator, countdown-timer, dday-calculator, dead-pixel-test, dice-roller, emoji-picker, exif-remover, fake-chat, fancy-text, favicon-generator, image-blur, image-compressor, image-converter, image-crop, image-resizer, image-rotate, image-watermark, ip-lookup, korean-name-generator, loan-calculator, lottery-generator, meme-generator, mic-test, morse-code, noise-generator, ocr, percent-calculator, pixel-fixer, pomodoro-timer, qr-generator, qr-scanner, reaction-test, roulette, salary-calculator, screen-burn-test, screen-color-test, screen-recorder, sleep-calculator, speech-to-text, stopwatch, text-to-speech, tip-calculator, typing-test, unit-converter, video-to-gif, webcam-test, youtube-thumbnail

**PDF (9):** compress-pdf, delete-pdf, image-to-pdf, merge-pdf, pdf-to-image, reorder-pdf, rotate-pdf, split-pdf, watermark-pdf

**Game (5):** 2048, minesweeper, snake, memory-game, tetris

---

## 기술 참고사항

### html2canvas 사용 금지
Tailwind CSS v4의 `oklch()` 색상을 파싱 못함 → Canvas API 직접 사용

### 게임 개발
- **속도 공식:** `Math.max(50, Math.floor(1000 * Math.pow(0.75, level - 1)))`
- **DAS:** 170ms 딜레이, 50ms 반복
- **애니메이션:** `requestAnimationFrame` + 보간(lerp) 사용

### 이미지 도구 패턴
```
1. 업로드 카드 (id="uploadCard")
2. 에디터 영역 (id="editorArea", hidden)
3. 버튼: 초기화, 새 이미지, 다운로드
```

### FAQ 섹션
`<details>/<summary>` 사용 금지 → 항상 펼쳐진 형태로 작성
