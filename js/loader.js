/**
 * Stackly PRD Compliant Loader Controller
 * Enforces duration rule: 2-5 seconds maximum
 * Ensures accessibility and cleans up DOM once loaded
 */

(function () {
  'use strict';

  const MIN_LOADER_TIME = 2000; // 2.0s optimal minimum for full loaders (PRD page 4)
  const MAX_LOADER_TIME = 4500; // Never exceed 5s (PRD page 4, 7)
  const startTime = Date.now();

  function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);

    setTimeout(() => {
      loader.classList.add('loader-hidden');
      window.dispatchEvent(new CustomEvent('stacklyLoaderHidden'));

      // Update ARIA live announcement for screen readers
      const statusText = document.getElementById('loader-status');
      if (statusText) {
        statusText.textContent = 'Page loaded successfully';
      }

      // Remove from DOM after transition to eliminate GPU/memory usage (PRD page 12)
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 550);
    }, remainingTime);
  }

  // Hide when page has completed loading
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Safety fallback: guaranteed dismissal before 5 seconds (PRD Page 15 item 9)
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      hideLoader();
    }
  }, MAX_LOADER_TIME);
})();
