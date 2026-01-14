# Toolneat Development Context

## Project Structure
```
toolneat/
├── assets/
│   ├── css/
│   │   └── output.css          # Compiled Tailwind CSS
│   ├── icons/                  # Favicon files
│   │   ├── favicon.svg
│   │   ├── favicon-32x32.png
│   │   └── favicon-16x16.png
│   └── js/
│       ├── common.js           # Theme toggle, common utilities
│       ├── components.js       # Header/footer loader, nav handlers
│       └── i18n.js             # Internationalization system
├── components/
│   ├── header.html             # Shared header with navigation
│   └── footer.html             # Shared footer
├── docs/
│   ├── context.md              # Development context (this file)
│   ├── guide.md                # Operational guide
│   ├── plan.md                 # Tool expansion plan
│   └── 00-meta-plan.md         # SEO meta descriptions plan
├── locales/
│   ├── ko.json                 # Korean translations
│   └── en.json                 # English translations
├── scripts/
│   ├── generate-sitemap.js     # Sitemap generator
│   ├── update-favicon.js       # Favicon updater for all pages
│   └── update-meta-descriptions.js # SEO meta description updater
├── src/
│   └── input.css               # Tailwind source CSS
├── tools/
│   ├── dev/                    # Developer tools (21 tools)
│   │   ├── base64/
│   │   ├── json-formatter/
│   │   ├── uuid-generator/
│   │   └── ... (see full list below)
│   └── life/                   # Lifestyle tools (29 tools)
│       ├── salary-calculator/
│       ├── qr-generator/
│       ├── image-compressor/
│       ├── image-resizer/
│       ├── image-converter/
│       ├── barcode-generator/
│       └── ... (see full list below)
├── en/                         # English version (mirrors tools/)
│   ├── tools/dev/
│   └── tools/life/
├── index.html                  # Homepage (Korean)
├── en/index.html               # Homepage (English)
├── sitemap.xml
├── package.json
└── tailwind.config.js
```

## i18n System

### How it Works
1. Language stored in `localStorage` with key `toolneat-lang`
2. Default language: Korean (`ko`)
3. Translations loaded from `/locales/{lang}.json`
4. DOM elements with `data-i18n` attribute get translated text
5. `document.documentElement.lang` set when language changes
6. Custom event `i18nApplied` dispatched after translations applied

### Translation Attributes
- `data-i18n="key.path"` - Sets textContent
- `data-i18n-placeholder="key.path"` - Sets placeholder
- `data-i18n-title="key.path"` - Sets document.title
- `data-i18n-desc="key.path"` - Sets meta description

### Global Functions
- `window.switchLanguage(lang)` - Switch language
- `window.t(key)` - Get translation value
- `window.getCurrentLang()` - Get current language
- `window.applyTranslations()` - Re-apply translations (after dynamic content)

### Listening for Language Changes
```javascript
document.addEventListener('i18nApplied', (e) => {
  const lang = e.detail.lang;
  // Update dynamic content based on new language
});
```

## Adding New Tools

### 1. Create Tool Directory
```
tools/{dev|life}/tool-name/
└── index.html
```

### 2. Tool HTML Template
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n-title="tools.toolName.title">Tool Title</title>
  <link rel="stylesheet" href="../../../assets/css/output.css">
  <script src="../../../assets/js/common.js"></script>
  <script src="../../../assets/js/i18n.js"></script>
  <script src="../../../assets/js/components.js"></script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
  <div id="header"></div>

  <main class="container-main py-8 flex-1">
    <h1 class="text-3xl font-bold mb-2" data-i18n="tools.toolName.title">Tool Title</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8" data-i18n="tools.toolName.descriptionLong">Description</p>

    <!-- Tool content here -->
  </main>

  <div id="footer"></div>

  <script>
    // Tool-specific JavaScript
  </script>
</body>
</html>
```

### 3. Add Translations
Add to both `locales/ko.json` and `locales/en.json`:
```json
{
  "tools": {
    "toolName": {
      "title": "Tool Title",
      "description": "Short description for cards",
      "descriptionLong": "Longer description for tool page"
    }
  }
}
```

### 4. Update Navigation
Add to `components/header.html`:
- Desktop mega menu link
- Mobile accordion link

### 5. Update Homepage
Add tool card to `index.html` in appropriate section

### 6. FAQ Section (필수)
**모든 도구 페이지에 FAQ 섹션 필수 포함**

FAQ 섹션은 도구 설명, 사용 방법, 자주 묻는 질문을 포함하며 사용자 이해도와 SEO에 도움이 됨.

#### FAQ 구조
```html
<section class="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">[도구명]이란?</h2>
  <div class="prose prose-gray dark:prose-invert max-w-none text-sm">
    <p class="text-gray-600 dark:text-gray-400 mb-4">[도구에 대한 간단한 설명]</p>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">사용 방법</h3>
    <ol class="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4">
      <li>첫 번째 단계</li>
      <li>두 번째 단계</li>
      <li>세 번째 단계</li>
    </ol>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">자주 묻는 질문</h3>
    <div class="space-y-4">
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white">Q: 질문 1?</h4>
        <p class="text-gray-600 dark:text-gray-400">답변 1</p>
      </div>
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white">Q: 질문 2?</h4>
        <p class="text-gray-600 dark:text-gray-400">답변 2</p>
      </div>
      <!-- 3-4개 Q&A 권장 -->
    </div>

    <p class="text-gray-600 dark:text-gray-400 mt-4">모든 처리는 브라우저에서 이루어지며 서버로 전송되지 않습니다.</p>
  </div>
