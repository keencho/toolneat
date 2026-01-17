# Toolneat 도구 추가 가이드

## 현재 도구 수
**Dev 35, Life 51, PDF 9, 총 95개**

---

## 현재 도구 목록 (중복 방지용)

**⚠️ 도구 추가/삭제 시 이 목록도 업데이트할 것!**

**Dev (35):** base64, box-shadow, case-converter, color-contrast, color-converter, color-palette, cron-generator, css-minifier, diff-checker, gradient-generator, hash-generator, html-entity, html-minifier, json-csv, json-formatter, json-validator, js-minifier, jwt-decoder, jwt-generator, line-ending, lorem-ipsum, markdown-preview, meta-tag-generator, og-preview, password-generator, regex-tester, robots-txt, sql-formatter, text-escape, timestamp-converter, url-encoder, utm-generator, uuid-generator, xml-json, yaml-json

**Life (51):** age-calculator, ai-detector, ascii-unicode, aspect-ratio, background-remover, barcode-generator, base-converter, bmi-calculator, character-counter, coin-flip, color-picker, compound-calculator, countdown-timer, dday-calculator, dead-pixel-test, dice-roller, emoji-picker, exif-remover, favicon-generator, image-compressor, image-converter, image-crop, image-resizer, image-rotate, image-watermark, ip-lookup, loan-calculator, lottery-generator, meme-generator, morse-code, noise-generator, ocr, percent-calculator, pixel-fixer, pomodoro-timer, qr-generator, qr-scanner, reaction-test, roulette, salary-calculator, screen-burn-test, screen-color-test, screen-recorder, speech-to-text, stopwatch, text-to-speech, tip-calculator, typing-test, unit-converter, video-to-gif, youtube-thumbnail

**PDF (9):** compress-pdf, delete-pdf, image-to-pdf, merge-pdf, pdf-to-image, reorder-pdf, rotate-pdf, split-pdf, watermark-pdf

---

## 헤더 시스템 (중요!)

### 헤더 구조
```
헤더: fixed top-0, z-50, 높이 64px (h-16)
드롭다운: fixed top-16, z-60
Backdrop: fixed top-16, z-55
```

### ⚠️ 헤더가 fixed이므로 main에 mt-16 필수!
```html
<!-- 올바른 예시 -->
<main class="flex-1 mt-16 py-8 md:py-12">

<!-- 잘못된 예시 (콘텐츠가 헤더에 가려짐) -->
<main class="flex-1 py-8 md:py-12">
```

### PC 드롭다운 메뉴
- Dev/PDF/Life 버튼 클릭 시 헤더 아래 드롭다운 열림
- 도구 목록: `/assets/js/tools-data.js`의 `TOOLS_DATA`에서 동적 로드
- JS 로직: `/assets/js/components.js`의 `initToolsDropdown()`

### 드롭다운 i18n 키
- `nav.all`: "전체" 탭
- `nav.searchPlaceholder`: 검색 placeholder
- `nav.dev`, `nav.pdf`, `nav.life`: 카테고리 탭

### 헤더 수정 시 해야 할 것
1. `/components/header.html` 수정
2. `node scripts/auto/force-update-headers.js` 실행 (모든 HTML 파일 업데이트)

### force-update-headers.js
- `<div id="header">...</div>` 내용을 `/components/header.html`로 교체
- 깨진 HTML은 자동 수정 안 됨 → `fix-duplicate-headers.js` 사용

---

## 새 도구 추가 체크리스트

### 1. 파일 생성
- [ ] `/tools/{category}/{tool}/index.html`
- [ ] `/en/tools/{category}/{tool}/index.html`

### 2. 번역 키
- [ ] `/locales/ko.json` - tools.{key}.title, description
- [ ] `/locales/en.json` - tools.{key}.title, description

### 3. sitemap.xml
- [ ] 한글 URL + 영어 URL 둘 다 추가

