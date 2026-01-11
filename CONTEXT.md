# Toolneat - Session Handoff Context

## Project Overview
**Toolneat** (toolneat.com) - A lightweight online utility tools website for AdSense side income.

## Technical Stack
- **Frontend**: Pure HTML + CSS + JavaScript (no frameworks)
- **CSS**: Tailwind v4 with `@tailwindcss/cli` (separate package required)
- **Font**: Pretendard (local hosting)
- **Server**: Static files only (no backend)
- **i18n**: `?lang=en` query parameter system (추후 중국어/일본어 추가 예정)

## Key Technical Notes

### Tailwind v4 Dark Mode
```css
/* input.css - THIS IS CRITICAL */
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```
- `@custom-variant` does NOT work - must use `@variant`
- Dark mode is class-based (`.dark` on `<html>`)

### Development Commands
```bash
npm run dev    # Tailwind watch + serve (concurrently)
npm run build  # Minified CSS for production
```

### Dynamic Component Loading
Header/footer are loaded via fetch. After loading:
1. Call `applyTranslations()` for i18n
2. Call `updateThemeIcon(isDark)` for theme icon state

### i18n 언어 변경 처리 (CRITICAL)
언어 변경 시 동적 콘텐츠 업데이트를 위해 **모든 도구**에 `i18nApplied` 이벤트 리스너 필수:
```javascript
// 언어 변경 시 자동 업데이트
document.addEventListener('i18nApplied', () => {
  // 동적 라벨/텍스트 업데이트 함수 호출
  updateLabels();
  // 필요시 재계산
  if (hasData) calculate();
});
```
- **사용 금지**: `window.switchLanguage` 오버라이드 (불안정)
- **필수 사용**: `i18nApplied` 커스텀 이벤트

### 날짜 처리 (CRITICAL - UTC 문제 방지)
```javascript
// 로컬 타임존 기반 날짜 포맷 (YYYY-MM-DD)
function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜 문자열을 로컬 Date로 파싱 (UTC 변환 방지)
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
```
- **사용 금지**: `toISOString().split('T')[0]` (UTC로 변환되어 날짜 밀림)
- **사용 금지**: `new Date("YYYY-MM-DD")` (UTC로 파싱됨)
- **필수 사용**: 위 헬퍼 함수들

## User Preferences (IMPORTANT)

### UI/UX
- Container max-width: **1200px**
- Dark mode default: **light** (save to localStorage)
- Life tools section comes **BEFORE** Dev tools on main page
- All description texts end with **periods**
- JSON formatter icon: Use `{ }` text, not line icons
- **Input/Output tools**: Side-by-side on PC (`lg:grid-cols-2`), stacked on mobile
- **Option bar**: Use `shrink-0` and `whitespace-nowrap` to prevent line breaks
- **Info section**: All pages have info box (AdSense requirement) with `bg-blue-50 dark:bg-blue-900/20`

### Ads
- **Top and bottom banners only** (no side ads)
- Mobile: same approach (responsive banners)

### Performance
- Character limits for memory protection (e.g., 20만자 for character counter)
- JSON formatter: 500KB 이상 파일 렌더링 스킵
- Use Toast notifications for user feedback

### Code Style
- Button elements should have `cursor: pointer` by default
- CSS handles this globally via `button { cursor: pointer; }`
- Dark mode button (.btn-secondary): use `dark:bg-gray-700` not `dark:bg-gray-800`
- JSON formatter font: **11px** for compact view
- JSON toggle icon: **14px × 14px** (reduced from 20px)

## File Structure Quick Reference

```
toolneat/
├── index.html              # Main page
├── tools/
│   ├── dev/               # Developer tools
│   │   └── [tool-name]/index.html
│   └── life/              # Life tools
│       └── [tool-name]/index.html
├── assets/
│   ├── css/output.css     # Tailwind build output
│   └── js/
│       ├── common.js      # Theme, toast, utils
│       ├── i18n.js        # Internationalization
│       └── components.js  # Header/footer loader
├── components/
│   ├── header.html        # Dropdown nav, theme toggle
│   └── footer.html
├── locales/
│   ├── ko.json
│   └── en.json
└── src/
    └── input.css          # Tailwind source
```

## Utilities Available (common.js)

```javascript
// Toast notifications
toast.success('Message');
toast.error('Message');
toast.warning('Message');
toast.info('Message', 5000);  // custom duration

// Clipboard
await copyToClipboard(text, buttonEl);

// Number formatting
formatNumber(1234567);  // "1,234,567"

// Debounce
const fn = debounce(callback, delay);

// Theme
toggleTheme();
updateThemeIcon(isDark);

// i18n
getCurrentLang();  // 'ko' or 'en'
t('key.path');     // Get translated string
```

## Current Status

### Completed Tools
- **Character Counter** (20만자 limit)
- **JSON Formatter** (11px font, Tab default, 500KB limit, collapsible)
- **Base64 Encode/Decode** (URL-safe option, live convert)
- **UUID Generator** (v1/v4, bulk generate, format options)
- **URL Encoder/Decoder** (3 methods, live convert)
- **Salary Calculator** (2025 rates: 국민연금 4.5%, 건강보험 3.545%, 장기요양 12.95%)
- **D-day Calculator** (local timezone, i18n weekdays/dates)
- **Unit Converter** (area/length/weight/temp/data)

### Pending (Phase 4)
- sitemap.xml
- robots.txt
- OG images
- AdSense integration

## Common Issues & Solutions

### Dark mode CSS not generating
- Check `@variant dark` syntax in input.css
- Run `npm run dev` to rebuild CSS

### i18n not applying to header/footer
- Components load async; `applyTranslations()` must be called after load

### 언어 변경 시 동적 콘텐츠 업데이트 안됨
- `i18nApplied` 이벤트 리스너 추가 필요
- 모든 동적 라벨/텍스트는 언어 변경 시 재설정

### 날짜가 하루 밀림 (크리스마스가 24일로 표시 등)
- `toISOString()` 또는 `new Date("YYYY-MM-DD")` 사용 금지
- 로컬 타임존 헬퍼 함수 사용

### Button cursor not pointer
- Tailwind preflight resets to default
- Fixed globally in input.css: `button { cursor: pointer; }`

### Dark mode button invisible
- `.btn-secondary` was using same bg as card
- Changed to `dark:bg-gray-700` (lighter than card's gray-800)

### Dark mode date input calendar icon invisible
```css
.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.5);
  opacity: 0.8;
}
```

### Dark mode scrollbar styling
```css
html.dark ::-webkit-scrollbar-thumb {
  background: #64748b;  /* gray, not blue */
}
```

## 2025 Korean Insurance Rates (연봉 계산기)
- 국민연금: **4.5%** (기준소득월액 상한 637만원)
- 건강보험: **3.545%**
- 장기요양보험: **12.95%** (건강보험료의)
- 고용보험: **0.9%**
