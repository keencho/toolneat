# Toolneat Development Context

## Project Structure
```
toolneat/
├── assets/
│   ├── css/
│   │   └── output.css          # Compiled Tailwind CSS
│   └── js/
│       ├── common.js           # Theme toggle, common utilities
│       ├── components.js       # Header/footer loader, nav handlers
│       └── i18n.js             # Internationalization system
├── components/
│   ├── header.html             # Shared header with navigation
│   └── footer.html             # Shared footer
├── locales/
│   ├── ko.json                 # Korean translations
│   └── en.json                 # English translations
├── src/
│   └── input.css               # Tailwind source CSS
├── tools/
│   ├── dev/                    # Developer tools
│   │   ├── base64/
│   │   ├── json-formatter/
│   │   ├── uuid-generator/
│   │   └── ...
│   └── life/                   # Lifestyle tools
│       ├── salary-calculator/
│       ├── qr-generator/
│       ├── image-compressor/   # NEW
│       ├── barcode-generator/  # NEW
│       ├── base-converter/     # NEW
│       ├── favicon-generator/  # NEW
│       ├── ascii-unicode/      # NEW
│       ├── emoji-picker/       # NEW
│       └── ...
├── index.html                  # Homepage
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
