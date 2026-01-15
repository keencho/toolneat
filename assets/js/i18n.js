// Toolneat - Internationalization (i18n)

(function() {
  'use strict';

  // Detect language from URL path (en/ prefix means English, otherwise Korean)
  const getLanguageFromURL = () => {
    const path = window.location.pathname;
    return path.startsWith('/en/') || path === '/en' ? 'en' : 'ko';
  };

  // Get current language from URL
  const getLanguage = () => {
    return getLanguageFromURL();
  };

  // Get base path for locales (상대경로)
  const getLocalesPath = () => {
    const path = window.location.pathname;
    const isEnglish = path.startsWith('/en/') || path === '/en';
    // For English pages, go up one extra level
    let depth = path.split('/').filter(Boolean).length;
    if (depth === 0) return './locales';
    return '../'.repeat(depth) + 'locales';
  };

  // Current language
  let currentLang = getLanguage();
  let translations = {};

  // Load translations
  const loadTranslations = async (lang) => {
    try {
      const basePath = getLocalesPath();
      const response = await fetch(`${basePath}/${lang}.json`);

      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }

      translations = await response.json();
      document.documentElement.lang = lang;
      applyTranslations();
      updateLangButtons();

    } catch (error) {
      console.error('i18n load error:', error);

      // Fallback to Korean if English fails
      if (lang !== 'ko') {
        await loadTranslations('ko');
      }
    }
  };

  // Apply translations to DOM
  const applyTranslations = () => {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = getNestedValue(translations, key);
      if (value) el.textContent = value;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = getNestedValue(translations, key);
      if (value) el.placeholder = value;
    });

    // Custom text (for select options etc.)
    document.querySelectorAll('[data-i18n-text]').forEach(el => {
      const key = el.dataset.i18nText;
      const value = getNestedValue(translations, key);
      if (value) el.textContent = value;
    });

    // Title
    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) {
      const key = titleEl.dataset.i18nTitle;
      const value = getNestedValue(translations, key);
      if (value) document.title = value;
    }

    // Meta description
    const descEl = document.querySelector('meta[data-i18n-desc]');
    if (descEl) {
      const key = descEl.dataset.i18nDesc;
      const value = getNestedValue(translations, key);
      if (value) descEl.setAttribute('content', value);
    }

    // Dispatch event for page-specific handlers
    document.dispatchEvent(new CustomEvent('i18nApplied', { detail: { lang: currentLang } }));
  };

  // Get nested object value by dot notation
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Update language toggle buttons
  const updateLangButtons = () => {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const btnLang = btn.dataset.lang;
      btn.classList.toggle('font-bold', btnLang === currentLang);
      btn.classList.toggle('text-blue-600', btnLang === currentLang);
      btn.classList.toggle('dark:text-blue-400', btnLang === currentLang);
    });
  };

  // Switch language - navigate to corresponding URL path
  window.switchLanguage = (lang) => {
    if (lang !== currentLang) {
      const path = window.location.pathname;
      let newPath;

      if (lang === 'en') {
        // Korean -> English: add /en prefix
        if (path === '/' || path === '') {
          newPath = '/en/';
        } else {
          newPath = '/en' + path;
        }
      } else {
        // English -> Korean: remove /en prefix
        if (path === '/en' || path === '/en/') {
          newPath = '/';
        } else {
          newPath = path.replace(/^\/en/, '');
        }
      }

      // Navigate to new path
      window.location.href = newPath;
    }
  };

  // Translation function
  const translateFn = (key) => {
    return getNestedValue(translations, key) || key;
  };

  // Set translation function globally (will be re-set after translations load to handle Fuse.js conflict)
  window.t = translateFn;

  // Get current language
  window.getCurrentLang = () => currentLang;

  // Re-apply translations (called after dynamic components load)
  window.applyTranslations = applyTranslations;

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Re-assign window.t here to handle Fuse.js overwriting it
    // Fuse.js uses 'var t' globally which can overwrite window.t
    window.t = translateFn;
    loadTranslations(currentLang);
  });
})();
