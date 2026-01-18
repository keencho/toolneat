/**
 * Toolneat - Global Search (Cmd+K / Ctrl+K)
 * Fuzzy search using Fuse.js
 */

(function() {
  'use strict';

  let fuse = null;
  let isOpen = false;
  let selectedIndex = 0;
  let filteredResults = [];
  let searchModal = null;
  let searchInput = null;
  let resultsContainer = null;

  // Fuse.js options for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'name.ko', weight: 3 },
      { name: 'name.en', weight: 3 },
      { name: 'description.ko', weight: 2 },
      { name: 'description.en', weight: 2 },
      { name: 'tags', weight: 1 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true
  };

  // Icons for categories
  const categoryIcons = {
    dev: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
    life: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
    pdf: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
    game: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  };

  const categoryLabels = {
    dev: { ko: '개발 도구', en: 'Dev Tools' },
    life: { ko: '생활 도구', en: 'Life Tools' },
    pdf: { ko: 'PDF 도구', en: 'PDF Tools' },
    game: { ko: '게임', en: 'Games' }
  };

  // Category-specific colors for icons
  const categoryColors = {
    dev: 'from-blue-500 to-blue-600',
    life: 'from-green-500 to-green-600',
    pdf: 'from-red-500 to-red-600',
    game: 'from-purple-500 to-pink-500'
  };

  /**
   * Initialize search functionality
   */
  function initSearch() {
    // Initialize Fuse.js with all tools
    if (typeof ALL_TOOLS !== 'undefined') {
      fuse = new Fuse(ALL_TOOLS, fuseOptions);
    }

    // Create modal HTML
    createSearchModal();

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);

    // Check if search buttons exist and add listeners
    const searchBtns = [
      'header-search-btn',
      'mobile-search-btn',
      'all-tools-search-btn'
    ];

    searchBtns.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', openSearch);
      }
    });
  }

  /**
   * Create search modal DOM
   */
  function createSearchModal() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'ko';
    const placeholderText = lang === 'ko' ? '도구 검색...' : 'Search tools...';
    const recentText = lang === 'ko' ? '최근 검색' : 'Recent searches';
    const popularText = lang === 'ko' ? '인기 도구' : 'Popular tools';
    const noResultsText = lang === 'ko' ? '검색 결과가 없습니다' : 'No results found';
    const navigateText = lang === 'ko' ? '이동' : 'Navigate';
    const selectText = lang === 'ko' ? '선택' : 'Select';
    const closeText = lang === 'ko' ? '닫기' : 'Close';

    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'fixed inset-0 z-[9999] hidden flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="search-backdrop"></div>
      <div class="relative w-full max-w-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              id="search-input"
              class="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
              placeholder="${placeholderText}"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
            >
            <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div id="search-results" class="max-h-[60vh] overflow-y-auto">
            <!-- Dynamic content -->
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-4 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↑</kbd>
              <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↓</kbd>
              ${navigateText}
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↵</kbd>
              ${selectText}
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">esc</kbd>
              ${closeText}
            </span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    searchModal = modal;
    searchInput = document.getElementById('search-input');
    resultsContainer = document.getElementById('search-results');

    // Event listeners
    document.getElementById('search-backdrop').addEventListener('click', closeSearch);
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  /**
   * Handle global keyboard shortcuts
   */
  function handleKeydown(e) {
    // Cmd+K or Ctrl+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    }

    // Escape to close
    if (e.key === 'Escape' && isOpen) {
      closeSearch();
    }
  }

  /**
   * Handle search input keydown for navigation
   */
  function handleSearchKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectNext();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectPrev();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigateToSelected();
    }
  }

  /**
   * Open search modal
   */
  function openSearch() {
    if (!searchModal) return;

    isOpen = true;
    searchModal.classList.remove('hidden');
    searchInput.value = '';
    searchInput.focus();
    selectedIndex = 0;

    // Show default results (recent + popular)
    showDefaultResults();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close search modal
   */
  function closeSearch() {
    if (!searchModal) return;

    isOpen = false;
    searchModal.classList.add('hidden');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Handle search input
   */
  function handleSearchInput(e) {
    const query = e.target.value.trim();

    if (query.length === 0) {
      showDefaultResults();
      return;
    }

    if (!fuse) return;

    const results = fuse.search(query, { limit: 10 });
    filteredResults = results.map(r => r.item);
    selectedIndex = 0;

    if (filteredResults.length === 0) {
      showNoResults();
    } else {
      renderResults(filteredResults);
    }
  }

  /**
   * Show default results (recent searches + popular tools)
   */
  function showDefaultResults() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'ko';
    const recentText = lang === 'ko' ? '최근 검색' : 'Recent searches';
    const popularText = lang === 'ko' ? '인기 도구' : 'Popular tools';

    const recent = getRecentSearches();
    const popular = typeof getPopularTools === 'function' ? getPopularTools() : [];

    let html = '';

    // Recent searches
    if (recent.length > 0) {
      const recentTools = recent.map(id => getToolById(id)).filter(Boolean);
      if (recentTools.length > 0) {
        html += `
          <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            ${recentText}
          </div>
        `;
        html += renderToolList(recentTools, 0, lang);
      }
    }

    // Popular tools
    if (popular.length > 0) {
      html += `
        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700">
          ${popularText}
        </div>
      `;
      html += renderToolList(popular, recent.length, lang);
    }

    filteredResults = [...(recent.map(id => getToolById(id)).filter(Boolean)), ...popular];
    resultsContainer.innerHTML = html || renderAllCategories(lang);
    attachResultListeners();
  }

  /**
   * Show no results message
   */
  function showNoResults() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'ko';
    const noResultsText = lang === 'ko' ? '검색 결과가 없습니다' : 'No results found';
    const tryAgainText = lang === 'ko' ? '다른 검색어를 입력해보세요' : 'Try a different search term';

    resultsContainer.innerHTML = `
      <div class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium">${noResultsText}</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">${tryAgainText}</p>
      </div>
    `;
  }

  /**
   * Render search results
   */
  function renderResults(tools) {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'ko';
    resultsContainer.innerHTML = renderToolList(tools, 0, lang);
    attachResultListeners();
  }

  /**
   * Render tool list
   */
  function renderToolList(tools, startIndex, lang) {
    return tools.map((tool, idx) => {
      const index = startIndex + idx;
      const isSelected = index === selectedIndex;
      const name = getToolName(tool, lang);
      const description = getToolDescription(tool, lang);
      const path = getToolPath(tool, lang);
      const categoryLabel = categoryLabels[tool.category][lang];
      const categoryIcon = categoryIcons[tool.category];
      const categoryColor = categoryColors[tool.category] || 'from-blue-500 to-blue-600';

      return `
        <a href="${path}"
           class="search-result flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}"
           data-index="${index}">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center flex-shrink-0 shadow-md">
            <span class="text-white">
              ${categoryIcon}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 dark:text-white truncate">${name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">${description}</div>
          </div>
          <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex-shrink-0">
            ${categoryLabel}
          </span>
        </a>
      `;
    }).join('');
  }

  /**
   * Render all categories (fallback)
   */
  function renderAllCategories(lang) {
    const devText = lang === 'ko' ? '개발 도구' : 'Dev Tools';
    const lifeText = lang === 'ko' ? '생활 도구' : 'Life Tools';
    const pdfText = lang === 'ko' ? 'PDF 도구' : 'PDF Tools';

    return `
      <div class="py-8 text-center">
        <p class="text-gray-500 dark:text-gray-400 mb-4">${lang === 'ko' ? '검색어를 입력하거나 카테고리를 선택하세요' : 'Type to search or select a category'}</p>
        <div class="flex justify-center gap-2">
          <a href="${lang === 'ko' ? '/tools/dev/' : '/en/tools/dev/'}" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            ${devText}
          </a>
          <a href="${lang === 'ko' ? '/tools/life/' : '/en/tools/life/'}" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            ${lifeText}
          </a>
          <a href="${lang === 'ko' ? '/tools/pdf/' : '/en/tools/pdf/'}" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            ${pdfText}
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to results
   */
  function attachResultListeners() {
    const results = resultsContainer.querySelectorAll('.search-result');
    results.forEach(result => {
      result.addEventListener('mouseenter', (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        updateSelection(index);
      });
      result.addEventListener('click', (e) => {
        const toolId = filteredResults[selectedIndex]?.id;
        if (toolId) {
          saveRecentSearch(toolId);
        }
      });
    });
  }

  /**
   * Update visual selection
   */
  function updateSelection(index) {
    selectedIndex = index;
    const results = resultsContainer.querySelectorAll('.search-result');
    results.forEach((el, i) => {
      if (i === selectedIndex) {
        el.classList.add('bg-blue-50', 'dark:bg-blue-900/30');
      } else {
        el.classList.remove('bg-blue-50', 'dark:bg-blue-900/30');
      }
    });
  }

  /**
   * Select next result
   */
  function selectNext() {
    if (filteredResults.length === 0) return;
    const newIndex = (selectedIndex + 1) % filteredResults.length;
    updateSelection(newIndex);
    scrollToSelected();
  }

  /**
   * Select previous result
   */
  function selectPrev() {
    if (filteredResults.length === 0) return;
    const newIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
    updateSelection(newIndex);
    scrollToSelected();
  }

  /**
   * Scroll to keep selected item visible
   */
  function scrollToSelected() {
    const selected = resultsContainer.querySelector(`[data-index="${selectedIndex}"]`);
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /**
   * Navigate to selected result
   */
  function navigateToSelected() {
    const tool = filteredResults[selectedIndex];
    if (tool) {
      const lang = window.getCurrentLang ? window.getCurrentLang() : 'ko';
      const path = getToolPath(tool, lang);
      saveRecentSearch(tool.id);
      window.location.href = path;
    }
  }

  /**
   * Get recent searches from localStorage
   */
  function getRecentSearches() {
    try {
      const stored = localStorage.getItem('toolneat-recent-searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save recent search to localStorage
   */
  function saveRecentSearch(toolId) {
    try {
      let recent = getRecentSearches();
      // Remove if already exists
      recent = recent.filter(id => id !== toolId);
      // Add to beginning
      recent.unshift(toolId);
      // Keep only last 5
      recent = recent.slice(0, 5);
      localStorage.setItem('toolneat-recent-searches', JSON.stringify(recent));
    } catch {
      // Ignore localStorage errors
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }

  // Update search UI when language changes
  document.addEventListener('i18nApplied', () => {
    if (searchModal) {
      // Remove and recreate modal with new language
      searchModal.remove();
      searchModal = null;
      createSearchModal();
    }
  });

  // Expose functions globally
  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
})();
