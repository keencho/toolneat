// Toolneat - Component Loader

(function() {
  'use strict';

  // Get base path for components (상대경로)
  const getComponentsPath = () => {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    if (depth === 0) return './components';
    return '../'.repeat(depth) + 'components';
  };

  // Load HTML component
  const loadComponent = async (name) => {
    try {
      const basePath = getComponentsPath();
      const response = await fetch(`${basePath}/${name}.html`);

      if (!response.ok) {
        throw new Error(`Failed to load ${name}.html`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Component load error (${name}):`, error);
      return '';
    }
  };

  // Initialize components
  const initComponents = async () => {
    const headerEl = document.getElementById('header');
    const footerEl = document.getElementById('footer');

    // Skip fetch if already injected (build-time injection)
    const headerNeedsLoad = headerEl && !headerEl.innerHTML.trim();
    const footerNeedsLoad = footerEl && !footerEl.innerHTML.trim();

    // Load in parallel (only if needed)
    const [headerHtml, footerHtml] = await Promise.all([
      headerNeedsLoad ? loadComponent('header') : Promise.resolve(''),
      footerNeedsLoad ? loadComponent('footer') : Promise.resolve('')
    ]);

    if (headerNeedsLoad && headerHtml) {
      headerEl.innerHTML = headerHtml;
    }
    if (headerEl) {
      initHeader();
    }

    if (footerNeedsLoad && footerHtml) {
      footerEl.innerHTML = footerHtml;
    }

    // Fix nav links for English pages
    const isEnglish = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
    if (isEnglish) {
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('/en')) {
          link.setAttribute('href', '/en' + href);
        }
      });
    }

    // Update theme icon after header loads
    if (typeof updateThemeIcon === 'function') {
      updateThemeIcon(document.documentElement.classList.contains('dark'));
    }

    // Re-apply translations to dynamically loaded components
    if (typeof applyTranslations === 'function') {
      applyTranslations();
    }
  };

  // Initialize header functionality
  const initHeader = () => {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (typeof toggleTheme === 'function') {
          toggleTheme();
        }
      });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        if (menuIcon && closeIcon) {
          menuIcon.classList.toggle('hidden', !isHidden);
          closeIcon.classList.toggle('hidden', isHidden);
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          if (menuIcon && closeIcon) {
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
        }
      });
    }

    // Mobile accordion (1st level)
    document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accordion = btn.closest('.mobile-accordion');
        const content = accordion.querySelector('.mobile-accordion-content');
        const arrow = btn.querySelector('svg:last-child');

        content.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
      });
    });

    // Mobile sub-accordion (2nd level)
    document.querySelectorAll('.mobile-sub-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const subAccordion = btn.closest('.mobile-sub-accordion');
        const content = subAccordion.querySelector('.mobile-sub-content');
        const arrow = btn.querySelector('svg');

        content.classList.toggle('hidden');
        btn.classList.toggle('active');
        if (arrow) {
          arrow.classList.toggle('rotate-180');
        }
      });
    });

    // Language buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        if (typeof switchLanguage === 'function') {
          switchLanguage(lang);
        }
      });
    });
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', initComponents);
})();
