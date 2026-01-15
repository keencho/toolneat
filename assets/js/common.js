// Toolneat - Common JS

// Google Analytics (gtag.js)
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XFC6R4YHXS';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XFC6R4YHXS');
  window.gtag = gtag;
})();

// Theme Management (Dark Mode)

(function() {
  'use strict';

  // Get saved theme or default to 'light'
  const getTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to dark (not system preference)
    return 'dark';
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme immediately (before DOM loads)
  const currentTheme = getTheme();
  applyTheme(currentTheme);

  // Theme toggle function (global)
  window.toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    console.log('[Theme] Toggling:', isDark ? 'dark -> light' : 'light -> dark');
    console.log('[Theme] <html> classes before:', document.documentElement.className);

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);

    console.log('[Theme] <html> classes after:', document.documentElement.className);

    if (typeof updateThemeIcon === 'function') {
      updateThemeIcon(newTheme === 'dark');
    }
  };

  // Update theme icon (global)
  window.updateThemeIcon = (isDark) => {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  };

  // Initialize icon state after DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeIcon(isDark);
  });
})();

// Utility: Copy to clipboard
window.copyToClipboard = async (text, buttonEl) => {
  try {
    await navigator.clipboard.writeText(text);

    if (buttonEl) {
      const originalHTML = buttonEl.innerHTML;
      buttonEl.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
      buttonEl.classList.add('text-green-500');

      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
        buttonEl.classList.remove('text-green-500');
      }, 1500);
    }

    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

// Utility: Format number with commas
window.formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Utility: Debounce function (trailing edge - waits then executes)
window.debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utility: Immediate debounce (leading + trailing - executes immediately, then debounces)
window.debounceImmediate = (func, wait) => {
  let timeout;
  let lastRun = 0;
  return function executedFunction(...args) {
    const now = Date.now();
    clearTimeout(timeout);

    // Execute immediately if enough time has passed
    if (now - lastRun >= wait) {
      lastRun = now;
      func(...args);
    } else {
      // Schedule trailing execution
      timeout = setTimeout(() => {
        lastRun = Date.now();
        func(...args);
      }, wait - (now - lastRun));
    }
  };
};

// Utility: Throttle function (execute at most once per interval)
window.throttle = (func, limit) => {
  let inThrottle;
  let lastArgs;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
};

// Toast Notification System
window.toast = (() => {
  let container = null;

  const createContainer = () => {
    if (container) return container;

    // 컨테이너 안에 위치하도록 wrapper 생성
    const wrapper = document.createElement('div');
    wrapper.id = 'toast-wrapper';
    wrapper.className = 'fixed top-0 left-0 right-0 z-[100] pointer-events-none';
    wrapper.innerHTML = '<div class="container-main relative h-0"></div>';
    document.body.appendChild(wrapper);

    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'absolute top-4 right-0 flex flex-col gap-3 pointer-events-auto';
    wrapper.firstChild.appendChild(container);

    return container;
  };

  const config = {
    success: {
      bg: 'bg-green-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    },
    error: {
      bg: 'bg-red-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    },
    info: {
      bg: 'bg-blue-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }
  };

  const show = (message, type = 'info', duration = 3000) => {
    createContainer();
    const { bg, icon } = config[type] || config.info;

    const toast = document.createElement('div');
    toast.className = `
      flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg
      ${bg} text-white
      transform translate-x-full opacity-0 scale-95
      transition-all duration-300 ease-out
      min-w-[200px] max-w-[300px]
    `.replace(/\s+/g, ' ').trim();

    toast.innerHTML = `
      <div class="flex-shrink-0">${icon}</div>
      <span class="text-sm font-medium flex-1">${message}</span>
      <button class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full', 'opacity-0', 'scale-95');
      toast.classList.add('translate-x-0', 'opacity-100', 'scale-100');
    });

    // Remove after duration
    const timeout = setTimeout(() => removeToast(toast), duration);
    toast._timeout = timeout;
  };

  const removeToast = (toast) => {
    if (toast._timeout) clearTimeout(toast._timeout);
    toast.classList.remove('translate-x-0', 'opacity-100', 'scale-100');
    toast.classList.add('translate-x-full', 'opacity-0', 'scale-95');

    setTimeout(() => {
      toast.remove();
      const wrapper = document.getElementById('toast-wrapper');
      if (container && container.children.length === 0 && wrapper) {
        wrapper.remove();
        container = null;
      }
    }, 300);
  };

  return {
    show,
    success: (msg, duration) => show(msg, 'success', duration),
    error: (msg, duration) => show(msg, 'error', duration),
    warning: (msg, duration) => show(msg, 'warning', duration),
    info: (msg, duration) => show(msg, 'info', duration)
  };
})();

// Service Worker Registration
(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Calculate SW path based on current location
      const swPath = '/sw.js';

      navigator.serviceWorker.register(swPath)
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] Update found');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[SW] New version available');
              }
            });
          });
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });
    });
  }
})();
