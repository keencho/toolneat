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

    // Initialize tools dropdown (PC only)
    initToolsDropdown();

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

    // Search buttons (desktop and mobile)
    const headerSearchBtn = document.getElementById('header-search-btn');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');

    const handleSearchClick = () => {
      if (typeof window.openSearch === 'function') {
        window.openSearch();
      }
    };

    if (headerSearchBtn) {
      headerSearchBtn.addEventListener('click', handleSearchClick);
    }
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', handleSearchClick);
    }
  };

  // Initialize tools dropdown (PC - 헤더 아래 붙는 드롭다운)
  const initToolsDropdown = () => {
    const dropdown = document.getElementById('tools-dropdown');
    if (!dropdown) return;

    const backdrop = document.getElementById('tools-dropdown-backdrop');
    const closeBtn = document.getElementById('tools-dropdown-close');
    const searchInput = document.getElementById('tools-dropdown-search');
    const tabBtns = dropdown.querySelectorAll('.tools-tab');
    const grid = document.getElementById('tools-grid');
    const triggerBtns = document.querySelectorAll('.tools-overlay-trigger');

    // Current state
    let currentCategory = 'all';
    let currentSearch = '';

    // Get current language
    const getLang = () => {
      const isEnglish = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
      return isEnglish ? 'en' : 'ko';
    };

    // Update tab styles
    const updateTabStyles = () => {
      tabBtns.forEach(btn => {
        const isActive = btn.dataset.tab === currentCategory;
        btn.classList.toggle('bg-blue-600', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-100', !isActive);
        btn.classList.toggle('dark:bg-gray-800', !isActive);
        btn.classList.toggle('text-gray-600', !isActive);
        btn.classList.toggle('dark:text-gray-400', !isActive);
      });
    };

    // Open dropdown
    const openDropdown = (category = 'all') => {
      currentCategory = category;
      dropdown.classList.remove('hidden');
      backdrop.classList.remove('hidden');

      updateTabStyles();

      // Clear search and render
      if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
      }
      renderTools();

      // Focus search
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    };

    // Close dropdown
    const closeDropdown = () => {
      dropdown.classList.add('hidden');
      backdrop.classList.add('hidden');
    };

    // Get tools by category (including 'all')
    const getTools = () => {
      if (typeof TOOLS_DATA === 'undefined') return [];

      if (currentCategory === 'all') {
        return [
          ...TOOLS_DATA.dev.map(t => ({ ...t, category: 'dev' })),
          ...TOOLS_DATA.pdf.map(t => ({ ...t, category: 'pdf' })),
          ...TOOLS_DATA.life.map(t => ({ ...t, category: 'life' }))
        ];
      }
      return (TOOLS_DATA[currentCategory] || []).map(t => ({ ...t, category: currentCategory }));
    };

    // Render tools grid
    const renderTools = () => {
      if (!grid) return;

      const lang = getLang();
      const isEnglish = lang === 'en';
      let tools = getTools();

      // Filter by search
      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        tools = tools.filter(tool => {
          const name = (tool.name[lang] || tool.name.ko).toLowerCase();
          const desc = (tool.description[lang] || tool.description.ko).toLowerCase();
          const tags = tool.tags.join(' ').toLowerCase();
          return name.includes(query) || desc.includes(query) || tags.includes(query);
        });
      }

      // Build HTML
      if (tools.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            ${lang === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </div>
        `;
        return;
      }

      // Category colors
      const colorMap = {
        dev: 'from-blue-500 to-blue-600',
        life: 'from-green-500 to-green-600',
        pdf: 'from-red-500 to-red-600'
      };

      grid.innerHTML = tools.map(tool => {
        const path = isEnglish ? `/en${tool.path}` : tool.path;
        const name = tool.name[lang] || tool.name.ko;
        const gradient = colorMap[tool.category] || colorMap.dev;

        return `
          <a href="${path}" class="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div class="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">${name}</span>
          </a>
        `;
      }).join('');
    };

    // Event: Trigger buttons (헤더의 Dev/PDF/Life 버튼)
    triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.dataset.category || 'all';

        // Toggle: 이미 열려있고 같은 카테고리면 닫기
        if (!dropdown.classList.contains('hidden') && currentCategory === category) {
          closeDropdown();
        } else {
          openDropdown(category);
        }
      });
    });

    // Event: Close
    if (backdrop) {
      backdrop.addEventListener('click', closeDropdown);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDropdown);
    }

    // Event: ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dropdown.classList.contains('hidden')) {
        closeDropdown();
      }
    });

    // Event: Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.tab || 'all';
        updateTabStyles();
        renderTools();
      });
    });

    // Event: Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderTools();
      });
    }
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', initComponents);
})();
