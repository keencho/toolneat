// Toolneat - Internationalization (i18n)

(function() {
  'use strict';

  // Get current language from URL or localStorage
  const getLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && ['ko', 'en'].includes(urlLang)) {
      return urlLang;
    }

    return localStorage.getItem('lang') || 'ko';
  };

  // Get base path for locales (상대경로)
  const getLocalesPath = () => {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
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

  // Switch language
  window.switchLanguage = (lang) => {
    if (lang === currentLang) return;

    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update URL without reload
    const url = new URL(window.location);
    if (lang === 'ko') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);

    loadTranslations(lang);
  };

  // Get translation value
  window.t = (key) => {
    return getNestedValue(translations, key) || key;
  };

  // Get current language
  window.getCurrentLang = () => currentLang;

  // Re-apply translations (called after dynamic components load)
  window.applyTranslations = applyTranslations;

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLang);
  });
})();