### 4. 도구 목록 페이지
- [ ] `/tools/index.html` - 카드 + 숫자 업데이트
- [ ] `/en/tools/index.html` - 카드 + 숫자 업데이트

### 5. 카테고리 인덱스
- [ ] `/tools/{category}/index.html` - 카드 + 숫자
- [ ] `/en/tools/{category}/index.html` - 카드 + 숫자

### 6. 헤더 (Mobile Accordion)
- [ ] `/components/header.html` - 모바일 메뉴에 도구 추가
- [ ] `node scripts/auto/force-update-headers.js` 실행

### 7. 검색 데이터
- [ ] `/assets/js/tools-data.js` - TOOLS_DATA에 도구 추가

### 8. 홈페이지 숫자
- [ ] `/index.html` - 카테고리 카드 숫자
- [ ] `/en/index.html` - 카테고리 카드 숫자

### 9. 이 파일 업데이트
- [ ] CLAUDE.md 도구 목록 + 숫자 업데이트

---

## 숫자 업데이트 위치

| 파일 | 위치 |
|-----|------|
| `/index.html` | 카테고리 카드 숫자 |
| `/tools/index.html` | meta, 본문, 필터버튼 |
| `/tools/dev/index.html` | meta, 본문, 필터버튼 |
| `/tools/life/index.html` | meta, 본문, 필터버튼 |

**영어 버전도 `/en/` 경로에서 동일하게 수정!**

---

## 도구 페이지 필수 구조

```html
<body class="min-h-screen flex flex-col">
  <div id="header"></div>

  <!-- ⚠️ mt-16 필수! (fixed 헤더 64px 공간 확보) -->
  <main class="flex-1 mt-16 py-8 md:py-12">
    <div class="container-main">
      <div class="mb-6">
        <h1>도구명</h1>
        <p>설명</p>
      </div>
      <div class="card"><!-- 도구 UI --></div>
      <section class="mt-8"><!-- FAQ 섹션 --></section>
    </div>
  </main>

  <div id="footer"></div>
</body>
```

---

## tools-data.js 형식

```js
{
  id: 'tool-id',
  path: '/tools/category/tool-id',
  name: { ko: '한글 이름', en: 'English Name' },
  description: { ko: '한글 설명', en: 'English description' },
  tags: ['tag1', 'tag2', '한글태그'],
  icon: 'code'
}
```

---

## ⚠️ 자주 놓치는 실수

### 1. main에 mt-16 누락
- 헤더가 `fixed`라서 `mt-16` 없으면 콘텐츠가 헤더에 가려짐
- 모든 페이지의 `<main>`에 `mt-16` 필수

### 2. tools-data.js 누락
- 이걸 빠뜨리면 Ctrl+K 검색 + PC 드롭다운에서 도구 안 보임

### 3. 언어 불일치
- KO 페이지는 한글, EN 페이지는 영어로 기본 텍스트 작성
- `data-i18n` 있어도 기본 텍스트가 해당 언어여야 함

### 4. Textarea 리사이즈
- `.textarea` 클래스 사용 금지 (resize: none 들어있음)
- `<style>` 블록으로 직접 스타일 정의

### 5. 버튼 아이콘 정렬
- SVG 있으면 `flex items-center justify-center` 추가

---

## 스크립트 목록

| 스크립트 | 용도 |
|---------|------|
| `node scripts/auto/force-update-headers.js` | 모든 HTML 헤더 업데이트 |
| `node scripts/auto/fix-duplicate-headers.js` | 중복 헤더 제거 |

---

## 카테고리별 색상
- **Dev**: blue(인코딩), purple(생성기), green(변환기), orange(테스터)
- **Life**: green, pink, indigo, yellow, cyan
- **PDF**: red

## applicationCategory (JSON-LD)
- Dev: `DeveloperApplication`
- Life/PDF: `UtilitiesApplication`