</section>
```

#### FAQ 작성 가이드라인
- **도구 설명**: 1-2문장으로 도구가 무엇을 하는지 설명
- **사용 방법**: 3-5단계로 간결하게 작성
- **Q&A**: 사용자가 실제로 궁금해할 만한 질문 3-4개
  - 기술적 제한사항 (파일 크기, 지원 형식 등)
  - 품질/출력 관련
  - 개인정보/보안 관련
  - 일반적인 사용 팁
- **개인정보 안내**: 브라우저 처리임을 명시 (신뢰성 향상)

## Styling Guidelines

### CSS Classes (Tailwind)
- Container: `container-main` (custom utility)
- Cards: `bg-white dark:bg-gray-800 rounded-2xl shadow-lg`
- Inputs: `w-full px-4 py-3 rounded-xl border ...`
- Buttons: `px-6 py-3 rounded-xl bg-blue-600 text-white ...`

### Color Scheme
- Primary: Blue (`blue-600`, `blue-500`)
- Dark mode background: `gray-900`, `gray-800`
- Light mode background: `gray-50`, `white`

## Common Patterns

### File Upload with Drag & Drop
```javascript
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  // Handle file
});
```

### Copy to Clipboard
```javascript
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show success toast
  });
}
```

### Toast Notification
```html
<div id="toast" class="fixed bottom-4 left-1/2 -translate-x-1/2 hidden">
  <div class="bg-green-500 text-white px-4 py-2 rounded-lg">Copied!</div>
</div>
```

## Known Issues
1. Some table headers in Base Converter still show Korean in English mode
2. Mobile viewport testing via browser resize may not accurately reflect device behavior


### sitemap.xml
Must be added to sitemap.xml when creating a new tool page. Set the default to ko according to the existing form, and en needs to be added.
Use `node scripts/generate-sitemap.js` to regenerate sitemap.

---

## SEO Optimization

### Meta Description Guidelines (필수)
**모든 페이지에 meta description 필수 작성**
- Korean: 80-150 characters
- English: 150-160 characters (Google optimal)
- Include action words: "무료", "온라인", "바로 사용"
- Place main keywords at the beginning
- Write natural sentences, not keyword lists
- Make each page description unique

### Favicon Setup (All Pages)
```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
```
Use absolute paths (`/assets/`) for all favicon links.

### Open Graph & JSON-LD (필수)
모든 도구 페이지에 포함되어야 함:
- **OG 태그**: 카톡/SNS 링크 공유 미리보기
- **JSON-LD**: 구글 검색결과 리치 스니펫 (무료 · 웹 앱)

### Scripts
- `node scripts/update-meta-descriptions.js` - Update all meta descriptions
- `node scripts/update-favicon.js` - Add favicon links to all pages
- `node scripts/generate-sitemap.js` - Regenerate sitemap.xml
- `node scripts/add-seo-tags.js` - Add OG tags & JSON-LD to tool pages
- `node scripts/inject-components.js` - Inject header/footer at build time

---

## Tool Lists

### Dev Tools (21)
base64, url-encoder, html-entity, uuid-generator, hash-generator, lorem-ipsum, jwt-generator, jwt-decoder, password-generator, cron-generator, json-formatter, color-converter, timestamp-converter, yaml-json, markdown-preview, case-converter, sql-formatter, css-minifier, line-ending, regex-tester, diff-checker

### Life Tools (29)
salary-calculator, dday-calculator, bmi-calculator, loan-calculator, age-calculator, percent-calculator, compound-calculator, tip-calculator, character-counter, unit-converter, qr-generator, barcode-generator, favicon-generator, image-compressor, image-resizer, image-converter, base-converter, ascii-unicode, emoji-picker, dead-pixel-test, pixel-fixer, screen-burn-test, screen-color-test, lottery-generator, roulette, dice-roller, coin-flip, typing-test, reaction-test

### Barcode Formats Supported (18)
CODE128, CODE39, EAN-13, EAN-8, EAN-5, EAN-2, UPC-A, UPC-E, ITF-14, ITF, MSI, MSI-10, MSI-11, MSI-1010, Pharmacode, Codabar
