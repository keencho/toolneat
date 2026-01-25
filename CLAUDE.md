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
/tools/{category}/{tool-id}.html       ← 한글
/en/tools/{category}/{tool-id}.html    ← 영어
```
⚠️ **폴더/index.html 구조 사용 금지!** → Cloudflare Pages에서 trailing slash 리다이렉트 발생

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

  <!-- 3. Canonical & hreflang (⚠️ trailing slash 금지!) -->
  <link rel="canonical" href="https://toolneat.com/tools/{category}/{tool-id}">
  <link rel="alternate" hreflang="ko" href="https://toolneat.com/tools/{category}/{tool-id}">
  <link rel="alternate" hreflang="en" href="https://toolneat.com/en/tools/{category}/{tool-id}">
  <link rel="alternate" hreflang="x-default" href="https://toolneat.com/tools/{category}/{tool-id}">

  <!-- 4. Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="도구 이름 - Toolneat">
  <meta property="og:description" content="도구 설명">
  <meta property="og:url" content="https://toolneat.com/tools/{category}/{tool-id}">
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
    "url": "https://toolneat.com/tools/{category}/{tool-id}",
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
2. `node scripts/auto/inject-components.js` 실행 (또는 빌드 시 자동)

---

### 7. sitemap.xml

자동 생성됨: `node scripts/auto/generate-sitemap.js`

⚠️ **URL에 trailing slash 절대 금지!**

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

## ⚠️ URL 규칙 (중요!)

### Trailing Slash 금지
모든 URL에 trailing slash(`/`) 사용 금지. Cloudflare Pages 리다이렉트 방지.

```
❌ https://toolneat.com/tools/dev/
✅ https://toolneat.com/tools/dev

❌ href="/en/"
✅ href="/en"
```

**적용 위치:**
- `<link rel="canonical">`
- `<link rel="alternate" hreflang>`
- `<meta property="og:url">`
- JSON-LD `"url"`
- 모든 내부 링크 `href`
- sitemap.xml

### 파일 구조
```
❌ /tools/dev/hash-generator/index.html  (폴더 구조 → trailing slash 리다이렉트 발생)
✅ /tools/dev/hash-generator.html        (파일 구조 → 리다이렉트 없음)
```

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

---

## 블로그 추가 가이드

### 현재 블로그 수
| 언어 | 수량 |
|-----|------|
| 한글 (KO) | 12 |
| 영어 (EN) | 12 |
| **총합** | **24** |

---

### 1. 블로그 파일 생성
```
/blog/{post-id}.html       ← 한글
/en/blog/{post-id}.html    ← 영어
```
⚠️ **폴더/index.html 구조 사용 금지!** → Cloudflare Pages에서 trailing slash 리다이렉트 발생

**필수 `<head>` 태그 (순서대로):**
```html
<head>
<!-- 1. AdSense (가장 먼저) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8846557285079359"
     crossorigin="anonymous"></script>

  <!-- 2. 기본 메타 -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>블로그 제목 - Toolneat</title>
  <meta name="description" content="블로그 설명 (150자 이내)">

  <!-- 3. Canonical & hreflang (⚠️ trailing slash 금지!) -->
  <link rel="canonical" href="https://toolneat.com/blog/{post-id}">
  <link rel="alternate" hreflang="ko" href="https://toolneat.com/blog/{post-id}">
  <link rel="alternate" hreflang="en" href="https://toolneat.com/en/blog/{post-id}">
  <link rel="alternate" hreflang="x-default" href="https://toolneat.com/blog/{post-id}">

  <!-- 4. Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Toolneat">
  <meta property="og:title" content="블로그 제목 - Toolneat">
  <meta property="og:description" content="블로그 설명">
  <meta property="og:url" content="https://toolneat.com/blog/{post-id}">
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

  <!-- 8. JSON-LD Schema (BlogPosting) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "블로그 제목",
    "description": "블로그 설명",
    "datePublished": "2025-01-25",
    "dateModified": "2025-01-25",
    "author": { "@type": "Organization", "name": "Toolneat" },
    "publisher": { "@type": "Organization", "name": "Toolneat", "url": "https://toolneat.com" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://toolneat.com/blog/{post-id}" },
    "inLanguage": "ko"
  }
  </script>
</head>
```

---

### 2. 블로그 본문 구조
```html
<main class="flex-1 mt-16">
  <article class="max-w-3xl mx-auto px-4 py-12">
    <!-- 메타 정보 -->
    <div class="mb-8">
      <span class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 ... rounded-full">개발</span>
      <h1 class="text-3xl font-bold mt-4 mb-2">블로그 제목</h1>
      <time class="text-sm text-gray-500">2025년 1월 25일</time>
    </div>

    <!-- 본문 (~1500자 이상 권장) -->
    <div class="prose dark:prose-invert max-w-none">
      <p>본문 내용...</p>
      <h2>섹션 제목</h2>
      <p>섹션 내용...</p>
    </div>

    <!-- 관련 도구 (⚠️ 화살표 → 사용 금지!) -->
    <div class="mt-12 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">관련 도구</h3>
      <div class="flex flex-wrap gap-3">
        <a href="/tools/category/tool-id" class="text-blue-600 hover:underline">도구 이름</a>
        <a href="/tools/category/tool-id2" class="text-blue-600 hover:underline">도구 이름2</a>
      </div>
    </div>
  </article>
</main>
```

---

### 3. 블로그 목록에 카드 추가
블로그 글 추가 시 목록 페이지에 카드 추가 필수:

| 파일 | 설명 |
|-----|------|
| `/blog.html` | 한글 블로그 목록에 카드 추가 |
| `/en/blog.html` | 영어 블로그 목록에 카드 추가 |

**카드 템플릿 (전체 클릭 가능):**
```html
<a href="/blog/{post-id}" class="block">
  <article class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer h-full">
    <div class="p-6">
      <span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full mb-3">개발</span>
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">블로그 제목</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">블로그 요약 설명...</p>
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <span>2025년 1월 25일</span>
        <span class="text-blue-600 dark:text-blue-400">자세히 보기 →</span>
      </div>
    </div>
  </article>
</a>
```

**카테고리 색상:**
- 개발 (Dev): `bg-blue-100 text-blue-700` / `bg-blue-900 text-blue-300`
- 생활 (Life): `bg-orange-100 text-orange-700` / `bg-orange-900 text-orange-300`
- 일반: `bg-gray-100 text-gray-700` / `bg-gray-900 text-gray-300`

---

### 4. sitemap.xml 업데이트
자동 생성됨: `node scripts/auto/generate-sitemap.js`

블로그 디렉토리도 자동 스캔됨.

---

### 5. 블로그 체크리스트

```
[ ] 블로그 파일 생성 (KO/EN)
[ ] 필수 head 태그 전부 포함 확인:
    - AdSense, meta, canonical, hreflang, OG tags
    - og:type = "article" (블로그용)
    - JSON-LD BlogPosting 스키마
[ ] 본문 1500자 이상 작성
[ ] 관련 도구 링크 추가 (→ 화살표 사용 금지!)
[ ] /blog.html 카드 추가 (KO/EN)
[ ] sitemap.xml 자동 생성 실행
[ ] CLAUDE.md 블로그 목록 업데이트
```

---

### 6. 현재 블로그 목록

**한글 (12):**
- hash-guide - 해시 함수 완벽 가이드
- regex-tutorial - 정규표현식 입문 가이드
- base64-encoding - Base64 인코딩의 원리
- jwt-explained - JWT 토큰 이해하기
- json-yaml-xml - JSON vs YAML vs XML 비교
- qr-code-guide - 무료 QR코드 만들기 가이드
- image-compress-guide - 이미지 용량 줄이기 가이드
- pdf-merge-guide - PDF 합치기 완벽 가이드
- password-guide - 안전한 비밀번호 만들기
- screen-recorder-guide - 화면 녹화 방법
- bmi-guide - BMI 계산하는 방법
- typing-test-guide - 타이핑 속도 측정 가이드

**영어 (12):**
- hash-guide - Complete Guide to Hash Functions
- regex-tutorial - Beginner's Guide to Regular Expressions
- base64-encoding - Understanding Base64 Encoding
- jwt-explained - Understanding JWT Tokens
- json-yaml-xml - JSON vs YAML vs XML Comparison
- qr-code-guide - Free QR Code Generator Guide
- image-compress-guide - Image Compression Guide
- pdf-merge-guide - PDF Merge Guide
- password-guide - Password Security Guide
- screen-recorder-guide - Screen Recording Guide
- bmi-guide - BMI Calculator Guide
- typing-test-guide - Typing Speed Test Guide

---

### 7. 검색 정책
**Ctrl+K 검색에 블로그 포함하지 않음** - 사이트 핵심 기능인 도구에 집중.

---

### 8. AdSense 승인 팁
- 각 글 **1300자 이상** 작성
- **관련 도구 링크** 필수 포함
- AI 생성 느낌 최소화 (다양한 시작 문장, 개인적 톤)
- SEO 최적화: JSON-LD BlogPosting 스키마
